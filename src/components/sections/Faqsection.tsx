import { useState, useRef, useEffect } from "react";
import faqb from "../../assets/faqb.png";

type FAQItem = { q: string; a: string };
type FAQData = { [key: string]: FAQItem[] };

const faqData: FAQData = {
  General: [
    {
      q: "What does Lex & David do?",
      a: "Lex & David is a creative concept studio. We help brands and businesses define how they look, feel, and communicate — across brand identity, packaging, merchandise, installations, and fabrication. We handle the creative direction and design, and work with trusted execution partners to bring everything to life.",
    },
    {
      q: "Who do you typically work with?",
      a: "We work with entrepreneurs launching new ventures, small to mid-sized brands, businesses setting up retail or event spaces, and anyone who needs design that looks intentional and professional. If you have something that needs to look good and communicate clearly, we can help.",
    },
    {
      q: "Do I need to have a big budget to work with you?",
      a: "Not at all. We work across a range of project sizes. During our first conversation, we'll understand what you need and suggest an approach that fits your timeline and investment.",
    },
    {
      q: "How long does a typical project take?",
      a: " It depends on the service. Merchandise graphics can be turned around in 5–7 working days. Packaging design typically takes 2–3 weeks. Brand design takes 3–5 weeks depending on scope. Installation design concepts take 1–2 weeks. We'll give you a clear timeline before the project begins.",
    },
    {
      q: "Do you work with clients outside Chennai?",
      a: "Yes. Brand design, packaging artwork, and merchandise graphics are delivered digitally, so location is no barrier. For installation and fabrication projects, we currently serve clients within Chennai and nearby regions.",
    },
    {
      q: "How do payments work? ",
      a: "We work on a 50% advance before the project begins and 50% on final delivery. For larger projects, a milestone-based payment schedule is set upfront.",
    },
    {
      q: "Will I own the final design files?",
      a: " Yes. Once final payment is cleared, all design files created for your project belong to you.",
    },
    {
      q: "Do you sign NDAs?",
      a: "Yes. If your project involves sensitive business information or an unreleased product, we're happy to sign a mutual NDA before the briefing begins.",
    },
  ],
  "Brand Design": [
    {
      q: "What is brand design? ",
      a: " Brand design is the process of creating the visual identity of your business — everything a person sees and feels when they encounter your brand. This includes your logo, colour palette, typography, visual style, and the guidelines that ensure everything looks consistent across every touchpoint.",
    },
    {
      q: "What's the difference between a logo and a brand? ",
      a: "A logo is a single mark — a symbol or wordmark that represents your business. A brand is the complete visual system built around it. Your logo is one part of your brand. The colours you use, the fonts, the tone of your visuals, the way your packaging looks, how your social media feels — all of that together is your brand. We build the whole system, not just the mark.",
    },
    {
      q: "I already have a logo. Can you build a brand around it? ",
      a: "Yes. If your logo is something you want to keep, we can develop a full visual identity around it — creating the colour system, typography, visual language, and brand guidelines that make it feel complete and consistent.",
    },
    {
      q: "My logo looks outdated. Can you redesign it?",
      a: " Absolutely. We handle both fresh brand creation for new businesses and brand refreshes for existing ones that have outgrown their current identity. We'll assess what's worth keeping and what needs to evolve.",
    },
    {
      q: "What do I receive at the end of a brand design project?",
      a: "You'll receive a complete brand identity package including your primary and secondary logo variations, colour palette with exact codes, typography system, basic usage guidelines, and all source files. Depending on the package, this may also include social media templates, business card design, and brand application mockups.",
    },
    {
      q: "What are brand guidelines and do I actually need them?",
      a: "Brand guidelines are a document that shows how your brand should look and be used — which colours, which fonts, how the logo is placed, what to avoid. You need them the moment anyone other than us starts creating content for your brand — a social media manager, a printer, a web developer. Without guidelines, your brand slowly becomes inconsistent and loses its impact.",
    },
    {
      q: "How many logo concepts will I see? ",
      a: "We present two distinct logo directions in the first round. Each direction includes a rationale explaining the thinking behind it. You choose the direction that resonates and we refine from there. This focused approach leads to better outcomes than presenting ten options that overwhelm rather than clarify.",
    },
    {
      q: "Can you design a brand for a business that's not yet launched? ",
      a: "Yes — in fact, this is the ideal time to do it. Building your brand before you launch means your packaging, merchandise, social media, and any physical presence all start from a unified foundation. It's far easier and more cost-effective than retrofitting a brand after the fact.",
    },
    {
      q: "Will the brand work across print and digital?",
      a: " Yes. Everything we design is built to work across both — on screen for social media and websites, and in print for packaging, merchandise, and physical materials. Colour values are provided in both RGB and CMYK formats.",
    },
    {
      q: "What if I don't like the concepts presented?",
      a: "Our briefing process is thorough precisely to avoid this. Before we design anything, we invest time understanding your business, your audience, and your visual preferences. That said, if the first round doesn't hit the mark, we include one full revision round in every project. Additional revision rounds beyond that are available at an agreed rate.",
    },
    {
      q: "Do you also design brand names or taglines? ",
      a: "We can support naming and tagline development as an add-on. If you're a new business that hasn't settled on a name yet, reach out and we'll discuss how we can help.",
    },
    {
      q: "I run a small business — is brand design really necessary for me?",
      a: "If you're selling anything — a product, a service, an experience — the way you look affects whether people trust you, remember you, and choose you over someone else. A strong brand isn't a luxury. It's the difference between looking like a business people take seriously and one they scroll past. The investment pays for itself faster than most people expect.",
    },
  ],
  "Packaging Design": [
    {
      q: "What kinds of packaging do you design?",
      a: "We design for folding cartons, rigid boxes, mailer boxes, pouches, and product labels. Whether you're launching a skincare range, a food product, a candle line, or a subscription box — we've got you covered.",
    },
    {
      q: "I already have a box structure. Can you just design the artwork? ",
      a: "Absolutely. If you have an existing dieline or box template, we can work directly within it and deliver print-ready artwork.",
    },
    {
      q: "Do you provide the dieline or box structure as well? ",
      a: " For standard packaging types, yes — we can work with standard dielines. For custom structural packaging, we'll connect you with the right vendor who can provide a structural template before we apply the design.",
    },
    {
      q: "What files will I receive at the end?",
      a: "You'll receive print-ready artwork files — typically PDF/X-1a and layered Illustrator files — along with a packaging mockup showing how the final design looks on the product.",
    },
    {
      q: "Can you design packaging for multiple products in a range?",
      a: " Yes, and we'd recommend it. Designing a range together ensures visual consistency across your entire product line, which is important for shelf presence and brand recognition.",
    },
    {
      q: "Do you coordinate with the printer as well? ",
      a: "We can recommend trusted print vendors and guide you through the print process. If you already have a printer, we'll ensure the files we deliver meet their specifications exactly.",
    },
    {
      q: "What information do I need to give you to get started? ",
      a: "We'll need to know the product name and description, the box type or packaging format you're considering, who your customer is, what feeling you want the packaging to give, and any brand assets you already have such as a logo or brand colours.",
    },
    {
      q: "My product is going on a retail shelf. Does that change anything? ",
      a: "Yes, and it's an important detail. Retail packaging needs to work at a distance, stand out among competitors, and communicate key information within seconds. We design with the retail environment in mind when that's the context.",
    },
    {
      q: "Should I do brand design before packaging design? ",
      a: "Ideally yes. Packaging design works best when it's rooted in a defined brand identity — your colours, fonts, and visual language are already established, so the packaging feels like a natural extension of your brand. If you don't have a brand identity yet, we can handle both together as a combined project.",
    },
  ],
  "Merchandise & Print": [
    {
      q: "What kind of merchandise can you design for?",
      a: " We design graphics for T-shirts, hoodies, caps, tote bags, mugs, stickers, notebooks, and most standard merchandise products. If it can be printed on, we can design for it.",
    },
    {
      q: "I want to start a clothing brand. Can you help?",
      a: "Yes — this is one of our specialities. We offer a brand launch package that covers your graphic design system, print-ready artwork, product mockups, and print coordination. You get everything you need to launch your first drop professionally.",
    },
    {
      q: "What's the difference between DTG, DTF, and screen printing? Which one should I choose? ",
      a: " DTG is ideal for small quantities with detailed or photographic prints. DTF is versatile, works on most fabrics, and is a great middle ground. Screen printing is best for larger quantities with bold, limited-colour graphics — it gives the most vibrant and durable result. We'll recommend the right method based on your design and order size.",
    },
    {
      q: "Do I need a large minimum order?",
      a: " It depends on the printing method. DTG and DTF have low or no minimums, making them great for small runs or sampling. Screen printing becomes cost-effective from around 50 pieces upward. We'll guide you to the right option for your quantity.",
    },
    {
      q: "Can I see how the design will look before printing? ",
      a: " Yes, always. We provide digital mockups showing your design on the actual product before any printing begins. Nothing goes to print without your approval.",
    },
    {
      q: "What files do you need if I already have a logo or design?",
      a: "Ideally a vector file — an AI or EPS file from Adobe Illustrator. If you only have a JPEG or PNG, let us know and we'll assess whether it can be used or needs to be redrawn.",
    },
    {
      q: "Can you handle the printing as well, or do I do that myself? ",
      a: " We can manage the print coordination end to end, or we can hand you print-ready files to take to your own printer. Whatever works better for you.",
    },
    {
      q: "I need branded merchandise for a corporate event. Is that something you do?",
      a: " Yes. We regularly handle corporate merchandise for events, employee gifting, and brand activations. Share your brief, quantities, and deadline and we'll take it from there.",
    },
  ],
  "Installation DESIGN": [
    {
      q: "What is installation design? ",
      a: "Installation design is the creative planning of physical spaces and environments — exhibition stalls, pop-up setups, retail interiors, event backdrops, branded spaces, and experiential activations. We design how the space looks, feels, and communicates your brand.",
    },
    {
      q: "Do you only design, or do you build as well?",
      a: " We handle the design and creative direction. For fabrication and physical build, we work with trusted fabrication partners who bring the design to life. We coordinate between you and the fabrication team throughout the process.",
    },
    {
      q: "What does the design process look like? ",
      a: "We start by understanding the space, the occasion, and what you want people to feel when they walk in. From there we develop a concept including mood references, a spatial layout, material and colour direction, and 3D visualisations. You approve the concept before anything moves to fabrication.",
    },
    {
      q: "Will I get to see what the space will look like before it's built?",
      a: " Yes. We provide concept renders and visualisations that give you a strong sense of the final space. These are directional visuals — they capture the look, feel, and atmosphere — so you can make confident decisions before committing to the build.",
    },
    {
      q: "I have an exhibition stall coming up in 6 weeks. Is that enough time?",
      a: " It depends on the complexity of the design and the fabrication scope. For a standard 3x3 or 3x6 stall, 6 weeks is workable if we begin immediately. Reach out as soon as possible so we can assess the timeline accurately.",
    },
    {
      q: "What information do I need to give you to get started?",
      a: "The dimensions of the space, the event or occasion it's for, your brand guidelines or any existing brand assets, and a rough sense of the budget for both design and fabrication. Photos or a floor plan of the venue help enormously.",
    },
    {
      q: "Can you design a retail store or café interior?",
      a: "Yes. We offer concept design for retail fit-outs and hospitality spaces — covering the spatial layout, material and colour palette, signage, and overall brand environment. These projects are handled with our fabrication and fit-out partners for execution.",
    },
    {
      q: "What's the difference between a pop-up and a permanent installation?",
      a: "A pop-up is a temporary setup — usually for an event, a product launch, or a seasonal activation. A permanent installation is a fixed fit-out like a retail store or office space. Both are services we offer, and the design approach differs based on the duration and purpose of the space.",
    },
  ],
  Fabrication: [
    {
      q: "Do you fabricate in-house?",
      a: " We work with a trusted fabrication partner who handles all physical construction and installation. This means you get reliable, experienced builders coordinated through a single point of contact — us.",
    },
    {
      q: "What materials and finishes can you work with?",
      a: " Our fabrication partner works with a wide range of materials including MDF, plywood, acrylic, aluminium composite panels, steel, laminates, and vinyl. If you have a specific material in mind, share it with us and we'll confirm feasibility.",
    },
    {
      q: "Can I come to you just for fabrication, without the design?",
      a: " Yes. If you already have your design or technical drawings, we can connect you directly with our fabrication partner for execution. Share your files and requirements and we'll take it forward.",
    },
    {
      q: "How do you price fabrication projects?",
      a: " Fabrication is quoted based on the materials, dimensions, complexity, and timeline of the project. Once we have your design brief and space details, we'll provide a clear quote from our fabrication partner.",
    },
    {
      q: "Do you handle installation on-site as well?",
      a: "Yes. Our fabrication partner handles both the build and the on-site installation. We coordinate the logistics so you don't have to manage multiple vendors.",
    },
    {
      q: "What's the typical lead time for fabrication?",
      a: "Lead time depends on project size and complexity. A standard exhibition stall can typically be fabricated in 7–12 working days. Larger or more complex builds require more time. Always share your deadline upfront so we can confirm feasibility.",
    },
    {
      q: "Can you fabricate for events outside Chennai? ",
      a: "Currently our fabrication services are centred around Chennai. For outstation projects, reach out and we'll assess on a case-by-case basis.",
    },
  ],
};

