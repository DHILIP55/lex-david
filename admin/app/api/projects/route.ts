import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/lib/models/Project";
import { verifyAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  await connectDB();
  const published = request.nextUrl.searchParams.get("published");
  const query = published === "true" ? { isPublished: true } : {};
  const data = await Project.find(query).sort({ order: 1 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  verifyAuth(request);
  await connectDB();
  const body = await request.json();
  const count = await Project.countDocuments();
  const project = await Project.create({ ...body, order: count });
  return NextResponse.json(project, { status: 201 });
}
