import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Service from "@/lib/models/Service";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const data = await Service.find().sort({ order: 1 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  verifyAuth(request);
  await connectDB();
  const body = await request.json();
  const count = await Service.countDocuments();
  const service = await Service.create({ ...body, order: count });
  return NextResponse.json(service, { status: 201 });
}