export default function FaqSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const toggleCategory = (category: string) => {
    setActiveCategory((prev) => (prev === category ? null : category));
    setActiveIndex(null);
  };

  const toggleQuestion = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const goingDown = e.deltaY > 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 2;
      const atTop = scrollTop <= 0;

      if ((goingDown && !atBottom) || (!goingDown && !atTop)) {
        e.preventDefault();
        el.scrollBy({ top: e.deltaY, behavior: "auto" });
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [activeCategory]);

  return (
    <section className="w-full min-h-screen overflow-y-auto pt-[30px] bg-[#f2f2f0]">
      {/* HERO IMAGE + OVERLAY */}
      <div className="relative w-full py-10">
        <img src={faqb} alt="FAQ Background" className="w-full object-cover" />
        <div className=" px-8 md:px-16">
          <span className="text-power font-secondary tracking-[0.3em] uppercase text-black block mb-4">
            Got Questions
          </span>
          <h1 className="text-head font-primary tracking-widest uppercase text-black leading-tight mb-4">
            Frequently Asked Questions
          </h1>
          <div className="w-12 h-px bg-black/40" />
        </div>
      </div>

      {/* ── MOBILE / TABLET ─────────────────────────────────────── */}
      <div className="lg:hidden w-full  px-2">
        {!activeCategory && (
          <div className="flex w-full h-[80vh] gap-2 overflow-hidden">
            {Object.keys(faqData).map((category) => (
              <div
                key={category}
                onClick={() => toggleCategory(category)}
                className="flex-1 flex items-center justify-center  border-[1.5px] border-black cursor-pointer hover:bg-black hover:text-white  transition-all duration-500 "
              >
                <span
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                  className="text-subhead font-primary tracking-widest uppercase"
                >
                  {category}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeCategory && (
          <div className="min-h-screen py-20 bg-white/80">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/10">
              {/* <span className="text-power font-secondary tracking-[0.3em] uppercase text-black/40">
                {Object.keys(faqData).indexOf(activeCategory) + 1 < 10
                  ? `0${Object.keys(faqData).indexOf(activeCategory) + 1}`
                  : Object.keys(faqData).indexOf(activeCategory) + 1}{" "}
                /
              </span> */}
              <h1 className="text-subhead font-primary tracking-widest uppercase flex-1 px-4">
                {activeCategory}
              </h1>
              <button
                className="text-subhead font-light leading-none"
                onClick={() => setActiveCategory(null)}
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-0">
              {faqData[activeCategory].map((item, index) => (
                <div
                  key={index}
                  className="border-b border-black/10 text-black/80"
                >
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full text-left px-2 py-5 font-primary text-sectionhead tracking-wide flex justify-between items-center gap-4"
                  >
                    <span>{item.q}</span>
                    <span className="text-[42px] font-light leading-none shrink-0">
                      {activeIndex === index ? "−" : "+"}
                    </span>
                  </button>
                  <div
                    className={`transition-all font-secondary text-body text-black/60 leading-relaxed duration-300 px-2
                      ${activeIndex === index ? "max-h-60 pb-5" : "max-h-0 overflow-hidden"}`}
                  >
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── DESKTOP ──────────────────────────────────────────────── */}
      <div className="hidden lg:flex h-screen w-full justify-between overflow-hidden gap-2 px-2">
        {Object.entries(faqData).map(([category, questions]) => {
          const isActive = category === activeCategory;
          return (
            <div
              onClick={() => toggleCategory(category)}
              key={category}
              className={`relative flex transition-all duration-500 cursor-pointer border-2 border-black
                ${isActive ? "w-[150%]" : "w-1/5"}`}
            >
              {/* COLLAPSED */}
              {!isActive && (
                <div className="text-black text-subhead font-primary hover:bg-black hover:text-white w-full flex items-end justify-center pb-40 transition-colors duration-300">
                  <span
                    style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                    }}
                    className="tracking-widest uppercase"
                  >
                    {category}
                  </span>
                </div>
              )}

              {/* EXPANDED */}
              {isActive && (
                <div className="flex w-full">
                  <div className="w-20 text-black flex items-center justify-center border-r border-white/10">
                    <span className="-rotate-90 tracking-widest uppercase font-primary text-subhead whitespace-nowrap">
                      {category}
                    </span>
                  </div>
                  <div
                    ref={scrollContainerRef}
                    className="flex-1 px-6 py-4 overflow-y-auto no-scrollbar bg-[#181818]"
                  >
                    {questions.map((item, index) => (
                      <div
                        key={index}
                        className="border-b border-white/10 hover:bg-white/5 text-white py-[30px] px-[30px] transition-colors duration-200"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleQuestion(index);
                          }}
                          className="w-full text-left py-3 font-primary tracking-wide flex justify-between items-center gap-4"
                        >
                          <span className="text-sectionhead">{item.q}</span>
                          <span className="text-[56px] font-light leading-none shrink-0 opacity-60">
                            {activeIndex === index ? "−" : "+"}
                          </span>
                        </button>
                        <div
                          className={`transition-all font-secondary text-body text-white/60 leading-relaxed duration-300 px-[20px]
                            ${activeIndex === index ? "max-h-[500px] pb-5" : "max-h-0 overflow-hidden"}`}
                        >
                          {item.a}
                        </div>
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
