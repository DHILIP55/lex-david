"use client";

import { useState } from "react";

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  label?: string;
}

export default function TagsInput({ tags, onChange, label = "Tags" }: TagsInputProps) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-white/50 uppercase tracking-wider">{label}</label>
      <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded border border-white/10 min-h-[42px]">
        {tags.map((tag, i) => (
          <span key={i} className="flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full text-xs text-white">
            {tag}
            <button type="button" onClick={() => removeTag(i)} className="text-white/40 hover:text-white ml-1">×</button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
          placeholder="Add tag, press Enter"
          className="flex-1 min-w-24 bg-transparent text-sm text-white placeholder-white/30 outline-none"
        />
      </div>
    </div>
  );
}
