import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/lib/models/Project";
import { verifyAuth } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const { slug } = await params;
  const data = await Project.findOne({ slug });
  if (!data) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  verifyAuth(request);
  await connectDB();
  const { slug: id } = await params;
  const body = await request.json();
  const data = await Project.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  verifyAuth(request);
  await connectDB();
  const { slug: id } = await params;
  await Project.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
