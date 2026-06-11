"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import ImageUploader from "@/app/components/ImageUploader";

function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center">
      <div className="bg-zinc-900 border border-white/20 rounded-xl shadow-2xl w-80 overflow-hidden">
        <div className="px-5 py-3 border-b border-white/10">
          <span className="text-white/40 text-xs uppercase tracking-wider font-medium">Confirm Action</span>
        </div>
        <div className="px-5 py-4">
          <p className="text-white text-sm leading-relaxed mb-5">{message}</p>
          <div className="flex justify-end gap-2">
            <button onClick={onCancel} className="px-4 py-2 text-xs text-white/50 hover:text-white rounded border border-white/10 hover:border-white/30 transition">Cancel</button>
            <button onClick={onConfirm} className="px-4 py-2 text-xs bg-white text-black rounded font-semibold hover:bg-white/90 transition">Yes, Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
}

type Project = {
  _id: string;
  title: string;
  slug: string;
  coverImageUrl: string;
  gridLayout: string;
  order: number;
  isPublished: boolean;
  category: string;
  description: string;
};

const GRID_OPTIONS = [
  { value: "full", label: "Full Width" },
  { value: "half", label: "Half Width" },
];

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    api.get<Project[]>("/api/projects").then(({ data }) => {
      const found = data.find((p) => p._id === id);
      if (found) {
        if (!["full", "half"].includes(found.gridLayout)) found.gridLayout = "half";
        setProject(found);
      }
    });
  }, [id]);

  const set = (field: keyof Project, value: unknown) =>
    setProject((prev) => prev ? { ...prev, [field]: value } : prev);

  const save = async () => {
    if (!project) return;
    setConfirm(false);
    setSaving(true);
    await api.put(`/api/projects/${project._id}`, project);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!project) return (
    <div className="max-w-2xl animate-pulse flex flex-col gap-5">
      <div className="h-8 w-48 bg-white/10 rounded" />
      <div className="p-6 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-white/10 rounded" />
          <div className="h-10 bg-white/10 rounded" />
        </div>
        <div className="h-10 bg-white/10 rounded" />
        <div className="h-10 bg-white/10 rounded" />
        <div className="h-40 bg-white/10 rounded" />
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl">
      {confirm && (
        <ConfirmModal
          message={`Save changes to "${project.title}"?`}
          onConfirm={save}
          onCancel={() => setConfirm(false)}
        />
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-white font-semibold">Edit Project</h1>
          <p className="text-white/40 text-sm mt-1 truncate max-w-xs">{project.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-white/50 text-xs cursor-pointer px-3 py-2 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition">
            <input
              type="checkbox"
              checked={project.isPublished}
              onChange={(e) => set("isPublished", e.target.checked)}
              className="accent-white"
            />
            Published
          </label>
          <button
            onClick={() => setConfirm(true)}
            disabled={saving}
            className="px-5 py-2 rounded bg-white text-black text-sm font-semibold hover:bg-white/90 transition disabled:opacity-50"
          >
            {saved ? "Saved!" : saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">

        {/* Title + Slug */}
        <div className="p-5 rounded-lg bg-white/5 border border-white/10 grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/40 block mb-1.5">Title</label>
            <input
              value={project.title}
              onChange={(e) => set("title", e.target.value)}
              className="w-full px-3 py-2.5 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/40 transition"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 block mb-1.5">Slug</label>
            <input
              value={project.slug}
              onChange={(e) => set("slug", e.target.value)}
              className="w-full px-3 py-2.5 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/40 transition font-mono"
            />
          </div>
        </div>

        {/* Grid Layout */}
        <div className="p-5 rounded-lg bg-white/5 border border-white/10">
          <label className="text-xs text-white/40 block mb-3">Grid Layout</label>
          <div className="grid grid-cols-4 gap-2">
            {GRID_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set("gridLayout", opt.value)}
                className={`py-2.5 px-3 rounded text-xs font-medium border transition text-center ${
                  project.gridLayout === opt.value
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="p-5 rounded-lg bg-white/5 border border-white/10">
          <label className="text-xs text-white/40 block mb-1.5">Category</label>
          <input
            value={project.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder="e.g. Branding, Packaging, Installation"
            className="w-full px-3 py-2.5 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/40 transition"
          />
        </div>

        {/* Cover Image */}
        <div className="p-5 rounded-lg bg-white/5 border border-white/10">
          <label className="text-xs text-white/40 block mb-3">Cover Image</label>
          <div className="flex gap-4 items-start">
            {project.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.coverImageUrl}
                alt="Cover"
                className="w-36 h-24 object-cover rounded-lg shrink-0 border border-white/10"
              />
            ) : (
              <div className="w-36 h-24 rounded-lg bg-white/5 border border-dashed border-white/20 flex items-center justify-center shrink-0">
                <span className="text-white/20 text-xs">No image</span>
              </div>
            )}
            <div className="flex-1">
              <ImageUploader
                label="Upload Image"
                currentUrl={project.coverImageUrl || undefined}
                onUploaded={(url) => set("coverImageUrl", url)}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/admin/projects/${id}/detail`)}
              className="px-4 py-2 rounded bg-white/10 text-white text-sm hover:bg-white/20 transition"
            >
              Edit Detail Page →
            </button>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded bg-white/5 text-white/40 text-sm hover:text-white transition"
            >
              Back
            </button>
          </div>
          {project.slug && (
            <a
              href={`http://localhost:3000/detail/${project.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/40 hover:text-white transition underline"
            >
              Preview on site →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
