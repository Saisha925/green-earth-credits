import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectToDatabase } from "../_lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password, name, phone, role } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: "Missing required fields: email, password, name, role" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    if (!["buyer", "seller"].includes(role)) {
      return res.status(400).json({ error: "Role must be 'buyer' or 'seller'" });
    }

    const { db } = await connectToDatabase();
    const usersCol = db.collection("users");

    // Check if email already exists
    const existingUser = await usersCol.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: "This email is already registered. Please log in instead." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user document
    const now = new Date().toISOString();
    const userDoc = {
      email: email.toLowerCase(),
      password: hashedPassword,
      full_name: name,
      phone: phone || "",
      role,
      avatar_url: "",
      created_at: now,
      updated_at: now,
    };

    const result = await usersCol.insertOne(userDoc);

    // Return user data (never return password)
    const user = {
      id: result.insertedId.toString(),
      email: userDoc.email,
      full_name: userDoc.full_name,
      phone: userDoc.phone,
      role: userDoc.role,
      avatar_url: userDoc.avatar_url,
      created_at: userDoc.created_at,
    };

    return res.status(201).json({ success: true, user });
  } catch (error: any) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
