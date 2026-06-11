import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Faq from "@/lib/models/Faq";
import { verifyAuth } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  verifyAuth(request);
  await connectDB();
  const { id } = await params;
  const body = await request.json();
  const data = await Faq.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  verifyAuth(request);
  await connectDB();
  const { id } = await params;
  await Faq.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
