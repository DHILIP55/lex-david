"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchApi } from "@/utils/api";

gsap.registerPlugin(ScrollTrigger);

type Card = { index: string; title: string; bgClass: string; body: string };
type CommunityData = { aboutTitle: string; aboutSubtitle: string; aboutBody: string; establishedYear: string; creativeStudio: string; cards: Card[] };

export default function Community() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [navH, setNavH] = useState(80);
  const [data, setData] = useState<CommunityData | null>(null);

  useEffect(() => {
    fetchApi("/api/community").then((d) => setData(d as CommunityData));
  }, []);

  useEffect(() => {
    const measure = () => {
      const nav = document.querySelector<HTMLElement>(".sticky.top-0.z-50");
      if (nav) setNavH(nav.offsetHeight);
    };
    measure();
    const nav = document.querySelector<HTMLElement>(".sticky.top-0.z-50");
    const ro = new ResizeObserver(measure);
    if (nav) ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!data) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const panels = gsap.utils.toArray<HTMLElement>(".card");
      panels.forEach((panel, index) => {
        ScrollTrigger.create({ trigger: panel, start: "top top", end: index === panels.length - 1 ? "bottom bottom" : undefined, pin: true, pinSpacing: false });
      });
    });
    mm.add("(max-width: 1023px)", () => {
      const panels = gsap.utils.toArray<HTMLElement>(".mobile-card");
      panels.forEach((panel, index) => {
        ScrollTrigger.create({ trigger: panel, start: "top top", end: index === panels.length - 1 ? "bottom bottom" : undefined, pin: true, pinSpacing: false });
      });
    });
    return () => mm.revert();
  }, [data]);

  if (!data) return <section className="w-full min-h-screen" />;

  const cards = data.cards ?? [];

  return (
    <section className="w-full">
      <div className="hidden lg:flex w-full mx-auto">
        <div className="w-1/2 px-16 sticky top-0 h-screen flex flex-col justify-between overflow-auto" style={{ paddingTop: navH + 40 }}>
          <div className="flex flex-col gap-8">
            <span className="text-power font-secondary tracking-[0.3em] uppercase text-black">{data.aboutSubtitle}</span>
            <h1 className="text-head font-primary tracking-widest uppercase leading-tight">{data.aboutTitle}</h1>
            <div className="w-12 h-px bg-black/30" />
            <p className="font-secondary text-body text-black leading-relaxed">{data.aboutBody}</p>
          </div>
          <div className="pb-16 flex items-center gap-4">
            <span className="text-power font-secondary tracking-[0.25em] uppercase text-black/70">{data.establishedYear}</span>
            <div className="flex-1 h-px bg-black/10" />
            <span className="text-power font-secondary tracking-[0.25em] uppercase text-black/70">{data.creativeStudio}</span>
          </div>
        </div>
        <div ref={containerRef} className="w-1/2 relative h-[400vh]">
          <div className="card h-screen relative overflow-hidden" />
          {cards.map((card) => (
            <div key={card.index} className={`card h-screen flex items-start px-16 pt-[160px] ${card.bgClass}`}>
              <div className="flex flex-col gap-6 w-full">
                <h2 className="text-subhead font-primary tracking-widest uppercase leading-tight">{card.title}</h2>
                <div className="w-8 h-px bg-current opacity-30" />
                <p className="font-secondary text-body leading-relaxed opacity-80 w-full">{card.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="lg:hidden w-full">
        <div className="mobile-card min-h-screen flex flex-col justify-center px-8 md:px-12 gap-8" style={{ paddingTop: navH + 32 }}>
          <span className="text-power font-secondary tracking-[0.3em] uppercase text-black">{data.aboutSubtitle}</span>
          <h1 className="text-head font-primary tracking-widest uppercase leading-tight">{data.aboutTitle}</h1>
          <div className="w-12 h-px bg-black/40" />
          <p className="font-secondary text-body text-black/60 leading-relaxed w-full">{data.aboutBody}</p>
        </div>
        {cards.map((card) => (
          <div key={card.index} className={`mobile-card min-h-screen flex items-center px-8 md:px-12 ${card.bgClass}`}>
            <div className="flex flex-col gap-8 w-full">
              <h2 className="text-subhead font-primary tracking-widest uppercase leading-tight">{card.title}</h2>
              <div className="w-8  h-px bg-current text-black/40" />
              <p className="font-secondary text-body leading-relaxed opacity-80">{card.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
