import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectToDatabase } from "../_lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { db } = await connectToDatabase();
    const usersCol = db.collection("users");

    // Find the user
    const userDoc = await usersCol.findOne({ email: email.toLowerCase() });
    if (!userDoc) {
      return res.status(401).json({ error: "Invalid email or password. Please try again." });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userDoc.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password. Please try again." });
    }

    // Return user data (never the password)
    const user = {
      id: userDoc._id.toString(),
      email: userDoc.email,
      full_name: userDoc.full_name,
      phone: userDoc.phone || "",
      role: userDoc.role,
      avatar_url: userDoc.avatar_url || "",
      created_at: userDoc.created_at,
    };

    return res.status(200).json({ success: true, user });
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
