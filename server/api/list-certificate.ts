import type { IncomingMessage, ServerResponse } from "node:http";
import crypto from "node:crypto";
import { readJsonBody } from "../lib/readRequestBody";
import { readListings, writeListings, MarketplaceListing } from "../lib/listingStore";

type ListingPayload = {
  projectName: string;
  ownerName: string;
  category: string;
  registry: string;
  credits: number | string;
  vintageYear: number | string;
  pricePerTonne: number | string;
  latitude?: number | string;
  longitude?: number | string;
  country?: string;
  sellerId?: string | null;
  sellerEmail?: string | null;
};

type ListCertificateRequest = {
  listing?: ListingPayload;
  authentication?: Record<string, unknown> | null;
};

const defaultImages: Record<string, string> = {
  Reforestation: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&h=400&fit=crop",
  "Avoided Deforestation": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
  "Blue Carbon": "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&h=400&fit=crop",
  "Renewable Energy": "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=600&h=400&fit=crop",
  "Clean Cookstoves": "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&h=400&fit=crop",
  "Energy Efficiency": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop",
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

  try {
    const body = await readJsonBody<ListCertificateRequest>(req);
    if (!body?.listing) {
      sendJson(res, 400, { success: false, error: "Missing listing data" });
      return;
    }

    const listing = body.listing;
    const certificate = (body.authentication as { certificate?: Record<string, unknown> | null })?.certificate ?? null;
    const authentication = (body.authentication as { result?: Record<string, unknown> | null })?.result ?? null;

    const newListing: MarketplaceListing = {
      id: crypto.randomUUID(),
      title: listing.projectName,
      description: `Listed by ${listing.ownerName}. ${listing.credits} credits available.`,
      image: defaultImages[listing.category] ?? defaultImages["Reforestation"],
      pricePerTonne: Number(listing.pricePerTonne),
      country: listing.country ?? (certificate?.country as string | undefined) ?? "Unknown",
      category: listing.category,
      vintage: Number(listing.vintageYear),
      verified: true,
      registry: listing.registry,
      credits: Number(listing.credits),
      seller: {
        id: listing.sellerId ?? null,
        name: listing.ownerName,
        email: listing.sellerEmail ?? null,
      },
      certificate,
      authentication,
      createdAt: new Date().toISOString(),
    };

    const listings = await readListings();
    listings.unshift(newListing);
    await writeListings(listings);

    sendJson(res, 200, { success: true, data: newListing });
  } catch (error) {
    sendJson(res, 500, { success: false, error: (error as Error).message });
  }
};

export default handler;
