"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/app/lib/api";
import TagsInput from "@/app/components/TagsInput";
import TrashIcon from "@/app/components/TrashIcon";

type Service = {
  _id: string;
  order: number;
  index: string;
  title: string;
  tags: string[];
  description: string;
  isVisible: boolean;
};

type ConfirmState = {
  message: string;
  onConfirm: () => void;
} | null;

function normalizeIndex(val: string): string {
  const n = parseInt(val.trim(), 10);
  if (isNaN(n) || n < 1) return val.trim();
  return String(n).padStart(2, "0");
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
            <button
              onClick={onCancel}
              className="px-4 py-2 text-xs text-white/50 hover:text-white rounded border border-white/10 hover:border-white/30 transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-xs bg-white text-black rounded font-semibold hover:bg-white/90 transition"
            >
              Yes, Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type SectionConfig = { sectionLabel: string; sectionHeading: string };

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState<SectionConfig>({ sectionLabel: "What We Offer", sectionHeading: "Our Services" });
  const [configSaving, setConfigSaving] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragFromIndex = useRef<number | null>(null);

  useEffect(() => {
    api.get<Service[]>("/api/services").then(({ data }) =>
      setServices(data.sort((a, b) => a.order - b.order))
    );
    api.get<SectionConfig>("/api/services/config").then(({ data }) => setConfig(data));
  }, []);

  const saveConfig = async () => {
    setConfigSaving(true);
    await api.put("/api/services/config", config);
    setConfigSaving(false);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2000);
  };

  const validateAll = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    services.forEach((s) => {
      const trimmed = s.index.trim();
      if (!trimmed) { newErrors[s._id] = "Index cannot be empty"; return; }
      const n = parseInt(trimmed, 10);
      if (isNaN(n) || n < 1) { newErrors[s._id] = "Index must be a positive number"; return; }
      const duplicate = services.find(
        (other) => other._id !== s._id && parseInt(other.index, 10) === n
      );
      if (duplicate) newErrors[s._id] = `Index ${String(n).padStart(2, "0")} is already used by "${duplicate.title}"`;
    });
    return newErrors;
  };

  const updateService = (id: string, field: keyof Service, value: unknown) => {
    setServices((prev) => prev.map((s) => s._id === id ? { ...s, [field]: value } : s));
    if (field === "index") setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const blurIndex = (id: string, val: string) => {
    updateService(id, "index", normalizeIndex(val));
  };

  const saveAll = () => {
    const errs = validateAll();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const normalized = services.map((s) => ({ ...s, index: normalizeIndex(s.index) }));
    setConfirm({
      message: `Save all ${services.length} service${services.length !== 1 ? "s" : ""}?`,
      onConfirm: async () => {
        setConfirm(null);
        setSaving(true);
        setServices(normalized);
        await Promise.all(normalized.map((s) => api.put(`/api/services/${s._id}`, s)));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      },
    });
  };

  const deleteService = (s: Service) => {
    setConfirm({
      message: `Delete "${s.title}"? This cannot be undone.`,
      onConfirm: async () => {
        setConfirm(null);
        await api.delete(`/api/services/${s._id}`);
        setServices((prev) => prev.filter((x) => x._id !== s._id));
      },
    });
  };

  const addService = async () => {
    const { data } = await api.post<Service>("/api/services", {
      title: "New Service",
      order: services.length,
      index: String(services.length + 1).padStart(2, "0"),
      tags: [],
      description: "",
      isVisible: true,
    });
    setServices((prev) => [...prev, data]);
  };

  const onDragStart = (i: number) => { dragFromIndex.current = i; };
  const onDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    setDragOverIndex(i);
  };
  const onDrop = async (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = dragFromIndex.current;
    setDragOverIndex(null);
    dragFromIndex.current = null;
    if (fromIndex === null || fromIndex === toIndex) return;
    const arr = [...services];
    const [item] = arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, item);
    const reordered = arr.map((s, i) => ({ ...s, order: i, index: String(i + 1).padStart(2, "0") }));
    setServices(reordered);
    await api.put("/api/services/reorder", { ids: reordered.map((s) => s._id) });
  };
  const onDragEnd = () => {
    setDragOverIndex(null);
    dragFromIndex.current = null;
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

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-white font-semibold">Services</h1>
          <p className="text-white/40 text-sm mt-1">Manage services accordion — drag to reorder</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={addService}
            className="px-5 py-2 rounded bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition"
          >
            + Add Service
          </button>
          <button
            onClick={saveAll}
            disabled={saving}
            className="px-5 py-2 rounded bg-white text-black text-sm font-semibold hover:bg-white/90 transition disabled:opacity-50"
          >
            {saved ? "Saved!" : saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Section heading config */}
      <div className="p-5 rounded-lg bg-white/5 border border-white/10 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white/60 text-xs uppercase tracking-wider">Section Heading</h2>
          <button
            onClick={saveConfig}
            disabled={configSaving}
            className="px-4 py-1.5 rounded bg-white text-black text-xs font-semibold hover:bg-white/90 transition disabled:opacity-50"
          >
            {configSaved ? "Saved!" : configSaving ? "Saving…" : "Save"}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-white/40 block mb-1">Label (small text above heading)</label>
            <input
              value={config.sectionLabel}
              onChange={(e) => setConfig((p) => ({ ...p, sectionLabel: e.target.value }))}
              className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 block mb-1">Heading</label>
            <input
              value={config.sectionHeading}
              onChange={(e) => setConfig((p) => ({ ...p, sectionHeading: e.target.value }))}
              className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {services.map((service, i) => (
          <div
            key={service._id}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={(e) => onDragOver(e, i)}
            onDrop={(e) => onDrop(e, i)}
            onDragEnd={onDragEnd}
            className={`p-5 rounded-lg bg-white/5 border transition ${
              dragOverIndex === i ? "border-white/50 bg-white/10 scale-[1.01]" : "border-white/10"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/40 transition select-none" title="Drag to reorder">
                  ⠿
                </span>
                <span className="text-white/40 font-mono text-xs">{service.index}</span>
                <span className="text-white font-medium text-sm">{service.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-white/50 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={service.isVisible}
                    onChange={(e) => updateService(service._id, "isVisible", e.target.checked)}
                    className="accent-white"
                  />
                  Visible
                </label>
                <button
                  onClick={() => deleteService(service)}
                  className="text-red-400 hover:text-red-300 px-1"
                  title="Delete"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/40 block mb-1">Title</label>
                  <input
                    value={service.title}
                    onChange={(e) => updateService(service._id, "title", e.target.value)}
                    className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 block mb-1">Index (e.g. 01, 02)</label>
                  <input
                    value={service.index}
                    onChange={(e) => updateService(service._id, "index", e.target.value)}
                    onBlur={(e) => blurIndex(service._id, e.target.value)}
                    className={`w-full px-3 py-2 rounded bg-white/5 border text-white text-sm outline-none focus:border-white/30 transition ${
                      errors[service._id] ? "border-red-400/60" : "border-white/10"
                    }`}
                  />
                  {errors[service._id] && (
                    <p className="text-red-400 text-xs mt-1">{errors[service._id]}</p>
                  )}
                </div>
              </div>
              <TagsInput
                label="Tags"
                tags={service.tags}
                onChange={(tags) => updateService(service._id, "tags", tags)}
              />
              <div>
                <label className="text-xs text-white/40 block mb-1">Description</label>
                <textarea
                  value={service.description}
                  onChange={(e) => updateService(service._id, "description", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30 resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <a
          href="http://localhost:3000/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-white/40 hover:text-white transition underline"
        >
          Preview on site →
        </a>
      </div>
    </div>
  );
}
