"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import TrashIcon from "@/app/components/TrashIcon";

type SocialItem = { label: string; value: string; order: number };
type ConfirmState = { message: string; onConfirm: () => void } | null;
type RowErrors = Record<number, { label?: string; value?: string }>;

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

export default function SocialPage() {
  const [items, setItems] = useState<SocialItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [errors, setErrors] = useState<RowErrors>({});

  useEffect(() => {
    api.get<{ items: SocialItem[] }>("/api/social").then(({ data }) =>
      setItems((data.items ?? []).sort((a, b) => a.order - b.order))
    );
  }, []);

  const validate = (): RowErrors => {
    const errs: RowErrors = {};
    items.forEach((item, i) => {
      const e: { label?: string; value?: string } = {};
      if (!item.value.trim()) e.value = "Value cannot be empty";
      if (Object.keys(e).length) errs[i] = e;
    });
    return errs;
  };

  const save = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setConfirm({
      message: "Save all social & contact changes?",
      onConfirm: async () => {
        setConfirm(null);
        setSaving(true);
        await api.put("/api/social", { items });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      },
    });
  };

  const update = (i: number, field: keyof SocialItem, value: string) => {
    setItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
    setErrors((prev) => {
      if (!prev[i]) return prev;
      const rowErr = { ...prev[i] };
      delete rowErr[field as "label" | "value"];
      const next = { ...prev };
      if (Object.keys(rowErr).length === 0) delete next[i];
      else next[i] = rowErr;
      return next;
    });
  };

  const addRow = () => setItems((prev) => [...prev, { label: "", value: "", order: prev.length }]);

  const removeRow = (i: number) => {
    setConfirm({
      message: "Delete this row?",
      onConfirm: () => {
        setConfirm(null);
        setItems((prev) => prev.filter((_, idx) => idx !== i));
        setErrors((prev) => {
          const next: RowErrors = {};
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

  return (
    <div className="max-w-2xl">
      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-white font-semibold">Social & Contact</h1>
          <p className="text-white/40 text-sm mt-1">Edit contact info displayed on the site</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="px-5 py-2 rounded bg-white text-black text-sm font-semibold hover:bg-white/90 transition disabled:opacity-50"
        >
          {saved ? "Saved!" : saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex gap-3 items-start">
              <div className="w-36 shrink-0">
                <input
                  value={item.label}
                  onChange={(e) => update(i, "label", e.target.value)}
                  placeholder="Label (e.g. Instagram)"
                  className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30 transition"
                />
              </div>
              <div className="flex-1">
                <input
                  value={item.value}
                  onChange={(e) => update(i, "value", e.target.value)}
                  placeholder="Value (URL or text)"
                  className={`w-full px-3 py-2 rounded bg-white/5 border text-white text-sm outline-none focus:border-white/30 transition ${
                    errors[i]?.value ? "border-red-400/60" : "border-white/10"
                  }`}
                />
                {errors[i]?.value && <p className="text-red-400 text-xs mt-1">{errors[i].value}</p>}
              </div>
              <button onClick={() => removeRow(i)} className="text-red-400 hover:text-red-300 px-2 mt-2 shrink-0" title="Delete">
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={addRow}
          className="px-4 py-2 rounded border border-dashed border-white/20 text-white/40 hover:text-white hover:border-white/40 text-sm transition"
        >
          + Add Row
        </button>
      </div>

      <div className="mt-6">
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
