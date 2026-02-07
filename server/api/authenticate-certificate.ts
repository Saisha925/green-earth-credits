import type { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs/promises";
import formidable, { File } from "formidable";
import pdfParse from "pdf-parse";

const BASE_URL = "https://v18.api.carbonmark.com";
const API_KEY = process.env.CARBONMARK_API_KEY ?? "cm_api_sandbox_13d435c7-525d-455e-ad44-d28a70522a5c";

const HEADERS = {
  Authorization: `Bearer ${API_KEY}`,
  Accept: "application/json",
};

const extractTextFromPdf = async (buffer: Buffer): Promise<string> => {
  const data = await pdfParse(buffer);
  return data.text ?? "";
};

const extractCertificateFields = (text: string) => {
  const patterns: Record<string, RegExp> = {
    project_name: /Project Name:\s*(.+)/i,
    vintage: /Vintage Year:\s*(\d{4})/i,
    country: /Country:\s*(.+)/i,
    methodology: /Methodology:\s*(.+)/i,
  };

  const fields: Record<string, string> = {};

  Object.entries(patterns).forEach(([key, pattern]) => {
    const match = text.match(pattern);
    if (match?.[1]) {
      fields[key] = match[1].trim();
    }
  });

  return fields;
};

const fetchCarbonmarkListings = async (): Promise<Record<string, unknown>[]> => {
  const response = await fetch(`${BASE_URL}/listings`, { headers: HEADERS });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Carbonmark API error: ${message}`);
  }

  const payload = (await response.json()) as Record<string, unknown> | Record<string, unknown>[];
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && typeof payload === "object") {
    const data = (payload as { data?: Record<string, unknown>[] }).data;
    return Array.isArray(data) ? data : [];
  }
  return [];
};

const similarity = (left: string, right: string): number => {
  const a = left.toLowerCase();
  const b = right.toLowerCase();
  if (!a && !b) return 1;
  if (!a || !b) return 0;

  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  const distance = matrix[a.length][b.length];
  const maxLen = Math.max(a.length, b.length) || 1;
  return 1 - distance / maxLen;
};

const authenticateCertificate = (
  certificate: Record<string, string>,
  listings: Record<string, unknown>[],
) => {
  let bestMatch: Record<string, unknown> | null = null;
  let bestScore = 0;

  listings.forEach((listing) => {
    const project = (listing.project ?? {}) as Record<string, unknown>;
    let score = 0;

    score +=
      similarity(certificate.project_name ?? "", String(project.name ?? "")) * 0.5;

    if (certificate.vintage && certificate.vintage === String(project.vintage ?? "")) {
      score += 0.2;
    }

    if (
      certificate.country &&
      certificate.country.toLowerCase() === String(project.country ?? "").toLowerCase()
    ) {
      score += 0.15;
    }

    if (certificate.methodology && certificate.methodology === String(project.methodology ?? "")) {
      score += 0.15;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = listing;
    }
  });

  return {
    authenticated: bestScore >= 0.75,
    confidence: Number(bestScore.toFixed(2)),
    matched_credit_id: bestMatch ? (bestMatch.creditId as string | undefined) ?? null : null,
    matched_project: bestMatch ? (bestMatch.project as Record<string, unknown> | undefined) ?? null : null,
  };
};

const parseForm = async (req: IncomingMessage) => {
  const form = formidable({ multiples: false, keepExtensions: true });
  return new Promise<{ file?: File }>((resolve, reject) => {
    form.parse(req, (err, _fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      const rawFile = files.file;
      const file = Array.isArray(rawFile) ? rawFile[0] : rawFile;
      resolve({ file: file ?? undefined });
    });
  });
};

const sendJson = (res: ServerResponse, statusCode: number, payload: Record<string, unknown>) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

const handler = async (req: IncomingMessage, res: ServerResponse) => {
  if (req.method !== "POST") {
    sendJson(res, 405, { success: false, error: "Method not allowed" });
    return;
  }

  let tempFilePath: string | undefined;

  try {
    const { file } = await parseForm(req);
    if (!file) {
      sendJson(res, 400, { success: false, error: "Missing file upload" });
      return;
    }

    tempFilePath = file.filepath;

    if (!file.mimetype || !file.mimetype.includes("pdf")) {
      sendJson(res, 200, { success: false, error: "Unsupported file type. Please upload a PDF certificate." });
      return;
    }

    const buffer = await fs.readFile(file.filepath);
    const pdfText = await extractTextFromPdf(buffer);
    const certificate = extractCertificateFields(pdfText);

    if (!Object.keys(certificate).length) {
      sendJson(res, 200, { success: false, error: "Unable to extract certificate fields from PDF" });
      return;
    }

    const listings = await fetchCarbonmarkListings();
    const result = authenticateCertificate(certificate, listings);

    // Only return success when the certificate actually matches (confidence >= 0.75)
    if (!result.authenticated) {
      sendJson(res, 200, { success: false, data: { certificate, result } });
      return;
    }

    sendJson(res, 200, {
      success: true,
      data: {
        certificate,
        result,
      },
    });
  } catch (error) {
    sendJson(res, 500, { success: false, error: (error as Error).message });
  } finally {
    if (tempFilePath) {
      await fs.unlink(tempFilePath).catch(() => {});
    }
  }
};

export default handler;
