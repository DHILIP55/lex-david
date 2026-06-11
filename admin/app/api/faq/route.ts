import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Faq from "@/lib/models/Faq";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const data = await Faq.find().sort({ order: 1 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  verifyAuth(request);
  await connectDB();
  const body = await request.json();
  const count = await Faq.countDocuments();
  const faq = await Faq.create({ ...body, order: count });
  return NextResponse.json(faq, { status: 201 });
}
