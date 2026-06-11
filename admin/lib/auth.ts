import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET ?? "lex_david_super_secret_jwt_key_2024";

export function signToken(adminId: string) {
  return jwt.sign({ adminId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAuth(request: NextRequest): { adminId: string } {
  const authHeader = request.headers.get("authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    throw NextResponse.json({ message: "No token provided" }, { status: 401 });
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { adminId: string };
    return { adminId: payload.adminId };
  } catch {
    throw NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
}
