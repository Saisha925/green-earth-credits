import type { IncomingMessage, ServerResponse } from "node:http";
import { readListings } from "../lib/listingStore";

const sendJson = (res: ServerResponse, statusCode: number, payload: Record<string, unknown>) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

const handler = async (req: IncomingMessage, res: ServerResponse) => {
  if (req.method !== "GET") {
    sendJson(res, 405, { success: false, error: "Method not allowed" });
    return;
  }

  try {
    const listings = await readListings();
    sendJson(res, 200, { success: true, data: listings });
  } catch (error) {
    sendJson(res, 500, { success: false, error: (error as Error).message });
  }
};

export default handler;
