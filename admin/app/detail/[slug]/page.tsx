"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StickyNavbar from "@/components/site/layout/StickyNavbar";
import Footer from "@/components/site/layout/Footer";
import { fetchApi } from "@/utils/api";

gsap.registerPlugin(ScrollTrigger);

type ProjectImage = { url: string; layout: "full" | "half"; order: number };
type ProjectSection = { subheading: string; description: string };
type ProjectMeta = { title: string; slug: string; description: string; coverImageUrl?: string };
type ProjectDetailData = {
  heading: string;
  subheading: string;
  bodyText: string;
  images: ProjectImage[];
  sections: ProjectSection[];
};

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fixedLabelRef = useRef<HTMLDivElement>(null);

  const [meta, setMeta] = useState<ProjectMeta | null>(null);
  const [detail, setDetail] = useState<ProjectDetailData | null>(null);

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      fetchApi(`/api/projects/${slug}`),
      fetchApi(`/api/projects/${slug}/detail`),
    ]).then(([m, d]) => {
      setMeta(m as ProjectMeta);
      setDetail(d as ProjectDetailData);
    });
  }, [slug]);

  useEffect(() => {
    if (!meta || !detail) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        // Position the fixed label once — outside the clipping container so overflow:clip can't touch it
        gsap.set(fixedLabelRef.current, {
          xPercent: -50,
          yPercent: -50,
          rotation: -90,
          transformOrigin: "center center",
          opacity: 0,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            endTrigger: rightRef.current,
            end: "bottom bottom",
            scrub: 1,
            onUpdate: (self) => {
              // rotation phase = first 1 out of 21 total units
              const done = self.progress > 1 / 21;
              // swap: hide the scrubbing heading, show the fixed label
              gsap.set(headingRef.current, { opacity: done ? 0 : 1 });
              gsap.set(fixedLabelRef.current, { opacity: done ? 1 : 0 });
            },
          },
        });

        tl.to(contentRef.current, { opacity: 0, y: -10, ease: "none", duration: 1 }, 0);
        tl.to(headingRef.current, { rotation: -90, transformOrigin: "left bottom", top: "400px", left: "60px", ease: "none", duration: 1 }, 0);
        tl.to(leftRef.current, { width: "60px", ease: "none", duration: 1 }, 0);
        tl.to(rightRef.current, { width: "calc(100% - 60px)", ease: "none", duration: 1 }, 0);
        tl.to({}, { duration: 20 });

        // Per-image zoom: each image scales as it scrolls through the viewport
        gsap.utils.toArray<HTMLElement>("[data-zoom-img]").forEach((img) => {
          gsap.fromTo(
            img,
            { scale: 1 },
            {
              scale: 1.12,
              ease: "none",
              scrollTrigger: {
                trigger: img,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
              },
            }
          );
        });
      }, containerRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [meta, detail]);

  if (!meta || !detail) {
    return (
      <>
        <StickyNavbar />
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      </>
    );
  }

  const heading = detail.heading || meta.title;
  const bodyText = detail.bodyText || meta.description;
  const galleryImages = [...(detail.images ?? [])].sort((a, b) => a.order - b.order);
  const coverFirst: ProjectImage[] = meta.coverImageUrl
    ? [{ url: meta.coverImageUrl, layout: "full", order: -1 }, ...galleryImages]
    : galleryImages;
  const images = coverFirst;
  const sections: ProjectSection[] = detail.sections ?? [];

  return (
    <>
      <StickyNavbar />

      {/* MOBILE */}
      <section className="block lg:hidden">
        <div className=" px-4 py-6">
          <h1 className="text-head font-primary tracking-widest uppercase leading-tight">
            {heading}
          </h1>
          <p className="text-body font-secondary text-black mt-3 max-w-">
            {bodyText}
          </p>
        </div>

        <div className="px-4 py-4 space-y-4 bg-white">
          {(() => {
            const nodes: ReactNode[] = [];
            let i = 0;
            while (i < images.length) {
              const img = images[i];
              const next = images[i + 1];
              if (img.layout === "half" && next) {
                nodes.push(
                  <div key={i} className="grid grid-cols-2 gap-4">
                    <img src={img.url} className="w-full h-[100%] object-cover rounded-lg" alt="" />
                    <img src={next.url} className="w-full h-[100%] object-cover rounded-lg" alt="" />
                  </div>
                );
                i += 2;
              } else {
                nodes.push(
                  <img key={i} src={img.url} className="w-full h-[100%] object-cover rounded-lg" alt="" />
                );
                i++;
              }
            }
            return nodes;
          })()}

          {sections.map((section, index) => (
            <div key={index} className="pt-6">
              <h2 className="text-sectionhead font-primary uppercase tracking-widest mb-2">
                {section.subheading}
              </h2>
              <p className="text-body font-secondary text-black/70">
                {section.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* DESKTOP */}
      <section
        ref={containerRef}
        className="hidden lg:flex"
        style={{
          width: "100%",
          alignItems: "flex-start",
          position: "relative",
          background: "#fff",
          overflow: "clip",
        }}
      >
        {/* LEFT */}
        <div
          ref={leftRef}
          style={{
            width: "50%",
            flexShrink: 0,
            position: "sticky",
            top: "100px",
            alignSelf: "flex-start",
          }}
        >
          {/* invisible placeholder — same text/margin as heading so it reserves exact height */}
          <div
            className="text-head font-primary tracking-widest uppercase leading-tight"
            aria-hidden="true"
            style={{
              visibility: "hidden",
              margin: 21,
              width: "calc(100% - 80px)",
            }}
          >
            {heading}
          </div>

          {/* absolutely positioned heading for GSAP rotation animation */}
          <h1
            className="text-[50px] font-semibold font-primary tracking-widest uppercase leading-tight"
            ref={headingRef}
            style={{
              position: "absolute",
              top: "0px",
              left: "50px",
              margin: 21,
              width: "calc(100% - 80px)",
              transformOrigin: "left top",
              zIndex: 10,
              color: "#111",
            }}
          >
            {heading}
          </h1>

          <div
            ref={contentRef}
            style={{
              paddingLeft: "40px",
              paddingTop: "16px",
              maxWidth: "80%",
            }}
          >
            <p className=" text-body font-secondary ">
              {bodyText}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div
          ref={rightRef}
          style={{
            width: "50%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "16px",
            marginLeft: "auto",
          }}
        >
          {(() => {
            const nodes: ReactNode[] = [];
            let i = 0;
            while (i < images.length) {
              const img = images[i];
              const next = images[i + 1];
              if (img.layout === "half" && next) {
                nodes.push(
                  <div key={i} style={{ display: "flex", gap: "16px" }}>
                    <div style={{ width: "50%", overflow: "hidden" }}>
                      <img data-zoom-img src={img.url} style={{ width: "100%", height: "100vh", objectFit: "cover", display: "block" }} alt="" />
                    </div>
                    <div style={{ width: "50%", overflow: "hidden" }}>
                      <img data-zoom-img src={next.url} style={{ width: "100%", height: "100vh", objectFit: "cover", display: "block" }} alt="" />
                    </div>
                  </div>
                );
                i += 2;
              } else {
                nodes.push(
                  <div key={i} style={{ overflow: "hidden" }}>
                    <img
                      data-zoom-img
                      src={img.url}
                      style={{ width: "100%", height: "100vh", objectFit: "cover", display: "block" }}
                      alt=""
                    />
                  </div>
                );
                i++;
              }
            }
            return nodes;
          })()}

        {sections.map((section, index) => (
          <div key={index} className="pt-6">
            <h2 className="text-sectionhead font-primary uppercase tracking-widest mb-2">{section.subheading}</h2>
            <p className="text-body font-secondary text-black/70">{section.description}</p>
          </div>
        ))}

                 </div>
                 
      </section>

      {/* Fixed vertical label — lives outside overflow:clip section, desktop only */}
      <div
        ref={fixedLabelRef}
        className="hidden lg:block"
        style={{
          position: "fixed",
          left: "30px",
          top: "50%",
          zIndex: 0,
          pointerEvents: "none",
          whiteSpace: "nowrap",
          color: "#111",
          opacity: 0,
        }}
      >
        <span className="text-head font-primary tracking-widest uppercase leading-tight">
          {heading.split(" ").length > 2
    ? `${heading.split(" ").slice(0, 2).join(" ")}...`
    : heading}
        </span>
      </div>
<div className="z-20">
      <Footer  />
      </div>
    </>
  );
}
