"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/utils/api";

type SocialLink = { label: string; url: string; order: number };

export default function Footer() {
  const [socials, setSocials] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetchApi("/api/nav")
      .then((d) => {
        const data = d as { socialLinks?: SocialLink[] };
        setSocials([...(data.socialLinks ?? [])].sort((a, b) => a.order - b.order));
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-white border-t border-black/10 px-8 py-6">
      <div className="max-w-site mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-primary font-bold text-power tracking-widest uppercase text-black">
          Lex &amp; David
        </span>

        {socials.length > 0 && (
          <div className="flex gap-6 text-power text-black/60">
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        )}

        <p className="text-power text-black/40">
          &copy; {new Date().getFullYear()} Lex &amp; David
        </p>
      </div>
    </footer>
  );
}
