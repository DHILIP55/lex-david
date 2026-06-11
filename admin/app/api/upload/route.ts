import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { verifyAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  verifyAuth(request);
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ message: "No file uploaded" }, { status: 400 });

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ message: "Only image files allowed" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${Date.now()}${ext}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
