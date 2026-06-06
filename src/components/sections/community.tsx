import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    index: "01",
    title: "What We Do",
    bg: "bg-[var(--orange-color-1)]",
    body: `We work across five connected disciplines: Brand Design, Packaging Design,
Merchandise Graphics and Printing, Installation Design, and Fabrication. From building a brand
identity from the ground up to designing packaging that stops people mid-scroll — we cover the
full spectrum of how a brand shows up in the physical world. One studio, five services, zero
compromise on creative quality.`,
  },
  {
    index: "02",
    title: "Our Approach",
    bg: "bg-[var(--grey-color-1)]",
    body: `We follow four stages: Understand, Design, Develop, and Deliver. We listen before
we create, asking the questions others skip until your brief becomes crystal clear. We design
with intention — every decision rooted in your business, your audience, and the world they exist
in. We deliver completely, cleanly, and on time.`,
  },
  {
    index: "03",
    title: "Why Us",
    bg: "bg-[var(--blue-color-1)]",
    body: `There are studios that make things look good. We make things work and then make them
look good doing it. Lex & David sits at a rare intersection of artistic rebellion and operational
discipline. Most studios offer creative spark or reliable delivery. We refuse to choose. We bring
creative direction, end-to-end coordination, and a trusted network under one roof.`,
  },
];

const Community: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [navH, setNavH] = useState(80);

  /* ── Measure sticky navbar height, update on resize ─────────── */
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
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const panels = gsap.utils.toArray<HTMLElement>(".card");
      panels.forEach((panel, index) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top top",
          end: index === panels.length - 1 ? "bottom bottom" : undefined,
          pin: true,
          pinSpacing: false,
        });
      });
    });

    mm.add("(max-width: 1023px)", () => {
      const panels = gsap.utils.toArray<HTMLElement>(".mobile-card");
      panels.forEach((panel, index) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top top",
          end: index === panels.length - 1 ? "bottom bottom" : undefined,
          pin: true,
          pinSpacing: false,
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="w-full">
      {/* ── DESKTOP ────────────────────────────────────────────── */}
      <div className="hidden lg:flex w-full mx-auto">
        {/* LEFT: sticky about panel */}
        <div className="w-1/2 px-16 sticky top-0 h-screen flex flex-col justify-between overflow-auto" style={{ paddingTop: navH + 40 }}>
          <div className="flex flex-col gap-8">
            {/* EYEBROW */}
            <span className="text-power font-secondary tracking-[0.3em] uppercase text-black">
              Studio / Chennai
            </span>

            <h1 className="text-head font-primary tracking-widest uppercase leading-tight">
              About Us
            </h1>

            {/* DIVIDER */}
            <div className="w-12 h-px bg-black/30" />

            <p className="font-secondary text-body text-black leading-relaxed">
              Lex & David is a Chennai-based creative studio built by artistic
              rebels who refused to follow the standard script but never lost
              sight of getting the work done. We are restless thinkers,
              deliberate makers, and relentless problem solvers who believe that
              design is not decoration, it is direction.
            </p>
          </div>

          {/* BOTTOM META */}
          <div className="pb-16 flex items-center gap-4">
            <span className="text-power font-secondary tracking-[0.25em] uppercase text-black/70">
              Est. 2024
            </span>
            <div className="flex-1 h-px bg-black/10" />
            <span className="text-power font-secondary tracking-[0.25em] uppercase text-black/70">
              Creative Studio
            </span>
          </div>
        </div>

        {/* RIGHT: scroll cards */}
        <div ref={containerRef} className="w-1/2 relative h-[400vh]">
          {/* SPACER with background image */}
          <div className="card h-screen relative overflow-hidden">
            {/* <img
              src={aboutbg}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 backdrop-blur-sm bg-white/20" /> */}
          </div>

          {cards.map((card) => (
            <div
              key={card.index}
              className={`card h-screen flex items-start px-16 pt-[160px] ${card.bg}`}
            >
              <div className="flex flex-col gap-6 w-full">
                {/* COUNTER */}
                {/* <span className="text-power font-secondary tracking-[0.3em] uppercase opacity-50">
                  {card.index} /
                </span> */}
                <h2 className="text-subhead font-primary tracking-widest uppercase leading-tight">
                  {card.title}
                </h2>
                <div className="w-8 h-px bg-current opacity-30" />
                <p className="font-secondary text-body leading-relaxed opacity-80 max-w-md">
                  {card.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MOBILE / TABLET ─────────────────────────────────────── */}
      <div className="lg:hidden w-full">
        {/* INTRO CARD */}
        <div className="mobile-card min-h-screen flex flex-col justify-center px-8 md:px-12 gap-8" style={{ paddingTop: navH + 32 }}>
          <span className="text-power font-secondary tracking-[0.3em] uppercase text-black">
            Studio / Chennai
          </span>
          <h1 className="text-head font-primary tracking-widest uppercase leading-tight">
            About Us
          </h1>
          <div className="w-12 h-px bg-black/40" />
          <p className="font-secondary text-body text-black/60 leading-relaxed max-w-md">
            Lex & David is a Chennai-based creative studio built by artistic
            rebels who refused to follow the standard script but never lost
            sight of getting the work done.
          </p>
        </div>

        {cards.map((card) => (
          <div
            key={card.index}
            className={`mobile-card min-h-screen flex items-center px-8 md:px-12 ${card.bg}`}
          >
            <div className="flex flex-col gap-8 w-full">
              <h2 className="text-subhead font-primary tracking-widest uppercase leading-tight">
                {card.title}
              </h2>
              <div className="w-8 h-px bg-current text-black/40 " />
              <p className="font-secondary text-body leading-relaxed opacity-80">
                {card.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Community;
