"use client";
import { useState, useRef, useEffect } from "react";
import { fetchApi } from "@/utils/api";

type FAQItem = { q: string; a: string };
type FAQData = { [key: string]: FAQItem[] };
type FaqCategory = { _id: string; categoryName: string; order: number; items: { question: string; answer: string; order: number }[] };
type FaqConfig = { sectionLabel: string; sectionHeading: string };

export default function FaqSection() {
  const [faqData, setFaqData] = useState<FAQData>({});
  const [faqConfig, setFaqConfig] = useState<FaqConfig>({ sectionLabel: "", sectionHeading: "" });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([fetchApi("/api/faq"), fetchApi("/api/faq/config")]).then(([data, cfg]) => {
      const cats = data as FaqCategory[];
      const sorted = cats.sort((a, b) => a.order - b.order);
      const mapped: FAQData = {};
      sorted.forEach((cat) => {
        mapped[cat.categoryName] = cat.items.sort((a, b) => a.order - b.order).map((i) => ({ q: i.question, a: i.answer }));
      });
      setFaqData(mapped);
      setFaqConfig(cfg as FaqConfig);
    });
  }, []);

  const toggleCategory = (category: string) => { setActiveCategory((prev) => (prev === category ? null : category)); setActiveIndex(null); };
  const toggleQuestion = (index: number) => setActiveIndex((prev) => (prev === index ? null : index));

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const goingDown = e.deltaY > 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 2;
      const atTop = scrollTop <= 0;
      if ((goingDown && !atBottom) || (!goingDown && !atTop)) { e.preventDefault(); el.scrollBy({ top: e.deltaY, behavior: "auto" }); }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [activeCategory]);

  if (Object.keys(faqData).length === 0) return <section className="w-full min-h-screen bg-[#f2f2f0]" />;

  return (
    <section className="w-full min-h-screen overflow-y-auto pt-[30px] bg-[#f2f2f0]">
      <div className="relative w-full py-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/faqb.png" alt="FAQ Background" className="w-full object-cover" />
        <div className="px-8 md:px-16">
          <span className="text-power font-secondary tracking-[0.3em] uppercase text-black block mb-4">{faqConfig.sectionLabel}</span>
          <h1 className="text-head font-primary tracking-widest uppercase text-black leading-tight mb-4">{faqConfig.sectionHeading}</h1>
          <div className="w-12 h-px bg-black/40" />
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden w-full px-2">
        {!activeCategory && (
          <div className="flex w-full h-[80vh] gap-2 overflow-hidden">
            {Object.keys(faqData).map((category) => (
              <div key={category} onClick={() => toggleCategory(category)} className="flex-1 flex items-center justify-center border-[1.5px] border-black cursor-pointer hover:bg-black hover:text-white transition-all duration-500">
                <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }} className="text-subhead font-primary tracking-widest uppercase">{category}</span>
              </div>
            ))}
          </div>
        )}
        {activeCategory && (
          <div className="min-h-screen py-20 bg-white/80">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/10">
              <h1 className="text-subhead font-primary tracking-widest uppercase flex-1 px-4">{activeCategory}</h1>
              <button className="text-subhead font-light leading-none" onClick={() => setActiveCategory(null)}>✕</button>
            </div>
            <div className="p-4 space-y-0">
              {faqData[activeCategory].map((item, index) => (
                <div key={index} className="border-b border-black/10 text-black/80">
                  <button onClick={() => toggleQuestion(index)} className="w-full text-left px-2 py-5 font-primary text-sectionhead tracking-wide flex justify-between items-center gap-4">
                    <span>{item.q}</span>
                    <span className="text-[42px] font-light leading-none shrink-0">{activeIndex === index ? "−" : "+"}</span>
                  </button>
                  <div className={`transition-all font-secondary text-body text-black/60 leading-relaxed duration-300 px-2 ${activeIndex === index ? "max-h-60 pb-5" : "max-h-0 overflow-hidden"}`}>{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:flex h-screen w-full justify-between overflow-hidden gap-2 px-2">
        {Object.entries(faqData).map(([category, questions]) => {
          const isActive = category === activeCategory;
          return (
            <div onClick={() => toggleCategory(category)} key={category} className={`relative flex transition-all duration-500 cursor-pointer border-2 border-black ${isActive ? "w-[150%]" : "w-1/5"}`}>
              {!isActive && (
                <div className="text-black text-subhead font-primary hover:bg-black hover:text-white w-full flex items-end justify-center pb-40 transition-colors duration-300">
                  <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }} className="tracking-widest uppercase">{category}</span>
                </div>
              )}
              {isActive && (
                <div className="flex w-full">
                  <div className="w-20 text-black flex items-center justify-center border-r border-white/10">
                    <span className="-rotate-90 tracking-widest uppercase font-primary text-subhead whitespace-nowrap">{category}</span>
                  </div>
                  <div ref={scrollContainerRef} className="flex-1 px-6 py-4 overflow-y-auto no-scrollbar bg-[#181818]">
                    {questions.map((item, index) => (
                      <div key={index} className="border-b border-white/10 hover:bg-white/5 text-white py-[30px] px-[30px] transition-colors duration-200">
                        <button onClick={(e) => { e.stopPropagation(); toggleQuestion(index); }} className="w-full text-left py-3 font-primary tracking-wide flex justify-between items-center gap-4">
                          <span className="text-sectionhead">{item.q}</span>
                          <span className="text-[56px] font-light leading-none shrink-0 opacity-60">{activeIndex === index ? "−" : "+"}</span>
                        </button>
                        <div className={`transition-all font-secondary text-body text-white/60 leading-relaxed duration-300 px-[20px] ${activeIndex === index ? "max-h-[500px] pb-5" : "max-h-0 overflow-hidden"}`}>{item.a}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
