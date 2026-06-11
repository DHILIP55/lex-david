import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Service from "@/lib/models/Service";
import { verifyAuth } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  verifyAuth(request);
  await connectDB();
  const { ids } = await request.json() as { ids: string[] };
  await Promise.all(
    ids.map((id, idx) =>
      Service.findByIdAndUpdate(id, { order: idx, index: String(idx + 1).padStart(2, "0") })
    )
  );
  return NextResponse.json({ ok: true });
}
