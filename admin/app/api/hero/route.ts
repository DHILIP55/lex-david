import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Hero from "@/lib/models/Hero";
import { verifyAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const doc = await Hero.findById("hero");
  return NextResponse.json({
    _id: "hero",
    words: doc?.words ?? [],
    backgroundType: doc?.backgroundType ?? "image",
    backgroundImageUrl: doc?.backgroundImageUrl ?? "",
    backgroundImages: doc?.backgroundImages ?? [],
    backgroundVideoUrl: doc?.backgroundVideoUrl ?? "",
  });
}

export async function PUT(request: NextRequest) {
  verifyAuth(request);
  await connectDB();
  const raw = await request.json();
  // Strip _id and __v — MongoDB rejects $set on immutable fields
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, __v, ...fields } = raw as Record<string, unknown>;
  const data = await Hero.findByIdAndUpdate(
    "hero",
    { $set: fields },
    { upsert: true, new: true, strict: false }
  );
  return NextResponse.json(data);
}
