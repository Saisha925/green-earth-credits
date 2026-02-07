import { SequenceMatcher } from "difflib";

// Types for Carbon Certificate Authentication
export interface CertificateFields {
  project_name?: string;
  vintage?: string;
  country?: string;
  methodology?: string;
}

export interface CarbonmarkListing {
  creditId: string;
  project: {
    name: string;
    vintage: number;
    country: string;
    methodology: string;
  };
}

export interface AuthenticationResult {
  authenticated: boolean;
  confidence: number;
  matched_credit_id: string | null;
  matched_project: any | null;
}

const BASE_URL = "https://v18.api.carbonmark.com";
const API_KEY = "cm_api_sandbox_13d435c7-525d-455e-ad44-d28a70522a5c";

const HEADERS = {
  Authorization: `Bearer ${API_KEY}`,
  Accept: "application/json",
};

/**
 * Extract text from PDF (would need pdfjs-dist in production)
 * For now, return placeholder since we're in browser/Node environment
 */
export const extractTextFromPdf = async (
  pdfData: Buffer | ArrayBuffer
): Promise<string> => {
  // In production, use pdfjs-dist to extract text from PDF
  // For now, return empty and rely on direct certificate data submission
  console.log("[v0] PDF extraction would require server-side library");
  return "";
};

/**
 * Extract certificate fields from text using regex patterns
 */
export const extractCertificateFields = (text: string): CertificateFields => {
  const patterns = {
    project_name: /Project Name:\s*(.+)/i,
    vintage: /Vintage Year:\s*(\d{4})/i,
    country: /Country:\s*(.+)/i,
    methodology: /Methodology:\s*(.+)/i,
  };

  const fields: CertificateFields = {};

  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match) {
      fields[key as keyof CertificateFields] = match[1].trim();
    }
  }

  return fields;
};

/**
 * Calculate similarity between two strings (0-1)
 */
export const calculateSimilarity = (a: string, b: string): number => {
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();

  if (!aLower || !bLower) return 0;

  // Simple similarity using SequenceMatcher logic
  const matches = findMatches(aLower, bLower);
  const totalLength = Math.max(aLower.length, bLower.length);

  return totalLength > 0 ? matches / totalLength : 0;
};

/**
 * Find matching characters between two strings
 */
const findMatches = (a: string, b: string): number => {
  let matches = 0;
  const shorter = a.length < b.length ? a : b;
  const longer = a.length < b.length ? b : a;

  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) {
      matches++;
    }
  }

  return matches;
};

/**
 * Fetch Carbonmark listings from API
 */
export const fetchCarbonmarkListings = async (): Promise<
  CarbonmarkListing[]
> => {
  try {
    const url = `${BASE_URL}/listings`;
    const response = await fetch(url, {
      headers: HEADERS,
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Carbonmark API error: ${response.statusText}`);
    }

    const payload = await response.json();

    // Handle both list and wrapped responses
    if (Array.isArray(payload)) {
      return payload;
    } else if (typeof payload === "object" && payload.data) {
      return payload.data;
    }

    return [];
  } catch (error) {
    console.error("[v0] Error fetching Carbonmark listings:", error);
    throw error;
  }
};

/**
 * Authenticate a certificate against Carbonmark API data
 */
export const authenticateCertificate = (
  cert: CertificateFields,
  listings: CarbonmarkListing[]
): AuthenticationResult => {
  let bestMatch: CarbonmarkListing | null = null;
  let bestScore = 0;

  for (const listing of listings) {
    const project = listing.project;
    let score = 0;

    // Project name (strongest signal) - 50%
    score +=
      calculateSimilarity(cert.project_name || "", project.name || "") * 0.5;

    // Vintage - 20%
    if (cert.vintage && String(project.vintage) === cert.vintage) {
      score += 0.2;
    }

    // Country - 15%
    if (
      cert.country &&
      cert.country.toLowerCase() === (project.country || "").toLowerCase()
    ) {
      score += 0.15;
    }

    // Methodology - 15%
    if (cert.methodology === project.methodology) {
      score += 0.15;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = listing;
    }
  }

  return {
    authenticated: bestScore >= 0.75,
    confidence: Math.round(bestScore * 100) / 100,
    matched_credit_id: bestMatch?.creditId || null,
    matched_project: bestMatch?.project || null,
  };
};

/**
 * Main authentication flow - takes certificate fields and authenticates
 */
export const authenticateCarbonCredit = async (
  certificateData: CertificateFields
): Promise<AuthenticationResult> => {
  try {
    console.log("[v0] Starting carbon credit authentication...");

    // Fetch listings from Carbonmark
    const listings = await fetchCarbonmarkListings();
    console.log("[v0] Fetched listings:", listings.length);

    // Authenticate certificate
    const result = authenticateCertificate(certificateData, listings);
    console.log("[v0] Authentication result:", result);

    return result;
  } catch (error) {
    console.error("[v0] Authentication error:", error);
    throw error;
  }
};
