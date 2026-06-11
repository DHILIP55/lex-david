"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/utils/api";

type Service = { _id: string; index: string; title: string; tags: string[]; description: string; isVisible: boolean; order: number };
type SectionConfig = { sectionLabel: string; sectionHeading: string };

export default function OurService() {
  const [services, setServices] = useState<Service[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sectionConfig, setSectionConfig] = useState<SectionConfig>({ sectionLabel: "", sectionHeading: "" });

  useEffect(() => {
    Promise.all([
      fetchApi("/api/services"),
      fetchApi("/api/services/config"),
    ]).then(([data, cfg]) => {
      const list = (data as Service[]).filter((s) => s.isVisible);
      setServices(list);
      if (list.length > 0) setActive(list[0]._id);
      setSectionConfig(cfg as SectionConfig);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const toggle = (id: string) => setActive((prev) => (prev === id ? null : id));

  if (loading) return (
    <section className="text-black pt-[130px]">
      <div className="mx-auto mb-16 px-8 md:px-16 animate-pulse">
        <div className="h-4 w-32 bg-black/10 rounded mb-4" />
        <div className="h-10 w-56 bg-black/10 rounded mb-4" />
        <div className="w-12 h-px bg-black/10" />
      </div>
      <div className="mx-auto bg-[#181818] animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border-b border-white/10 px-8 md:px-16 py-8 flex items-center justify-between">
            <div className="h-7 w-48 bg-white/10 rounded" />
            <div className="h-4 w-4 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <section className="text-black pt-[130px]">
      <div className="mx-auto mb-16 px-8 md:px-16">
        <span className="text-power font-secondary tracking-[0.3em] uppercase text-black">{sectionConfig.sectionLabel}</span>
        <h2 className="text-head uppercase font-primary tracking-widest text-black mt-4 mb-4">{sectionConfig.sectionHeading}</h2>
        <div className="w-12 h-px bg-black/30" />
      </div>
      <div className="mx-auto bg-[#181818]">
        {services.map((service) => {
          const isActive = active === service._id;
          return (
            <div key={service._id} className={`border-b border-white/10 pt-6 px-8 md:px-16 pb-8 transition-all duration-500 ${isActive ? "bg-[#f2f2f0]" : ""}`}>
              <div className="flex justify-between items-center cursor-pointer" onClick={() => toggle(service._id)}>
                <div className="flex items-baseline gap-5">
                  <h3 className={`text-midhead font-primary tracking-widest uppercase ${isActive ? "text-black" : "text-white/90"}`}>{service.title}</h3>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="9" viewBox="0 0 9 6" fill="none" className={`transition-transform duration-300 shrink-0 ${isActive ? "rotate-180" : ""}`}>
                  <path d="M4.44967 3.57529L7.84383 0.180911C7.95925 0.0656333 8.10432 0.0066061 8.27904 0.00382805C8.45363 0.00118923 8.60133 0.0602169 8.72217 0.180911C8.84286 0.301744 8.90321 0.448134 8.90321 0.620078C8.90321 0.792023 8.84286 0.938412 8.72217 1.05925L4.97696 4.80445C4.8989 4.88237 4.81661 4.93737 4.73008 4.96945C4.64356 5.00154 4.55008 5.01758 4.44967 5.01758C4.34925 5.01758 4.25578 5.00154 4.16925 4.96945C4.08272 4.93737 4.00043 4.88237 3.92238 4.80445L0.177168 1.05925C0.0618902 0.943829 0.00286247 0.798759 8.46941e-05 0.624037C-0.00255419 0.449453 0.0564736 0.301744 0.177168 0.180911C0.298001 0.0602169 0.444391 -0.000130177 0.616335 -0.000130177C0.788279 -0.000130177 0.934669 0.0602169 1.0555 0.180911L4.44967 3.57529Z" fill={isActive ? "#181818" : "white"} />
                </svg>
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                {service.tags.map((tag, i) => (
                  <span key={i} className={`px-4 py-2 rounded-full text-power font-mono tracking-wider border transition-all ${isActive ? "border-black/20 text-black/60 shadow-md" : "border-white/30 text-white/50"}`}>{tag}</span>
                ))}
              </div>
              <div className={`overflow-hidden transition-all duration-500 ${isActive ? "max-h-[300px] mt-8" : "max-h-0"}`}>
                <div className="w-8 h-px bg-black/20 mb-6" />
                <p className="text-power font-secondary text-black/60 leading-relaxed max-w-full">{service.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
