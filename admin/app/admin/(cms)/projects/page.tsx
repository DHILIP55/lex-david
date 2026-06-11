"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { api } from "@/app/lib/api";
import TrashIcon from "@/app/components/TrashIcon";

type Project = {
  _id: string;
  title: string;
  slug: string;
  coverImageUrl: string;
  gridLayout: string;
  order: number;
  isPublished: boolean;
  category: string;
};

function GripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="5" cy="4" r="1.5" />
      <circle cx="11" cy="4" r="1.5" />
      <circle cx="5" cy="8" r="1.5" />
      <circle cx="11" cy="8" r="1.5" />
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="11" cy="12" r="1.5" />
    </svg>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [saving, setSaving] = useState(false);
  const dragIdx = useRef<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  useEffect(() => {
    api.get<Project[]>("/api/projects").then(({ data }) =>
      setProjects(data.sort((a, b) => a.order - b.order))
    );
  }, []);

  const togglePublish = async (p: Project) => {
    const updated = { ...p, isPublished: !p.isPublished };
    await api.put(`/api/projects/${p._id}`, updated);
    setProjects((prev) => prev.map((x) => x._id === p._id ? updated : x));
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await api.delete(`/api/projects/${id}`);
    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  const handleDragStart = (i: number) => { dragIdx.current = i; };

  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    setDragOverIdx(i);
  };

  const handleDrop = async (i: number) => {
    const from = dragIdx.current;
    if (from === null || from === i) { setDragOverIdx(null); return; }

    const reordered = [...projects];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(i, 0, moved);
    const updated = reordered.map((p, idx) => ({ ...p, order: idx }));
    setProjects(updated);
    dragIdx.current = null;
    setDragOverIdx(null);

    setSaving(true);
    await Promise.all(updated.map((p) => api.put(`/api/projects/${p._id}`, p)));
    setSaving(false);
  };

  const handleDragEnd = () => { dragIdx.current = null; setDragOverIdx(null); };

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-white font-semibold">Projects & Work</h1>
          <p className="text-white/40 text-sm mt-1">
            Manage portfolio projects
            {saving && <span className="ml-2 text-white/30 italic">Saving order…</span>}
          </p>
        </div>
        <Link href="/admin/projects/new"
          className="px-5 py-2 rounded bg-white text-black text-sm font-semibold hover:bg-white/90 transition">
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-white/20 text-sm">
          No projects yet. Create one to get started.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((p, i) => (
            <div
              key={p._id}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDrop={() => handleDrop(i)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-4 p-4 rounded-lg bg-white/5 border transition-colors select-none ${
                dragOverIdx === i && dragIdx.current !== i
                  ? "border-white/50 bg-white/10"
                  : "border-white/10"
              }`}
            >
              {/* Drag handle */}
              <div className="text-white/20 hover:text-white/60 cursor-grab active:cursor-grabbing shrink-0 transition-colors">
                <GripIcon />
              </div>

              {p.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.coverImageUrl} alt={p.title} className="w-20 h-14 object-cover rounded shrink-0" />
              ) : (
                <div className="w-20 h-14 bg-white/5 rounded shrink-0 flex items-center justify-center">
                  <span className="text-white/20 text-xs">No image</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="text-white text-sm font-medium truncate">{p.title}</h3>
                <p className="text-white/40 text-xs mt-0.5">
                  {p.slug} &middot; {p.gridLayout === "full" ? "Full width" : "Half width"}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => togglePublish(p)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                    p.isPublished
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {p.isPublished ? "Published" : "Draft"}
                </button>
                <Link href={`/admin/projects/${p._id}`}
                  className="px-3 py-1.5 rounded bg-white/10 text-white text-xs hover:bg-white/20 transition">
                  Edit
                </Link>
                <Link href={`/admin/projects/${p._id}/detail`}
                  className="px-3 py-1.5 rounded bg-white/10 text-white text-xs hover:bg-white/20 transition">
                  Detail
                </Link>
                <button onClick={() => deleteProject(p._id)} className="text-red-400 hover:text-red-300 px-1" title="Delete">
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <a href="http://localhost:3000/work" target="_blank" rel="noopener noreferrer"
          className="text-sm text-white/40 hover:text-white transition underline">
          Preview on site →
        </a>
      </div>
    </div>
  );
}
