import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Social from "@/lib/models/Social";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const data = await Social.findById("social");
  return NextResponse.json(data ?? { items: [] });
}

export async function PUT(request: NextRequest) {
  verifyAuth(request);
  await connectDB();
  const body = await request.json();
  const data = await Social.findByIdAndUpdate("social", body, { upsert: true, new: true, overwrite: false });
  return NextResponse.json(data);
}
