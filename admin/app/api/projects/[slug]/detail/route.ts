import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ProjectDetail from "@/lib/models/ProjectDetail";
import { verifyAuth } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const { slug } = await params;
  const data = await ProjectDetail.findOne({ projectSlug: slug });
  return NextResponse.json(data ?? { projectSlug: slug, heading: "", subheading: "", bodyText: "", images: [], sections: [] });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  verifyAuth(request);
  await connectDB();
  const { slug } = await params;
  const body = await request.json();
  const data = await ProjectDetail.findOneAndUpdate(
    { projectSlug: slug },
    { ...body, projectSlug: slug },
    { upsert: true, new: true }
  );
  return NextResponse.json(data);
}
