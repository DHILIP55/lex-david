"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";

type Card = { index: string; title: string; bgClass: string; body: string };
type CommunityData = {
  aboutTitle: string;
  aboutSubtitle: string;
  aboutBody: string;
  establishedYear: string;
  creativeStudio: string;
  cards: Card[];
};

const BG_OPTIONS = [
  { label: "Orange", value: "bg-[var(--orange-color-1)]" },
  { label: "Grey", value: "bg-[var(--grey-color-1)]" },
  { label: "Blue", value: "bg-[var(--blue-color-1)]" },
];

export default function CommunityPage() {
  const [data, setData] = useState<CommunityData>({
    aboutTitle: "", aboutSubtitle: "", aboutBody: "", establishedYear: "", creativeStudio: "Creative Studio", cards: [],
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get<CommunityData>("/api/community").then(({ data: d }) => {
      if (d.aboutTitle !== undefined) setData(d);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    await api.put("/api/community", data);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateCard = (i: number, field: keyof Card, value: string) => {
    setData((prev) => ({
      ...prev,
      cards: prev.cards.map((c, idx) => idx === i ? { ...c, [field]: value } : c),
    }));
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-white font-semibold">Community / About</h1>
          <p className="text-white/40 text-sm mt-1">Edit left panel text and scroll cards</p>
        </div>
        <button onClick={save} disabled={saving}
          className="px-5 py-2 rounded bg-white text-black text-sm font-semibold hover:bg-white/90 transition disabled:opacity-50">
          {saved ? "Saved!" : saving ? "Savingâ€¦" : "Save"}
        </button>
      </div>

      {/* Left panel */}
      <div className="p-6 rounded-lg bg-white/5 border border-white/10 mb-6">
        <h2 className="text-white/60 text-xs uppercase tracking-wider mb-4">Left Panel Text</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-white/40 block mb-1">Title</label>
            <input value={data.aboutTitle}
              onChange={(e) => setData((p) => ({ ...p, aboutTitle: e.target.value }))}
              className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30" />
          </div>
          <div>
            <label className="text-xs text-white/40 block mb-1">Subtitle (e.g. Studio / Chennai)</label>
            <input value={data.aboutSubtitle}
              onChange={(e) => setData((p) => ({ ...p, aboutSubtitle: e.target.value }))}
              className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30" />
          </div>
        </div>
        <div className="mb-4">
          <label className="text-xs text-white/40 block mb-1">Body Paragraph</label>
          <textarea value={data.aboutBody}
            onChange={(e) => setData((p) => ({ ...p, aboutBody: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/40 block mb-1">Established Year</label>
            <input value={data.establishedYear}
              onChange={(e) => setData((p) => ({ ...p, establishedYear: e.target.value }))}
              className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30" />
          </div>
          <div>
            <label className="text-xs text-white/40 block mb-1">Footer Label (e.g. Creative Studio)</label>
            <input value={data.creativeStudio}
              onChange={(e) => setData((p) => ({ ...p, creativeStudio: e.target.value }))}
              className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30" />
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4">
        <h2 className="text-white/60 text-xs uppercase tracking-wider">Scroll Cards</h2>
        {data.cards.map((card, i) => (
          <div key={card.index} className="p-5 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white/40 text-xs font-mono">{card.index}</span>
              <h3 className="text-white text-sm font-medium">Card {card.index}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-white/40 block mb-1">Title</label>
                <input value={card.title}
                  onChange={(e) => updateCard(i, "title", e.target.value)}
                  className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30" />
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-1">Background Color</label>
                <select value={card.bgClass}
                  onChange={(e) => updateCard(i, "bgClass", e.target.value)}
                  className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10 text-white text-sm outline-none focus:border-white/30">
                  {BG_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-white/40 block mb-1">Body Text</label>
              <textarea value={card.body}
                onChange={(e) => updateCard(i, "body", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30 resize-none" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <a href="http://localhost:3000/" target="_blank" rel="noopener noreferrer"
          className="text-sm text-white/40 hover:text-white transition underline">
          Preview on site →
        </a>
      </div>
    </div>
  );
}

