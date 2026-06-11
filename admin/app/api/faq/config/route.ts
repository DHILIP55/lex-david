import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FaqConfig from "@/lib/models/FaqConfig";
import { verifyAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const doc = await FaqConfig.findById("faq-config");
  return NextResponse.json({
    sectionLabel: doc?.sectionLabel ?? "",
    sectionHeading: doc?.sectionHeading ?? "",
  });
}

export async function PUT(request: NextRequest) {
  verifyAuth(request);
  await connectDB();
  const body = await request.json();
  const data = await FaqConfig.findByIdAndUpdate(
    "faq-config",
    { $set: body },
    { upsert: true, new: true }
  );
  return NextResponse.json(data);
}
