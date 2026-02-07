import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectToDatabase } from "./_lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    return getSellerListings(req, res);
  } else if (req.method === "POST") {
    return addListing(req, res);
  }
  return res.status(405).json({ error: "Method not allowed" });
}

async function getSellerListings(req: VercelRequest, res: VercelResponse) {
  try {
    const sellerId = req.query.sellerId as string;
    if (!sellerId) {
      return res.status(400).json({ error: "sellerId is required" });
    }

    const { db } = await connectToDatabase();
    const sellersCol = db.collection("sellers");

    const listings = await sellersCol
      .find({ sellerId })
      .sort({ createdAt: -1 })
      .toArray();

    // Map MongoDB documents to the expected frontend format
    const mapped = listings.map((doc) => ({
      id: doc._id.toString(),
      seller_id: doc.sellerId,
      project_name: doc.projectName,
      description: doc.description || "",
      category: doc.category,
      registry: doc.registry || "",
      credits: doc.tonnesAvailable,
      vintage_year: doc.vintage,
      price_per_tonne: doc.pricePerTonne,
      latitude: doc.latitude || null,
      longitude: doc.longitude || null,
      country: doc.country || "",
      status: doc.status || "active",
      created_at: doc.createdAt,
      updated_at: doc.updatedAt || doc.createdAt,
    }));

    return res.status(200).json({ success: true, listings: mapped });
  } catch (error: any) {
    console.error("Get seller listings error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function addListing(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      sellerId,
      projectName,
      description,
      category,
      registry,
      credits,
      vintageYear,
      pricePerTonne,
      latitude,
      longitude,
      country,
      certificateId,
      image,
    } = req.body;

    if (!sellerId || !projectName || !category || !credits || !pricePerTonne) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { db } = await connectToDatabase();
    const sellersCol = db.collection("sellers");

    const now = new Date().toISOString();
    const doc = {
      sellerId,
      certificateId: certificateId || null,
      projectName,
      description: description || "",
      category,
      registry: registry || "",
      tonnesAvailable: Number(credits),
      vintage: Number(vintageYear) || new Date().getFullYear(),
      pricePerTonne: Number(pricePerTonne),
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      country: country || "",
      image: image || "",
      status: "active",
      createdAt: now,
      updatedAt: now,
    };

    const result = await sellersCol.insertOne(doc);

    const listing = {
      id: result.insertedId.toString(),
      seller_id: doc.sellerId,
      project_name: doc.projectName,
      description: doc.description,
      category: doc.category,
      registry: doc.registry,
      credits: doc.tonnesAvailable,
      vintage_year: doc.vintage,
      price_per_tonne: doc.pricePerTonne,
      latitude: doc.latitude,
      longitude: doc.longitude,
      country: doc.country,
      status: doc.status,
      created_at: doc.createdAt,
      updated_at: doc.updatedAt,
    };

    return res.status(201).json({ success: true, listing });
  } catch (error: any) {
    console.error("Add listing error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
