"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import ImageUploader from "@/app/components/ImageUploader";

type NavItem = {
  order: number;
  prefixLabel: string;
  label: string;
  type: "link" | "scroll";
  target: string;
};

type FooterLink = { label: string; order: number };
type SocialLink = { label: string; url: string; order: number };

type NavData = { logoUrl: string; items: NavItem[]; mobileFooterLinks: FooterLink[]; socialLinks: SocialLink[] };

const deriveType = (target: string): "link" | "scroll" => target.startsWith("/") ? "link" : "scroll";



function ConfirmModal({ message, confirmLabel = "Delete", confirmClass = "bg-red-500 hover:bg-red-400", onConfirm, onCancel }: {
  message: string;
  confirmLabel?: string;
  confirmClass?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-xl p-6 flex flex-col gap-5">
        <p className="text-white text-sm text-center">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded bg-white/10 text-white text-sm hover:bg-white/20 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded text-white text-sm font-semibold transition ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0,0,256,256">
      <g fill="currentColor" fillRule="nonzero">
        <g transform="scale(8.53333,8.53333)">
          <path d="M14.98438,2.48633c-0.55152,0.00862 -0.99193,0.46214 -0.98437,1.01367v0.5h-5.5c-0.26757,-0.00363 -0.52543,0.10012 -0.71593,0.28805c-0.1905,0.18793 -0.29774,0.44436 -0.29774,0.71195h-1.48633c-0.36064,-0.0051 -0.69608,0.18438 -0.87789,0.49587c-0.18181,0.3115 -0.18181,0.69676 0,1.00825c0.18181,0.3115 0.51725,0.50097 0.87789,0.49587h18c0.36064,0.0051 0.69608,-0.18438 0.87789,-0.49587c0.18181,-0.3115 0.18181,-0.69676 0,-1.00825c-0.18181,-0.3115 -0.51725,-0.50097 -0.87789,-0.49587h-1.48633c0,-0.26759 -0.10724,-0.52403 -0.29774,-0.71195c-0.1905,-0.18793 -0.44836,-0.29168 -0.71593,-0.28805h-5.5v-0.5c0.0037,-0.2703 -0.10218,-0.53059 -0.29351,-0.72155c-0.19133,-0.19097 -0.45182,-0.29634 -0.72212,-0.29212zM6,9l1.79297,15.23438c0.118,1.007 0.97037,1.76563 1.98438,1.76563h10.44531c1.014,0 1.86538,-0.75862 1.98438,-1.76562l1.79297,-15.23437z" />
        </g>
      </g>
    </svg>
  );
}

