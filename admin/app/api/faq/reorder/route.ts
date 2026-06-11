import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Faq from "@/lib/models/Faq";
import { verifyAuth } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  verifyAuth(request);
  await connectDB();
  const { ids } = await request.json() as { ids: string[] };
  await Promise.all(ids.map((id, idx) => Faq.findByIdAndUpdate(id, { order: idx })));
  return NextResponse.json({ ok: true });
}
