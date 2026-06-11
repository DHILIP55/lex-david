"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/utils/api";

type SocialItem = { label: string; value: string; order: number };

export default function SocialSection() {
  const [items, setItems] = useState<SocialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/api/social").then((data) => {
      const d = data as { items: SocialItem[] };
      setItems((d.items ?? []).sort((a, b) => a.order - b.order));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <section className="w-full pt-20 bg-[#e9e9e6]">
      <div className="animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full border-b border-black/20 px-4 py-6 flex flex-col gap-3">
            <div className="h-4 w-28 bg-black/10 rounded" />
            <div className="h-8 w-64 bg-black/10 rounded" />
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <section className="w-full pt-20 h-full bg-[#e9e9e6] overflow-x-hidden">
      <div className="max-w-full mx-auto">
        {items.map((item, index) => (
          <button key={index} className="group w-full border-b border-black/20 px-4 gap-1 py-2 flex flex-col md:flex-row md:items-center justify-center text-left">
            <span className="text-power font-secondary text-black/60 mb-2 pb-5 md:mb-0">{item.label}</span>
            <h1 className="text-subhead font-mono lowercase transition-transform break-words duration-300 group-hover:translate-x-5">{item.value}</h1>
          </button>
        ))}
      </div>
    </section>
  );
}