export default function NavigationPage() {
  const [data, setData] = useState<NavData>({ logoUrl: "", items: [], mobileFooterLinks: [], socialLinks: [] });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmState, setConfirmState] = useState<{ message: string; confirmLabel?: string; confirmClass?: string; onConfirm: () => void } | null>(null);

  const askConfirm = (message: string, onConfirm: () => void, confirmLabel?: string, confirmClass?: string) =>
    setConfirmState({ message, onConfirm, confirmLabel, confirmClass });

  useEffect(() => {
    api.get<NavData>("/api/nav")
      .then(({ data: d }) => {
        if (d.items) {
          setData({
            logoUrl: d.logoUrl ?? "",
            items: [...d.items].sort((a, b) => a.order - b.order),
            mobileFooterLinks: [...(d.mobileFooterLinks ?? [])].sort((a, b) => a.order - b.order),
            socialLinks: [...(d.socialLinks ?? [])].sort((a, b) => a.order - b.order),
          });
        }
      })
      .catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/api/nav", data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Save failed — make sure the backend is running.");
    } finally {
      setSaving(false);
    }
  };

  const updateItem = (i: number, field: keyof NavItem, value: string) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item, idx) => {
        if (idx !== i) return item;
        const updated = { ...item, [field]: value };
        if (field === "target") updated.type = deriveType(value);
        return updated;
      }),
    }));
  };

  const addItem = () => {
    setData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { order: prev.items.length, prefixLabel: "", label: "New Link", type: deriveType("/"), target: "/" },
      ],
    }));
  };

  const removeItem = (i: number) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== i).map((item, idx) => ({ ...item, order: idx })),
    }));
  };

  const moveItem = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    setData((prev) => {
      const items = [...prev.items];
      [items[i], items[j]] = [items[j], items[i]];
      return { ...prev, items: items.map((item, idx) => ({ ...item, order: idx })) };
    });
  };

  const updateFooter = (i: number, value: string) => {
    setData((prev) => ({
      ...prev,
      mobileFooterLinks: prev.mobileFooterLinks.map((link, idx) =>
        idx === i ? { ...link, label: value } : link
      ),
    }));
  };

  const addFooter = () => {
    setData((prev) => ({
      ...prev,
      mobileFooterLinks: [...prev.mobileFooterLinks, { label: "NEW LINK", order: prev.mobileFooterLinks.length }],
    }));
  };

  const removeFooter = (i: number) => {
    setData((prev) => ({
      ...prev,
      mobileFooterLinks: prev.mobileFooterLinks
        .filter((_, idx) => idx !== i)
        .map((link, idx) => ({ ...link, order: idx })),
    }));
  };

  const addSocial = () => {
    if (data.socialLinks.length >= 4) return;
    setData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { label: "", url: "", order: prev.socialLinks.length }],
    }));
  };

  const updateSocial = (i: number, field: "label" | "url", value: string) => {
    setData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((s, idx) => idx === i ? { ...s, [field]: value } : s),
    }));
  };

  const removeSocial = (i: number) => {
    setData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks
        .filter((_, idx) => idx !== i)
        .map((s, idx) => ({ ...s, order: idx })),
    }));
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-white font-semibold">Navigation</h1>
          <p className="text-white/40 text-sm mt-1">
            Edit nav links shown in both the hero navbar and sticky navbar
          </p>
        </div>
        <button
          onClick={() => askConfirm("Save navigation changes to the site?", save, "Save", "bg-white text-black hover:bg-white/90")}
          disabled={saving}
          className="px-5 py-2 rounded bg-white text-black text-sm font-semibold hover:bg-white/90 transition disabled:opacity-50"
        >
          {saved ? "Saved!" : saving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* LOGO */}
      <div className="mb-8 p-6 rounded-lg bg-white/5 border border-white/10">
        <h2 className="text-white/60 text-xs uppercase tracking-wider mb-4">Site Logo</h2>
        <ImageUploader
          label="Logo Image"
          currentUrl={data.logoUrl || undefined}
          onUploaded={(url) => setData((prev) => ({ ...prev, logoUrl: url }))}
        />
        <p className="text-white/30 text-xs mt-3">This logo appears in the navbar on all pages of the site.</p>
      </div>

      {/* NAV ITEMS */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white/60 text-xs uppercase tracking-wider">Nav Links</h2>
          <button
            onClick={addItem}
            disabled={data.items.length >= 4}
            className="px-3 py-1.5 rounded bg-white/10 text-white text-xs hover:bg-white/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
            title={data.items.length >= 4 ? "Maximum 4 nav links allowed" : undefined}
          >
            + Add Link
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {data.items.map((item, i) => (
            <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10">
              {/* Reorder + remove */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-1">
                  <button
                    onClick={() => moveItem(i, -1)}
                    disabled={i === 0}
                    className="px-2 py-0.5 rounded text-white/40 hover:text-white hover:bg-white/10 text-xs disabled:opacity-20 transition"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveItem(i, 1)}
                    disabled={i === data.items.length - 1}
                    className="px-2 py-0.5 rounded text-white/40 hover:text-white hover:bg-white/10 text-xs disabled:opacity-20 transition"
                  >
                    ↓
                  </button>
                </div>

                {/* Preview badge */}
                <span className="text-white/30 text-xs font-mono">
                  {item.prefixLabel ? `"${item.prefixLabel}" ` : ""}
                  <span className="text-white/60">{item.label}</span>
                </span>

                <button
                  onClick={() => askConfirm(`Remove "${item.label}" from nav?`, () => removeItem(i))}
                  className="text-red-400 hover:text-red-300 px-1 transition"
                  title="Remove item"
                >
                  <TrashIcon />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/40 block mb-1">
                    Prefix label <span className="text-white/20">(optional — e.g. Studio)</span>
                  </label>
                  <input
                    value={item.prefixLabel}
                    onChange={(e) => updateItem(i, "prefixLabel", e.target.value)}
                    placeholder="Studio or ↑"
                    className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30"
                  />
                  
                </div>
                <div>
                  <label className="text-xs text-white/40 block mb-1">Main label</label>
                  <input
                    value={item.label}
                    onChange={(e) => updateItem(i, "label", e.target.value)}
                    placeholder="Work"
                    className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="text-xs text-white/40 block mb-1">
                  Target <span className="text-white/20">(page route e.g. /about, or section ID e.g. ourservice)</span>
                </label>
                <input
                  value={item.target}
                  onChange={(e) => updateItem(i, "target", e.target.value)}
                  placeholder="/about or ourservice"
                  className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MOBILE FOOTER LINKS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-white/60 text-xs uppercase tracking-wider">
              Mobile Menu Footer Links
            </h2>
            <p className="text-white/30 text-xs mt-0.5">
              Shown at the bottom of the mobile slide-out menu
            </p>
          </div>
          <button
            onClick={addFooter}
            className="px-3 py-1.5 rounded bg-white/10 text-white text-xs hover:bg-white/20 transition"
          >
            + Add
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {data.mobileFooterLinks.map((link, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
              <input
                value={link.label}
                onChange={(e) => updateFooter(i, e.target.value)}
                className="flex-1 px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30 uppercase tracking-wider"
              />
              <button
                onClick={() => askConfirm(`Remove "${link.label}" footer link?`, () => removeFooter(i))}
                className="text-red-400 hover:text-red-300 px-1 shrink-0 transition"
                title="Remove"
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER SOCIAL LINKS */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-white/60 text-xs uppercase tracking-wider">Footer Social Links</h2>
            <p className="text-white/30 text-xs mt-0.5">Shown in the site footer — maximum 4</p>
          </div>
          <button
            onClick={addSocial}
            disabled={data.socialLinks.length >= 4}
            className="px-3 py-1.5 rounded bg-white/10 text-white text-xs hover:bg-white/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
            title={data.socialLinks.length >= 4 ? "Maximum 4 social links allowed" : undefined}
          >
            + Add
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {data.socialLinks.map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
              <input
                value={s.label}
                onChange={(e) => updateSocial(i, "label", e.target.value)}
                placeholder="Label (e.g. Instagram)"
                className="w-32 shrink-0 px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30"
              />
              <input
                value={s.url}
                onChange={(e) => updateSocial(i, "url", e.target.value)}
                placeholder="https://instagram.com/..."
                className="flex-1 px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30"
              />
              <button
                onClick={() => askConfirm(`Remove "${s.label || "this"}" social link?`, () => removeSocial(i))}
                className="text-red-400 hover:text-red-300 px-1 shrink-0 transition"
                title="Remove"
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
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

      {confirmState && (
        <ConfirmModal
          message={confirmState.message}
          confirmLabel={confirmState.confirmLabel}
          confirmClass={confirmState.confirmClass}
          onConfirm={() => { confirmState.onConfirm(); setConfirmState(null); }}
          onCancel={() => setConfirmState(null)}
        />
      )}
    </div>
  );
}
