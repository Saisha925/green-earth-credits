import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectToDatabase } from "../_lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    return getProfile(req, res);
  } else if (req.method === "PUT") {
    return updateProfile(req, res);
  }
  return res.status(405).json({ error: "Method not allowed" });
}

async function getProfile(req: VercelRequest, res: VercelResponse) {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const { db } = await connectToDatabase();
    const usersCol = db.collection("users");

    let userDoc;
    try {
      userDoc = await usersCol.findOne({ _id: new ObjectId(userId) });
    } catch {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
    }

    const profile = {
      id: userDoc._id.toString(),
      user_id: userDoc._id.toString(),
      full_name: userDoc.full_name,
      email: userDoc.email,
      phone: userDoc.phone || "",
      avatar_url: userDoc.avatar_url || "",
      role: userDoc.role,
      created_at: userDoc.created_at,
      updated_at: userDoc.updated_at || userDoc.created_at,
    };

    return res.status(200).json({ success: true, profile, role: userDoc.role });
  } catch (error: any) {
    console.error("Get profile error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updateProfile(req: VercelRequest, res: VercelResponse) {
  try {
    const { userId, full_name, email, phone } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const { db } = await connectToDatabase();
    const usersCol = db.collection("users");

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (full_name !== undefined) updates.full_name = full_name;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;

    let result;
    try {
      result = await usersCol.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updates },
        { returnDocument: "after" }
      );
    } catch {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    const profile = {
      id: result._id.toString(),
      user_id: result._id.toString(),
      full_name: result.full_name,
      email: result.email,
      phone: result.phone || "",
      avatar_url: result.avatar_url || "",
      role: result.role,
      created_at: result.created_at,
      updated_at: result.updated_at,
    };

    return res.status(200).json({ success: true, profile });
  } catch (error: any) {
    console.error("Update profile error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
