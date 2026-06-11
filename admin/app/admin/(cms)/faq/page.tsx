"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/app/lib/api";
import TrashIcon from "@/app/components/TrashIcon";

type FaqItem = { question: string; answer: string; order: number };
type FaqCategory = { _id: string; categoryName: string; order: number; items: FaqItem[] };
type ConfirmState = { message: string; onConfirm: () => void } | null;
type FaqConfig = { sectionLabel: string; sectionHeading: string };
type ItemErrors = Record<number, { q?: string; a?: string }>;

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
            <button onClick={onCancel} className="px-4 py-2 text-xs text-white/50 hover:text-white rounded border border-white/10 hover:border-white/30 transition">
              Cancel
            </button>
            <button onClick={onConfirm} className="px-4 py-2 text-xs bg-white text-black rounded font-semibold hover:bg-white/90 transition">
              Yes, Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FaqPage() {
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [errors, setErrors] = useState<ItemErrors>({});
  const [faqConfig, setFaqConfig] = useState<FaqConfig>({ sectionLabel: "", sectionHeading: "" });
  const [configSaving, setConfigSaving] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);
  const [addingCat, setAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragFromIndex = useRef<number | null>(null);

  useEffect(() => {
    api.get<FaqCategory[]>("/api/faq").then(({ data }) =>
      setCategories(data.sort((a, b) => a.order - b.order))
    );
    api.get<FaqConfig>("/api/faq/config").then(({ data }) => setFaqConfig(data));
  }, []);

  const saveConfig = () => {
    setConfirm({
      message: "Save FAQ section heading changes?",
      onConfirm: async () => {
        setConfirm(null);
        setConfigSaving(true);
        await api.put("/api/faq/config", faqConfig);
        setConfigSaving(false);
        setConfigSaved(true);
        setTimeout(() => setConfigSaved(false), 2000);
      },
    });
  };

  const selectedCat = categories.find((c) => c._id === selected);

  const updateCat = (field: keyof FaqCategory, value: unknown) => {
    setCategories((prev) =>
      prev.map((c) => c._id === selected ? { ...c, [field]: value } : c)
    );
  };

  const updateItem = (i: number, field: keyof FaqItem, value: string) => {
    if (!selectedCat) return;
    updateCat("items", selectedCat.items.map((item, idx) =>
      idx === i ? { ...item, [field]: value } : item
    ));
    setErrors((prev) => {
      const next = { ...prev };
      if (next[i]) {
        if (field === "question") delete next[i].q;
        if (field === "answer") delete next[i].a;
        if (!next[i].q && !next[i].a) delete next[i];
      }
      return next;
    });
  };

  const validateItems = (): ItemErrors => {
    const errs: ItemErrors = {};
    (selectedCat?.items ?? []).forEach((item, i) => {
      const e: { q?: string; a?: string } = {};
      if (!item.question.trim()) e.q = "Question cannot be empty";
      if (!item.answer.trim()) e.a = "Answer cannot be empty";
      if (Object.keys(e).length) errs[i] = e;
    });
    return errs;
  };

  const saveCategory = () => {
    if (!selectedCat) return;
    const errs = validateItems();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setConfirm({
      message: `Save changes to "${selectedCat.categoryName}"?`,
      onConfirm: async () => {
        setConfirm(null);
        setSaving(true);
        await api.put(`/api/faq/${selectedCat._id}`, selectedCat);
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      },
    });
  };

  const addItem = () => {
    if (!selectedCat) return;
    setConfirm({
      message: "Add a new Q&A item to this category?",
      onConfirm: () => {
        setConfirm(null);
        updateCat("items", [...selectedCat.items, { question: "", answer: "", order: selectedCat.items.length }]);
      },
    });
  };

  const removeItem = (i: number) => {
    if (!selectedCat) return;
    setConfirm({
      message: "Delete this Q&A item?",
      onConfirm: () => {
        setConfirm(null);
        updateCat("items", selectedCat.items.filter((_, idx) => idx !== i));
        setErrors((prev) => {
          const next: ItemErrors = {};
          Object.entries(prev).forEach(([k, v]) => {
            const ki = parseInt(k);
            if (ki < i) next[ki] = v;
            else if (ki > i) next[ki - 1] = v;
          });
          return next;
        });
      },
    });
  };

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    const { data } = await api.post<FaqCategory>("/api/faq", {
      categoryName: newCatName.trim(),
      order: categories.length,
      items: [],
    });
    setCategories((prev) => [...prev, data]);
    setSelected(data._id);
    setErrors({});
    setNewCatName("");
    setAddingCat(false);
  };

  const deleteCategory = (id: string, name: string) => {
    setConfirm({
      message: `Delete "${name}" and all its Q&A?`,
      onConfirm: async () => {
        setConfirm(null);
        await api.delete(`/api/faq/${id}`);
        setCategories((prev) => prev.filter((c) => c._id !== id));
        if (selected === id) { setSelected(null); setErrors({}); }
      },
    });
  };

  // Drag-to-reorder Q&A items
  const onDragStart = (i: number) => { dragFromIndex.current = i; };
  const onDragOver = (e: React.DragEvent, i: number) => { e.preventDefault(); setDragOverIndex(i); };
  const onDrop = async (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = dragFromIndex.current;
    setDragOverIndex(null);
    dragFromIndex.current = null;
    if (fromIndex === null || fromIndex === toIndex || !selectedCat) return;
    const arr = [...selectedCat.items];
    const [item] = arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, item);
    const reordered = arr.map((it, i) => ({ ...it, order: i }));
    updateCat("items", reordered);
    await api.put(`/api/faq/${selectedCat._id}`, { ...selectedCat, items: reordered });
  };
  const onDragEnd = () => { setDragOverIndex(null); dragFromIndex.current = null; };

  return (
    <div className="max-w-5xl">
      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="mb-6">
        <h1 className="text-2xl text-white font-semibold">FAQ</h1>
        <p className="text-white/40 text-sm mt-1">Manage FAQ categories and questions</p>
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
              value={faqConfig.sectionLabel}
              onChange={(e) => setFaqConfig((p) => ({ ...p, sectionLabel: e.target.value }))}
              className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 block mb-1">Heading</label>
            <input
              value={faqConfig.sectionHeading}
              onChange={(e) => setFaqConfig((p) => ({ ...p, sectionHeading: e.target.value }))}
              className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Category list */}
        <div className="w-52 shrink-0">
          <div className="flex flex-col gap-1 mb-3">
            {categories.map((cat) => (
              <div key={cat._id} className="flex items-center gap-1">
                <button
                  onClick={() => { setSelected(cat._id); setErrors({}); }}
                  className={`flex-1 text-left px-3 py-2 rounded text-sm transition ${
                    selected === cat._id ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {cat.categoryName}
                </button>
                <button
                  onClick={() => deleteCategory(cat._id, cat.categoryName)}
                  className="text-red-400/60 hover:text-red-400 px-1"
                  title="Delete category"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>

          {addingCat ? (
            <div className="flex flex-col gap-1">
              <input
                autoFocus
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addCategory();
                  if (e.key === "Escape") { setAddingCat(false); setNewCatName(""); }
                }}
                placeholder="Category name"
                className="w-full px-3 py-2 rounded bg-white/5 border border-white/20 text-white text-xs outline-none focus:border-white/40"
              />
              <div className="flex gap-1">
                <button onClick={addCategory} className="flex-1 px-2 py-1.5 rounded bg-white text-black text-xs font-semibold hover:bg-white/90 transition">
                  Add
                </button>
                <button onClick={() => { setAddingCat(false); setNewCatName(""); }} className="px-2 py-1.5 rounded border border-white/10 text-white/50 text-xs hover:text-white transition">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingCat(true)}
              className="w-full px-3 py-2 rounded border border-dashed border-white/20 text-white/40 hover:text-white hover:border-white/40 text-xs transition"
            >
              + Add Category
            </button>
          )}
        </div>

        {/* Q&A editor */}
        <div className="flex-1">
          {!selectedCat ? (
            <div className="flex items-center justify-center h-40 text-white/20 text-sm">
              Select a category
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <input
                  value={selectedCat.categoryName}
                  onChange={(e) => updateCat("categoryName", e.target.value)}
                  className="px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm font-medium outline-none focus:border-white/30"
                />
                <div className="flex gap-2">
                  <button onClick={addItem} className="px-4 py-2 rounded bg-white/10 text-white text-sm hover:bg-white/20 transition">
                    + Add Q&A
                  </button>
                  <button onClick={saveCategory} disabled={saving} className="px-4 py-2 rounded bg-white text-black text-sm font-semibold hover:bg-white/90 transition disabled:opacity-50">
                    {saved ? "Saved!" : saving ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {selectedCat.items.map((item, i) => (
                  <div
                    key={i}
                    draggable
                    onDragStart={() => onDragStart(i)}
                    onDragOver={(e) => onDragOver(e, i)}
                    onDrop={(e) => onDrop(e, i)}
                    onDragEnd={onDragEnd}
                    className={`p-4 rounded-lg bg-white/5 border transition ${
                      dragOverIndex === i ? "border-white/50 bg-white/10 scale-[1.01]" : "border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/40 transition select-none" title="Drag to reorder">
                          ⠿
                        </span>
                        <span className="text-white/30 text-xs font-mono">Q{i + 1}</span>
                      </div>
                      <button onClick={() => removeItem(i)} className="text-red-400/60 hover:text-red-400 px-1" title="Delete">
                        <TrashIcon />
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div>
                        <textarea
                          value={item.question}
                          onChange={(e) => updateItem(i, "question", e.target.value)}
                          placeholder="Question"
                          rows={2}
                          className={`w-full px-3 py-2 rounded bg-white/5 border text-white text-sm outline-none focus:border-white/30 resize-none transition ${
                            errors[i]?.q ? "border-red-400/60" : "border-white/10"
                          }`}
                        />
                        {errors[i]?.q && <p className="text-red-400 text-xs mt-1">{errors[i].q}</p>}
                      </div>
                      <div>
                        <textarea
                          value={item.answer}
                          onChange={(e) => updateItem(i, "answer", e.target.value)}
                          placeholder="Answer"
                          rows={3}
                          className={`w-full px-3 py-2 rounded bg-white/5 border text-white/70 text-sm outline-none focus:border-white/30 resize-none transition ${
                            errors[i]?.a ? "border-red-400/60" : "border-white/10"
                          }`}
                        />
                        {errors[i]?.a && <p className="text-red-400 text-xs mt-1">{errors[i].a}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <a href="http://localhost:3000/" target="_blank" rel="noopener noreferrer"
          className="text-sm text-white/40 hover:text-white transition underline">
          Preview on site →
        </a>
      </div>
    </div>
  );
}
