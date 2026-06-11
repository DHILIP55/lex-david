"use client";

import { useRef, useState } from "react";
import { api } from "@/app/lib/api";

interface ImageUploaderProps {
  currentUrl?: string;
  onUploaded: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ currentUrl, onUploaded, label = "Image" }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post<{ url: string }>("/api/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploaded(data.url);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-white/50 uppercase tracking-wider">{label}</label>
      {currentUrl && (
        <img src={currentUrl} alt="current" className="h-32 w-auto rounded object-cover border border-white/10" />
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="px-4 py-2 text-sm rounded bg-white/10 text-white hover:bg-white/20 transition disabled:opacity-50"
      >
        {uploading ? "Uploading…" : currentUrl ? "Change Image" : "Upload Image"}
      </button>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
}
