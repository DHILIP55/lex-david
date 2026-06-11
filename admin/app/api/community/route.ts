import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Community from "@/lib/models/Community";
import { verifyAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const doc = await Community.findById("community");
  return NextResponse.json({
    _id: "community",
    aboutTitle: doc?.aboutTitle ?? "",
    aboutSubtitle: doc?.aboutSubtitle ?? "",
    aboutBody: doc?.aboutBody ?? "",
    establishedYear: doc?.establishedYear ?? "",
    creativeStudio: doc?.creativeStudio ?? "",
    cards: doc?.cards ?? [],
  });
}

export async function PUT(request: NextRequest) {
  verifyAuth(request);
  await connectDB();
  const raw = await request.json();
  const { _id, __v, ...fields } = raw as Record<string, unknown>;
  void _id; void __v;
  const data = await Community.findByIdAndUpdate(
    "community",
    { $set: fields },
    { upsert: true, new: true, strict: false }
  );
  return NextResponse.json(data);
}
