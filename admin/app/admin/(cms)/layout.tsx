import type { Metadata } from "next";
import AuthGuard from "@/app/components/AuthGuard";
import Sidebar from "@/app/components/Sidebar";
import { connectDB } from "@/lib/db";
import Nav from "@/lib/models/Nav";

export async function generateMetadata(): Promise<Metadata> {
  try {
    await connectDB();
    const nav = await Nav.findById("nav").lean() as { logoUrl?: string } | null;
    const icon = nav?.logoUrl || undefined;
    return {
      title: "Lex & David — CMS",
      ...(icon && { icons: { icon } }),
    };
  } catch {
    return { title: "Lex & David — CMS" };
  }
}

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-zinc-900">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </AuthGuard>
  );
}

