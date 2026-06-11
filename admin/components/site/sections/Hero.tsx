"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Navbar from "@/components/site/layout/Navbar";
import { fetchApi } from "@/utils/api";

type HeroData = {
  words: string[];
  backgroundType: "image" | "slideshow" | "video";
  backgroundImageUrl: string;
  backgroundImages: string[];
  backgroundVideoUrl: string;
};

function SlideshowBg({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <>
      {images.map((src, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === current ? 1 : 0,
            transition: "opacity 1.5s ease-in-out",
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}

export default function Hero({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (v: boolean) => void }) {
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [heroData, setHeroData] = useState<HeroData | null>(null);

  useEffect(() => {
    fetchApi("/api/hero").then((d) => setHeroData(d as HeroData));
  }, []);

  useEffect(() => {
    if (!heroData) return;
    const els = wordsRef.current.filter(Boolean) as HTMLSpanElement[];
    if (!els.length) return;
    gsap.fromTo(
      els,
      { y: "110%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.3, clearProps: "transform,opacity" }
    );
  }, [heroData]);

  if (!heroData) {
    return (
      <section className="relative min-h-screen w-full bg-black overflow-hidden">
        <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </section>
    );
  }

  const { words, backgroundImageUrl, backgroundImages, backgroundVideoUrl } = heroData;
  const backgroundType = heroData.backgroundType ?? "image";
  const bgImage = backgroundImageUrl ;

  // For single image: apply directly to the section element (same as original working code)
  const sectionBgStyle: React.CSSProperties =
    backgroundType === "image"
      ? { backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
      : {};

  return (
    <section
      className="relative min-h-screen w-full text-white overflow-hidden"
      style={sectionBgStyle}
    >
      {/* Slideshow layers */}
      {backgroundType === "slideshow" && backgroundImages?.length > 0 && (
        <SlideshowBg images={backgroundImages} />
      )}

      {/* Video layer */}
      {backgroundType === "video" && backgroundVideoUrl && (
        <video
          src={backgroundVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
      )}

      <div className="absolute inset-0 bg-black/30" style={{ zIndex: 1 }} />
      <div style={{ position: "relative", zIndex: 20 }}>
        <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </div>
      <div className="relative flex items-end h-screen pb-14 md:pb-24 lg:pb-32 px-6 md:px-12 lg:px-20" style={{ zIndex: 2 }}>
        <div className="flex flex-col lg:flex-row w-full gap-5 lg:gap-3 justify-center items-center">
          {words.map((word, i) => (
            <div key={i} className="overflow-hidden">
              <span
                ref={(el) => { wordsRef.current[i] = el; }}
                className="hero-word block font-primary uppercase leading-[0.92] cursor-default select-none"
                style={{ fontSize: "var(--text-navbar)" }}
              >
                {word}
              </span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .hero-word { position: relative; display: inline-block; padding-bottom: 4px; transition: transform 0.4s cubic-bezier(0.22,1,0.36,1); }
        .hero-word::after { content:''; position:absolute; left:0; bottom:0; width:100%; height:2.5px; background:white; transform:scaleX(0); transform-origin:left; transition:transform 0.4s cubic-bezier(0.22,1,0.36,1); }
        .hero-word:hover { transform: translateY(-2px); }
        .hero-word:hover::after { transform: scaleX(1); }
      `}</style>
    </section>
  );
}
