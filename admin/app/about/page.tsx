"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StickyNavbar from "@/components/site/layout/StickyNavbar";
import { fetchApi } from "@/utils/api";

gsap.registerPlugin(ScrollTrigger);

type Card = { index: string; title: string; bgClass: string; body: string };
type CommunityData = { aboutTitle: string; aboutSubtitle: string; aboutBody: string; establishedYear: string; creativeStudio: string; cards: Card[] };

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [navH, setNavH] = useState(80);
  const [showScroll, setShowScroll] = useState(false);
  const [data, setData] = useState<CommunityData | null>(null);

  useEffect(() => {
    fetchApi("/api/community")
      .then((d) => setData(d as CommunityData))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const measure = () => { const nav = document.querySelector<HTMLElement>(".sticky.top-0.z-50"); if (nav) setNavH(nav.offsetHeight); };
    measure();
    const ro = new ResizeObserver(measure);
    const nav = document.querySelector<HTMLElement>(".sticky.top-0.z-50");
    if (nav) ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const checkScrollable = () => setShowScroll(document.body.scrollHeight > window.innerHeight + 10);
    const timer = setTimeout(checkScrollable, 300);
    window.addEventListener("resize", checkScrollable);
    const onScroll = () => { if (window.scrollY > 60) setShowScroll(false); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(timer); window.removeEventListener("resize", checkScrollable); window.removeEventListener("scroll", onScroll); };
  }, []);

  useEffect(() => {
    if (!data) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const panels = gsap.utils.toArray<HTMLElement>(".about-card");
      panels.forEach((panel, index) => { ScrollTrigger.create({ trigger: panel, start: "top top", end: index === panels.length - 1 ? "bottom bottom" : undefined, pin: true, pinSpacing: false }); });
    });
    mm.add("(max-width: 1023px)", () => {
      const panels = gsap.utils.toArray<HTMLElement>(".about-mobile-card");
      panels.forEach((panel, index) => { ScrollTrigger.create({ trigger: panel, start: "top top", end: index === panels.length - 1 ? "bottom bottom" : undefined, pin: true, pinSpacing: false }); });
    });
    return () => mm.revert();
  }, [data]);

  if (!data) return (
    <div>
      <StickyNavbar />
      <section className="w-full animate-pulse">
        <div className="hidden lg:flex w-full">
          <div className="w-1/2 px-16 py-32 flex flex-col gap-8">
            <div className="h-4 w-36 bg-black/10 rounded" />
            <div className="h-12 w-3/4 bg-black/10 rounded" />
            <div className="w-12 h-px bg-black/10" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-black/10 rounded" />
              <div className="h-4 w-5/6 bg-black/10 rounded" />
              <div className="h-4 w-4/6 bg-black/10 rounded" />
            </div>
          </div>
          <div className="w-1/2 min-h-screen bg-black/5" />
        </div>
        <div className="lg:hidden px-8 py-16 flex flex-col gap-8">
          <div className="h-4 w-36 bg-black/10 rounded" />
          <div className="h-10 w-3/4 bg-black/10 rounded" />
          <div className="w-12 h-px bg-black/10" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-black/10 rounded" />
            <div className="h-4 w-5/6 bg-black/10 rounded" />
          </div>
        </div>
      </section>
    </div>
  );

  const cards = data.cards ?? [];

  return (
    <div>
      <StickyNavbar />
      <section className="w-full">
        <div className="hidden lg:flex w-full mx-auto">
          <div className="w-1/2 px-16 sticky top-0 h-screen flex flex-col justify-between overflow-auto" style={{ paddingTop: navH + 40 }}>
            <div className="flex flex-col gap-8">
              <span className="text-power font-secondary tracking-[0.3em] uppercase text-black">{data.aboutSubtitle}</span>
              <h1 className="text-head font-primary tracking-widest uppercase leading-tight">{data.aboutTitle}</h1>
              <div className="w-12 h-px bg-black/30" />
              <p className="font-secondary text-body text-black leading-relaxed">{data.aboutBody}</p>
            </div>
            <div className="pb-10 flex items-center gap-4">
              <span className="text-power font-secondary tracking-[0.25em] uppercase text-black/70">{data.establishedYear}</span>
              <div className="flex-1 h-px bg-black/10" />
              <span className="text-power font-secondary tracking-[0.25em] uppercase text-black/70">{data.creativeStudio}</span>
            </div>
          </div>
          <div ref={containerRef} className="w-1/2 relative h-[400vh]">
            <div className="about-card h-screen relative overflow-hidden">
              <div className="absolute inset-0 backdrop-blur-sm bg-white/20" />
              </div>
            {cards.map((card) => (
              <div key={card.index} className={`about-card h-screen flex items-start px-16 pt-[160px] ${card.bgClass}`}>
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
          <div className="about-mobile-card min-h-screen flex flex-col justify-center px-8 md:px-12 gap-8" style={{ paddingTop: navH + 32 }}>
            <span className="text-power font-secondary tracking-[0.3em] uppercase text-black">{data.aboutSubtitle}</span>
            <h1 className="text-head font-primary tracking-widest uppercase leading-tight">{data.aboutTitle}</h1>
            <div className="w-12 h-px bg-black/40" />
            <p className="font-secondary text-body text-black/60 leading-relaxed max-w-md">{data.aboutBody}</p>
          </div>
          {cards.map((card) => (
            <div key={card.index} className={`about-mobile-card min-h-screen flex items-center px-8 md:px-12 ${card.bgClass}`}>
              <div className="flex flex-col gap-8 w-full">
                <h2 className="text-subhead font-primary tracking-widest uppercase leading-tight">{card.title}</h2>
                <div className="w-8 h-px bg-current opacity-30" />
                <p className="font-secondary text-body leading-relaxed opacity-80">{card.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {showScroll && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-power font-secondary uppercase tracking-[0.25em] text-black/40">Scroll</span>
          <div className="w-px bg-black/20 overflow-hidden" style={{ height: "40px" }}>
            <div className="w-full bg-black/60" style={{ height: "100%", animation: "scrollLine 1.4s ease-in-out infinite" }} />
          </div>
        </div>
      )}
      <style>{`@keyframes scrollLine { 0%{transform:translateY(-100%)} 50%{transform:translateY(0%)} 100%{transform:translateY(100%)} }`}</style>
    </div>
  );
}
