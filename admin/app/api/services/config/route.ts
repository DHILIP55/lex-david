import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ServicesConfig from "@/lib/models/ServicesConfig";
import { verifyAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const doc = await ServicesConfig.findById("services-config");
  return NextResponse.json({
    sectionLabel: doc?.sectionLabel ?? "",
    sectionHeading: doc?.sectionHeading ?? "",
  });
}

export async function PUT(request: NextRequest) {
  verifyAuth(request);
  await connectDB();
  const body = await request.json();
  const data = await ServicesConfig.findByIdAndUpdate(
    "services-config",
    { $set: body },
    { upsert: true, new: true }
  );
  return NextResponse.json(data);
}
