import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";
import Admin from "@/lib/models/Admin";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  await connectDB();
  const { email, password } = await request.json();
  const admin = await Admin.findOne({ email });
  if (!admin) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  const token = signToken(String(admin._id));
  return NextResponse.json({ token });
}
