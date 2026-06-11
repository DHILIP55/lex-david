"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/app/lib/api";
import ImageUploader from "@/app/components/ImageUploader";

type BackgroundType = "image" | "slideshow" | "video";
type HeroData = {
  words: string[];
  backgroundType: BackgroundType;
  backgroundImageUrl: string;
  backgroundImages: string[];
  backgroundVideoUrl: string;
};

export default function HeroPage() {
  const [data, setData] = useState<HeroData>({
    words: ["", "", ""],
    backgroundType: "image",
    backgroundImageUrl: "",
    backgroundImages: [],
    backgroundVideoUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get<HeroData>("/api/hero").then(({ data: d }) => {
      if (d.words) {
        setData({
          words: d.words,
          backgroundType: d.backgroundType ?? "image",
          backgroundImageUrl: d.backgroundImageUrl ?? "",
          backgroundImages: d.backgroundImages ?? [],
          backgroundVideoUrl: d.backgroundVideoUrl ?? "",
        });
      }
    });
  }, []);

  const save = async () => {
    setSaving(true);
    await api.put("/api/hero", data);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const setWord = (i: number, val: string) => {
    setData((prev) => {
      const words = [...prev.words];
      words[i] = val;
      return { ...prev, words };
    });
  };

  const addSlideshowImage = (url: string) => {
    setData((prev) => ({ ...prev, backgroundImages: [...prev.backgroundImages, url] }));
  };

  const removeSlideshowImage = (i: number) => {
    setData((prev) => ({ ...prev, backgroundImages: prev.backgroundImages.filter((_, idx) => idx !== i) }));
  };

  const uploadVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data: res } = await api.post<{ url: string }>("/api/upload-video", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setData((prev) => ({ ...prev, backgroundVideoUrl: res.url }));
    } finally {
      setVideoUploading(false);
    }
  };

  const isActive = (type: BackgroundType) => data.backgroundType === type;

  const SectionHeader = ({ type, title }: { type: BackgroundType; title: string }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-white">{title}</span>
        {isActive(type) && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 uppercase tracking-wider">
            Live
          </span>
        )}
      </div>
      {!isActive(type) && (
        <button
          type="button"
          onClick={() => setData((prev) => ({ ...prev, backgroundType: type }))}
          className="text-xs px-3 py-1.5 rounded border border-white/20 text-white/50 hover:bg-white hover:text-black hover:border-white transition font-medium"
        >
          Set as Active
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-white font-semibold">Hero Section</h1>
          <p className="text-white/40 text-sm mt-1">Configure backgrounds and publish the one to show on the website</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="px-5 py-2 rounded bg-white text-black text-sm font-semibold hover:bg-white/90 transition disabled:opacity-50"
        >
          {saved ? "Saved!" : saving ? "Saving…" : "Save & Publish"}
        </button>
      </div>

      <div className="flex flex-col gap-5">

        {/* Hero Words */}
        <div className="p-5 rounded-lg bg-white/5 border border-white/10">
          <label className="text-xs text-white/50 uppercase tracking-wider block mb-3">Hero Words</label>
          <div className="flex flex-col gap-2">
            {(data.words.length ? data.words : ["", "", ""]).map((word, i) => (
              <input
                key={i}
                value={word}
                onChange={(e) => setWord(i, e.target.value)}
                placeholder={`Word ${i + 1}`}
                className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-white/30 transition text-lg font-semibold uppercase tracking-widest"
              />
            ))}
          </div>
          <p className="text-white/30 text-xs mt-2">These words animate in sequence on the hero section</p>
        </div>

        {/* Active indicator */}
        <div className="px-4 py-3 rounded-lg bg-white/3 border border-white/10 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
          <p className="text-white/60 text-xs">
            Currently live on website:&nbsp;
            <span className="text-white font-semibold">
              {data.backgroundType === "image" ? "Single Image" : data.backgroundType === "slideshow" ? "Slideshow" : "Video"}
            </span>
            &nbsp;— click <span className="text-white/80">"Set as Active"</span> on another section then <span className="text-white/80">"Save &amp; Publish"</span> to switch.
          </p>
        </div>

        {/* Single Image */}
        <div className={`p-5 rounded-lg border transition ${isActive("image") ? "bg-white/8 border-white/30" : "bg-white/5 border-white/10"}`}>
          <SectionHeader type="image" title="Single Image" />
          <ImageUploader
            label="Background Image"
            currentUrl={data.backgroundImageUrl || undefined}
            onUploaded={(url) => setData((prev) => ({ ...prev, backgroundImageUrl: url }))}
          />
          {data.backgroundImageUrl && (
            <button
              type="button"
              onClick={() => setData((prev) => ({ ...prev, backgroundImageUrl: "" }))}
              className="mt-2 text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-400/10 transition"
            >
              Remove Image
            </button>
          )}
        </div>

        {/* Slideshow */}
        <div className={`p-5 rounded-lg border transition ${isActive("slideshow") ? "bg-white/8 border-white/30" : "bg-white/5 border-white/10"}`}>
          <SectionHeader type="slideshow" title="Slideshow" />
          <p className="text-white/30 text-xs mb-4">
            Images smoothly crossfade and loop infinitely · {data.backgroundImages.length} image{data.backgroundImages.length !== 1 ? "s" : ""} added
          </p>
          {data.backgroundImages.length > 0 && (
            <div className="flex flex-col gap-2 mb-4">
              {data.backgroundImages.map((url, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded bg-white/5 border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-20 h-14 object-cover rounded shrink-0" />
                  <p className="text-white/40 text-xs truncate flex-1">{url}</p>
                  <button
                    type="button"
                    onClick={() => removeSlideshowImage(i)}
                    className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-red-400/10 transition shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          <ImageUploader label="Add Image" onUploaded={addSlideshowImage} />
        </div>

        {/* Video */}
        <div className={`p-5 rounded-lg border transition ${isActive("video") ? "bg-white/8 border-white/30" : "bg-white/5 border-white/10"}`}>
          <SectionHeader type="video" title="Video" />
          <p className="text-white/30 text-xs mb-4">Video autoplays muted and loops in the hero background</p>
          {data.backgroundVideoUrl && (
            <video
              src={data.backgroundVideoUrl}
              className="w-full h-40 object-cover rounded border border-white/10 mb-3"
              muted
              playsInline
            />
          )}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              disabled={videoUploading}
              className="px-4 py-2 text-sm rounded bg-white/10 text-white hover:bg-white/20 transition disabled:opacity-50"
            >
              {videoUploading ? "Uploading…" : data.backgroundVideoUrl ? "Change Video" : "Upload Video"}
            </button>
            {data.backgroundVideoUrl && (
              <button
                type="button"
                onClick={() => setData((prev) => ({ ...prev, backgroundVideoUrl: "" }))}
                className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-400/10 transition"
              >
                Remove Video
              </button>
            )}
          </div>
          <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={uploadVideo} />
        </div>

      </div>

      <div className="mt-5">
        <a href="http://localhost:3000/" target="_blank" rel="noopener noreferrer"
          className="text-sm text-white/40 hover:text-white transition underline">
          Preview on site →
        </a>
      </div>
    </div>
  );
}
