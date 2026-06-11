import type { Metadata } from "next";
import { Poppins, Playfair_Display, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import AnalyticsTracker from "@/components/site/AnalyticsTracker";
import { connectDB } from "@/lib/db";
import Nav from "@/lib/models/Nav";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-poppins",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    await connectDB();
    const nav = await Nav.findById("nav").lean() as { logoUrl?: string } | null;
    const icon = nav?.logoUrl || undefined;
    return {
      title: "Lex & David",
      description: "Creative Studio",
      ...(icon && { icons: { icon } }),
    };
  } catch {
    return { title: "Lex & David", description: "Creative Studio" };
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full antialiased ${poppins.variable} ${playfair.variable} ${ibmPlexMono.variable}`}>
      <body className="min-h-full flex flex-col">
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
