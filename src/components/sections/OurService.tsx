import React, { useState } from "react";

type Service = {
  id: number;
  index: string;
  title: string;
  tags: string[];
  description: string;
};

const services: Service[] = [
  {
    id: 1,
    index: "01",
    title: "Brand Experience Design",
    tags: [
      "Logo & Identity",
      "Brand Strategy",
      "Visual Language",
      "Brand Guidelines",
      "Typography Systems",
      "Colour Palettes",
      "Brand Stationery",
      "Startup Branding",
      "Rebranding",
    ],
    description:
      "We build brands that don't just look good — they behave with purpose and speak with intent. From strategy to visual identity, every decision is rooted in your business, your audience, and the world they exist in.",
  },
  {
    id: 2,
    index: "02",
    title: "Packaging Design",
    tags: [
      "Structural Design",
      "Retail Packaging",
      "FMCG Packaging",
      "Label Design",
      "Unboxing Experience",
      "Print-Ready Files",
      "Dieline Development",
      "Sustainable Packaging",
      "E-commerce Packaging",
    ],
    description:
      "We design packaging that stops people mid-scroll and holds up in the physical world. From structural dielines to print-ready artwork, we cover the full spectrum of how your product presents itself on shelf.",
  },
  {
    id: 3,
    index: "03",
    title: "Merchandise & Print",
    tags: [
      "Merchandise Graphics",
      "Apparel Design",
      "Event Merchandise",
      "Print Coordination",
      "Branded Collateral",
      "Promotional Items",
      "Large Format Print",
      "Zines & Lookbooks",
    ],
    description:
      "We design merchandise and printed materials that carry your brand beyond screens — into hands, walls, and wardrobes. We coordinate design and production end to end so nothing gets lost in translation.",
  },
  {
    id: 4,
    index: "04",
    title: "Installation Design",
    tags: [
      "Retail Environments",
      "Event Installations",
      "Pop-Up Design",
      "Exhibition Design",
      "Environmental Graphics",
      "Wayfinding",
      "Signage Systems",
      "Experiential Spaces",
    ],
    description:
      "We design experiences that fill space with meaning. From pop-ups to permanent installations, we bring the same rigour to three-dimensional brand expression that we bring to everything else.",
  },
  {
    id: 5,
    index: "05",
    title: "Fabrication",
    tags: [
      "Custom Fabrication",
      "Prototype Build",
      "Material Sourcing",
      "Vendor Coordination",
      "Structural Build",
      "Display Props",
      "Signage Fabrication",
    ],
    description:
      "We don't just design it — we build it. Through our trusted fabrication network, we manage production from material selection to final installation, with full creative oversight at every step.",
  },
];

const OurService: React.FC = () => {
  const [active, setActive] = useState<number | null>(1);

  const toggle = (id: number) => {
    setActive((prev) => (prev === id ? null : id));
  };

  return (
    <section className="text-black pt-[130px]">
      {/* HEADER */}
      <div className="mx-auto mb-16 px-8 md:px-16">
        <span className="text-power font-secondary tracking-[0.3em] uppercase text-black">
          What We Offer
        </span>
        <h2 className="text-head uppercase font-primary tracking-widest text-black mt-4 mb-4">
          Our Services
        </h2>
        <div className="w-12 h-px bg-black/30" />
      </div>

      {/* ACCORDION */}
      <div className="mx-auto bg-[#181818] ">
        {services.map((service) => {
          const isActive = active === service.id;
          return (
            <div
              key={service.id}
              className={`border-b border-white/10 pt-6 px-8 md:px-16 pb-8 transition-all duration-500
                ${isActive ? "bg-[#f2f2f0]" : ""}`}
            >
              {/* ROW HEADER */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggle(service.id)}
              >
                <div className="flex items-baseline gap-5">
                  {/* <span
                    className={`text-power font-secondary tracking-[0.3em] opacity-40 ${isActive ? "text-black" : "text-white"}`}
                  >
                    {service.index} /
                  </span> */}
                  <h3
                    className={`text-midhead font-primary tracking-widest uppercase ${isActive ? "text-black" : "text-white/90"}`}
                  >
                    {service.title}
                  </h3>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="9"
                  viewBox="0 0 9 6"
                  fill="none"
                  className={`transition-transform duration-300 shrink-0 ${isActive ? "rotate-180" : ""}`}
                >
                  <path
                    d="M4.44967 3.57529L7.84383 0.180911C7.95925 0.0656333 8.10432 0.0066061 8.27904 0.00382805C8.45363 0.00118923 8.60133 0.0602169 8.72217 0.180911C8.84286 0.301744 8.90321 0.448134 8.90321 0.620078C8.90321 0.792023 8.84286 0.938412 8.72217 1.05925L4.97696 4.80445C4.8989 4.88237 4.81661 4.93737 4.73008 4.96945C4.64356 5.00154 4.55008 5.01758 4.44967 5.01758C4.34925 5.01758 4.25578 5.00154 4.16925 4.96945C4.08272 4.93737 4.00043 4.88237 3.92238 4.80445L0.177168 1.05925C0.0618902 0.943829 0.00286247 0.798759 8.46941e-05 0.624037C-0.00255419 0.449453 0.0564736 0.301744 0.177168 0.180911C0.298001 0.0602169 0.444391 -0.000130177 0.616335 -0.000130177C0.788279 -0.000130177 0.934669 0.0602169 1.0555 0.180911L4.44967 3.57529Z"
                    fill={isActive ? "#181818" : "white"}
                  />
                </svg>
              </div>

              {/* TAGS — always visible */}
              <div className="flex flex-wrap gap-3 mt-6">
                {service.tags.map((tag, i) => (
                  <span
                    key={i}
                    className={`px-4 py-2 rounded-full text-power font-mono tracking-wider border transition-all
                      ${
                        isActive
                          ? "border-black/20 text-black/60 shadow-md"
                          : "border-white/30 text-white/50"
                      }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* DESCRIPTION — toggles open */}
              <div
                className={`overflow-hidden transition-all duration-500 ${isActive ? "max-h-[300px] mt-8" : "max-h-0"}`}
              >
                <div className="w-8 h-px bg-black/20 mb-6" />
                <p className="text-body font-secondary text-black/60 leading-relaxed max-w-2xl">
                  {service.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default OurService;
