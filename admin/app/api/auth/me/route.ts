import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Admin from "@/lib/models/Admin";
import { verifyAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { adminId } = verifyAuth(request);
  await connectDB();
  const admin = await Admin.findById(adminId).select("-passwordHash");
  if (!admin) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(admin);
}
