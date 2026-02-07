import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectToDatabase } from "./_lib/mongodb";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    return getRecords(req, res);
  } else if (req.method === "POST") {
    return createRecord(req, res);
  }
  return res.status(405).json({ error: "Method not allowed" });
}

async function getRecords(req: VercelRequest, res: VercelResponse) {
  try {
    const buyerId = req.query.buyerId as string;
    if (!buyerId) {
      return res.status(400).json({ error: "buyerId is required" });
    }

    const { db } = await connectToDatabase();
    const creditsCol = db.collection("credits");

    const records = await creditsCol
      .find({ ownerId: buyerId })
      .sort({ uploadedAt: -1 })
      .toArray();

    const mapped = records.map((doc) => ({
      id: doc._id.toString(),
      buyer_id: doc.ownerId,
      certificate_id: doc.certificateId || doc._id.toString().slice(0, 8),
      project_name: doc.metadata?.project_name || doc.projectName || "Carbon Credit",
      seller_name: doc.sellerName || "Marketplace Seller",
      tonnes: doc.tonnes || 0,
      price_per_tonne: doc.pricePerTonne || 0,
      total_amount_paid: doc.totalAmountPaid || 0,
      platform_fee_amount: doc.platformFee || 0,
      beneficiary_name: doc.beneficiaryName || "",
      registry: doc.metadata?.registry || "",
      category: doc.metadata?.category || "",
      vintage_year: doc.metadata?.vintage || null,
      status: doc.valid ? "completed" : "pending",
      created_at: doc.uploadedAt || doc.createdAt || new Date().toISOString(),
    }));

    return res.status(200).json({ success: true, records: mapped });
  } catch (error: any) {
    console.error("Get retirement records error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function createRecord(req: VercelRequest, res: VercelResponse) {
  try {
    const record = req.body;

    if (!record.ownerId) {
      return res.status(400).json({ error: "ownerId is required" });
    }

    const { db } = await connectToDatabase();
    const creditsCol = db.collection("credits");

    const now = new Date().toISOString();
    const doc = {
      ownerId: record.ownerId,
      certificateId: record.certificateId || null,
      projectName: record.projectName || "",
      sellerName: record.sellerName || "",
      tonnes: record.tonnes || 0,
      pricePerTonne: record.pricePerTonne || 0,
      totalAmountPaid: record.totalAmountPaid || 0,
      platformFee: record.platformFee || 0,
      beneficiaryName: record.beneficiaryName || "",
      metadata: record.metadata || {},
      valid: record.valid !== false,
      uploadedAt: now,
    };

    const result = await creditsCol.insertOne(doc);

    return res.status(201).json({
      success: true,
      record: { ...doc, _id: result.insertedId.toString() },
    });
  } catch (error: any) {
    console.error("Create retirement record error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
