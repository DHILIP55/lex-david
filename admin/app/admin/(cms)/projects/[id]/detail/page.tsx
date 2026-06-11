"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import ImageUploader from "@/app/components/ImageUploader";
import TrashIcon from "@/app/components/TrashIcon";

type ImageLayout = "full" | "half";
type ProjectImage = { url: string; layout: ImageLayout; order: number };
type Section = { subheading: string; description: string };
type DetailData = { heading: string; bodyText: string; images: ProjectImage[]; sections: Section[] };
type ProjectMeta = { _id: string; title: string; slug: string; coverImageUrl: string };
type ConfirmState = { message: string; onConfirm: () => void } | null;

function GripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="5" cy="4" r="1.5" /><circle cx="11" cy="4" r="1.5" />
      <circle cx="5" cy="8" r="1.5" /><circle cx="11" cy="8" r="1.5" />
      <circle cx="5" cy="12" r="1.5" /><circle cx="11" cy="12" r="1.5" />
    </svg>
  );
}

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

export default function ProjectDetailEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [data, setData] = useState<DetailData>({ heading: "", bodyText: "", images: [], sections: [] });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [errors, setErrors] = useState<{ heading?: string; bodyText?: string }>({});
  const dragIdx = useRef<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  useEffect(() => {
    api.get<ProjectMeta[]>("/api/projects").then(({ data: projects }) => {
      const project = projects.find((p) => p._id === id);
      if (!project) return;
      setSlug(project.slug);
      setCoverImageUrl(project.coverImageUrl ?? "");
      api.get<DetailData>(`/api/projects/${project.slug}/detail`).then(({ data: d }) => {
        if (d) setData({ heading: d.heading ?? "", bodyText: d.bodyText ?? "", images: d.images ?? [], sections: d.sections ?? [] });
      });
    });
  }, [id]);

  const validate = () => {
    const errs: { heading?: string; bodyText?: string } = {};
    if (!data.heading.trim()) errs.heading = "Heading cannot be empty";
    if (!data.bodyText.trim()) errs.bodyText = "Body text cannot be empty";
    return errs;
  };

  const save = async () => {
    if (!slug) return;
    setConfirm(null);
    setSaving(true);
    await api.put(`/api/projects/${slug}/detail`, data);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setConfirm({ message: "Save detail page changes?", onConfirm: save });
  };

  const addImage = (url: string) => {
    setData((prev) => {
      const img: ProjectImage = { url, layout: "full", order: prev.images.length };
      return { ...prev, images: [...prev.images, img] };
    });
  };

  const updateImageLayout = (i: number, layout: ImageLayout) => {
    setData((prev) => ({
      ...prev,
      images: prev.images.map((img, idx): ProjectImage => idx === i ? { ...img, layout } : img),
    }));
  };

  const handleImageDragStart = (i: number) => { dragIdx.current = i; };
  const handleImageDragOver = (e: React.DragEvent, i: number) => { e.preventDefault(); setDragOverIdx(i); };
  const handleImageDrop = (i: number) => {
    const from = dragIdx.current;
    if (from === null || from === i) { setDragOverIdx(null); return; }
    setData((prev) => {
      const imgs = [...prev.images];
      const [moved] = imgs.splice(from, 1);
      imgs.splice(i, 0, moved);
      return { ...prev, images: imgs.map((img, idx) => ({ ...img, order: idx })) };
    });
    dragIdx.current = null;
    setDragOverIdx(null);
  };
  const handleImageDragEnd = () => { dragIdx.current = null; setDragOverIdx(null); };

  const removeImage = (i: number) => {
    setConfirm({
      message: "Remove this image from the gallery?",
      onConfirm: () => {
        setConfirm(null);
        setData((prev) => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));
      },
    });
  };

  const addSection = () => {
    setConfirm({
      message: "Add a new section block?",
      onConfirm: () => {
        setConfirm(null);
        setData((prev) => ({ ...prev, sections: [...prev.sections, { subheading: "", description: "" }] }));
      },
    });
  };

  const updateSection = (i: number, field: keyof Section, value: string) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((s, idx) => idx === i ? { ...s, [field]: value } : s),
    }));
  };

  const removeSection = (i: number) => {
    setConfirm({
      message: "Delete this section?",
      onConfirm: () => {
        setConfirm(null);
        setData((prev) => ({ ...prev, sections: prev.sections.filter((_, idx) => idx !== i) }));
      },
    });
  };

  return (
    <div className="max-w-3xl">
      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-white font-semibold">Project Detail Page</h1>
          <p className="text-white/40 text-sm mt-1">Edit heading, body text, image gallery and sections</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 rounded bg-white text-black text-sm font-semibold hover:bg-white/90 transition disabled:opacity-50"
        >
          {saved ? "Saved!" : saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="flex flex-col gap-4">

        {/* Heading */}
        <div className="p-5 rounded-lg bg-white/5 border border-white/10">
          <label className="text-xs text-white/40 block mb-1.5">Heading</label>
          <input
            value={data.heading}
            onChange={(e) => { setData((p) => ({ ...p, heading: e.target.value })); setErrors((p) => ({ ...p, heading: undefined })); }}
            placeholder="Large heading shown on the detail page..."
            className={`w-full px-3 py-2.5 rounded bg-white/5 border text-white text-sm outline-none focus:border-white/40 transition ${errors.heading ? "border-red-400/60" : "border-white/10"}`}
          />
          {errors.heading && <p className="text-red-400 text-xs mt-1">{errors.heading}</p>}
        </div>

        {/* Body Text */}
        <div className="p-5 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-white/40">Body Text</label>
            <span className="text-xs text-white/25">Enter a minimum of 12 lines of sentences</span>
          </div>
          <textarea
            value={data.bodyText}
            onChange={(e) => { setData((p) => ({ ...p, bodyText: e.target.value })); setErrors((p) => ({ ...p, bodyText: undefined })); }}
            rows={12}
            placeholder="Main body copy shown alongside the project images..."
            className={`w-full px-3 py-2.5 rounded bg-white/5 border text-white text-sm outline-none focus:border-white/40 transition resize-none ${errors.bodyText ? "border-red-400/60" : "border-white/10"}`}
          />
          {errors.bodyText && <p className="text-red-400 text-xs mt-1">{errors.bodyText}</p>}
        </div>

        {/* Image Gallery */}
        <div className="p-5 rounded-lg bg-white/5 border border-white/10">
          <h2 className="text-white/60 text-xs uppercase tracking-wider mb-4">Image Gallery</h2>

          {/* Cover image — first image on website */}
          {coverImageUrl && (
            <div className="flex items-center gap-3 p-3 rounded bg-white/5 border border-white/20 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImageUrl} alt="Cover" className="w-24 h-16 object-cover rounded shrink-0" />
              <div className="flex-1">
                <p className="text-white/30 text-xs mb-1 truncate">{coverImageUrl}</p>
                <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                  Cover image · shown first on website
                </span>
              </div>
            </div>
          )}

          {/* Additional images */}
          {data.images.length > 0 && (
            <div className="flex flex-col gap-3 mb-4">
              {data.images.map((img, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={() => handleImageDragStart(i)}
                  onDragOver={(e) => handleImageDragOver(e, i)}
                  onDrop={() => handleImageDrop(i)}
                  onDragEnd={handleImageDragEnd}
                  className={`flex items-center gap-3 p-3 rounded border transition-colors select-none ${
                    dragOverIdx === i && dragIdx.current !== i
                      ? "bg-white/10 border-white/50"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="text-white/20 hover:text-white/60 cursor-grab active:cursor-grabbing shrink-0 transition-colors">
                    <GripIcon />
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="w-24 h-16 object-cover rounded shrink-0" />
                  <div className="flex-1">
                    <p className="text-white/40 text-xs truncate mb-1.5">{img.url}</p>
                    <div className="flex gap-2">
                      {(["full", "half"] as const).map((layout) => (
                        <button
                          key={layout}
                          type="button"
                          onClick={() => updateImageLayout(i, layout)}
                          className={`px-3 py-1 rounded text-xs border transition ${
                            img.layout === layout || (layout === "full" && !["full", "half"].includes(img.layout))
                              ? "bg-white text-black border-white"
                              : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          {layout === "full" ? "Full Width" : "Half Width"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => removeImage(i)} className="text-red-400 hover:text-red-300 px-1 shrink-0" title="Delete">
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-2">
            <p className="text-white/30 text-xs mb-3">Add Image</p>
            <ImageUploader label="Upload Image" onUploaded={addImage} />
          </div>
        </div>

        {/* Sections */}
        <div className="p-5 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white/60 text-xs uppercase tracking-wider">Sections</h2>
            <button
              type="button"
              onClick={addSection}
              className="text-xs px-3 py-1.5 rounded bg-white/10 text-white hover:bg-white/20 transition"
            >
              + Add Section
            </button>
          </div>

          {data.sections.length === 0 && (
            <p className="text-white/20 text-xs">No sections yet. Click &quot;+ Add Section&quot; to add subheading and description blocks.</p>
          )}

          <div className="flex flex-col gap-4">
            {data.sections.map((sec, i) => (
              <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10 relative">
                <button
                  type="button"
                  onClick={() => removeSection(i)}
                  className="absolute top-3 right-3 text-red-400 hover:text-red-300 transition"
                  title="Delete section"
                >
                  <TrashIcon />
                </button>
                <div className="flex flex-col gap-3 pr-8">
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Subheading</label>
                    <input
                      value={sec.subheading}
                      onChange={(e) => updateSection(i, "subheading", e.target.value)}
                      placeholder="Section subheading..."
                      className="w-full px-3 py-2.5 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/40 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Description</label>
                    <textarea
                      value={sec.description}
                      onChange={(e) => updateSection(i, "description", e.target.value)}
                      rows={4}
                      placeholder="Section description..."
                      className="w-full px-3 py-2.5 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/40 transition resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded bg-white/5 border border-white/10 text-white/50 text-sm hover:bg-white/10 hover:text-white transition"
          >
            ← Back
          </button>
          {slug && (
            <a
              href={`http://localhost:3000/detail/${slug}`}
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
