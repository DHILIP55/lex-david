import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const { email, subject, message } = await request.json();

  if (!email || !subject || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Lex & David Enquiry" <${process.env.GMAIL_USER}>`,
    to: process.env.ENQUIRY_TO,
    replyTo: email,
    subject: `Enquiry: ${subject}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="border-bottom:1px solid #eee;padding-bottom:12px;">New Enquiry</h2>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
        <p style="white-space:pre-wrap;">${message}</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
