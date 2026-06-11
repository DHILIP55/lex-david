"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import ImageUploader from "@/app/components/ImageUploader";

export default function NewProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    coverImageUrl: "",
    gridLayout: "full",
    category: "",
    isPublished: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const set = (field: string, value: unknown) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "title" && !prev.slug) updated.slug = autoSlug(value as string);
      return updated;
    });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/api/projects", form);
      router.replace("/admin/projects");
    } catch {
      setError("Failed to create project. Slug may already exist.");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl text-white font-semibold">New Project</h1>
        <p className="text-white/40 text-sm mt-1">Create a new portfolio project</p>
      </div>

      <form onSubmit={save} className="flex flex-col gap-5 p-6 rounded-lg bg-white/5 border border-white/10">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/40 block mb-1">Title</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} required
              className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30" />
          </div>
          <div>
            <label className="text-xs text-white/40 block mb-1">Slug (URL)</label>
            <input value={form.slug} onChange={(e) => set("slug", e.target.value)} required
              className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/40 block mb-1">Category</label>
            <input value={form.category} onChange={(e) => set("category", e.target.value)}
              className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30" />
          </div>
          <div>
            <label className="text-xs text-white/40 block mb-1">Grid Layout</label>
            <select value={form.gridLayout} onChange={(e) => set("gridLayout", e.target.value)}
              className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10 text-white text-sm outline-none focus:border-white/30">
              <option value="full">Full width</option>
              <option value="half">Half width</option>
            </select>
          </div>
        </div>

        <ImageUploader
          label="Cover Image"
          currentUrl={form.coverImageUrl || undefined}
          onUploaded={(url) => set("coverImageUrl", url)}
        />

        <label className="flex items-center gap-2 text-white/60 text-sm cursor-pointer">
          <input type="checkbox" checked={form.isPublished} onChange={(e) => set("isPublished", e.target.checked)} className="accent-white" />
          Publish immediately
        </label>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="px-6 py-2 rounded bg-white text-black text-sm font-semibold hover:bg-white/90 transition disabled:opacity-50">
            {saving ? "Creatingâ€¦" : "Create Project"}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-4 py-2 rounded bg-white/10 text-white text-sm hover:bg-white/20 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

