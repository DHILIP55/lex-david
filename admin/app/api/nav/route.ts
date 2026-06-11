import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Nav from "@/lib/models/Nav";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const data = await Nav.findById("nav");
  return NextResponse.json(data ?? { items: [], mobileFooterLinks: [] });
}

export async function PUT(request: NextRequest) {
  verifyAuth(request);
  await connectDB();
  const body = await request.json();
  const data = await Nav.findByIdAndUpdate("nav", body, { upsert: true, new: true, overwrite: false });
  return NextResponse.json(data);
}
