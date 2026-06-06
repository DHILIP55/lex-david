// import React, { useEffect, useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// const ScrollExpandSection: React.FC = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const leftRef = useRef<HTMLDivElement>(null);
//   const rightRef = useRef<HTMLDivElement>(null);
//   const headingRef = useRef<HTMLHeadingElement>(null);
//   const contentRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {

//       // NO GSAP pin at all — left panel uses CSS sticky natively.
//       // This means zero pin-spacer wrapper div ever gets created.
//       // GSAP only handles the animations.

//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: containerRef.current,
//           start: "top top",
//           endTrigger: rightRef.current,
//           end: "bottom bottom",
//           scrub: 1,
//           // pin: REMOVED — CSS sticky handles this instead
//         },
//       });

//       // Phase 1 — all animate together over duration 1
//       tl.to(contentRef.current, {
//         opacity: 0,
//         y: -10,
//         ease: "none",
//         duration: 1,
//       }, 0);

//       tl.to(headingRef.current, {
//         rotation: -90,
//         transformOrigin: "left bottom",
//         ease: "none",
//         duration: 1,
//       }, 0);

//       tl.to(leftRef.current, {
//         width: "60px",
//         ease: "none",
//         duration: 1,
//       }, 0);

//       tl.to(rightRef.current, {
//         width: "calc(100% - 60px)",
//         ease: "none",
//         duration: 1,
//       }, 0);

//       // Phase 2 — hold for remainder of scroll
//       tl.to({}, { duration: 20 });

//     }, containerRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <section
//       ref={containerRef}
//       style={{
//         width: "100%",
//         display: "flex",
//         alignItems: "flex-start",  // critical for sticky to work in flex
//         position: "relative",
//         background: "#fff",

//       }}
//     >
//       {/* LEFT — sticky via CSS, no GSAP pin, no pin-spacer ever created */}
//       <div
//         ref={leftRef}
//         style={{
//           width: "50%",
//           height: "100%",
//           flexShrink: 0,
//           background: "#08f34e",
//            position: "sticky",
//            top: "200px",
//           inset:15
//         }}
//       >
//         <h1
//           ref={headingRef}
//           style={{
//             position: "absolute",
//             top: "200px",
//             left: "40px",
//             margin: 0,
//             fontSize: "clamp(2.5rem, 5vw, 4rem)",
//             fontWeight: 900,
//             letterSpacing: "-0.03em",
//             lineHeight: 1,
//             transformOrigin: "left top",
//             whiteSpace: "nowrap",
//             zIndex: 10,
//             color: "#111",
//           }}
//         >
//           PROJECT
//         </h1>

//         <div
//           ref={contentRef}
//           style={{
//             position: "absolute",
//             top: "200px",
//             left: "40px",
//             paddingTop: "calc(clamp(2.5rem, 5vw, 4rem) + 16px)",
//             maxWidth: "380px",
//           }}
//         >
//           <p
//             style={{
//               color: "#666",
//               fontSize: "1rem",
//               lineHeight: 1.7,
//               marginTop: "1rem",
//             }}
//           >
//             This is a creative project showcasing branding and design.
//             Scroll to see the transformation.
//           </p>
//         </div>
//       </div>

//       {/* RIGHT — natural scroll height drives the sticky behavior above */}
//       <div
//         ref={rightRef}
//         style={{
//           width: "50%",
//           flexShrink: 0,
//           display: "flex",
//           flexDirection: "column",
//           gap: "16px",
//           padding: "16px",
//             marginLeft :"auto"

//         }}
//       >
//         <img
//           src="https://picsum.photos/800/400?random=1"
//           style={{ width: "100%", height: "300px", objectFit: "cover", display: "block" }}
//           alt=""
//         />

//         <div style={{ display: "flex", gap: "16px" }}>
//           <img
//             src="https://picsum.photos/400/300?random=2"
//             style={{ width: "50%", height: "200px", objectFit: "cover", display: "block" }}
//             alt=""
//           />
//           <img
//             src="https://picsum.photos/400/300?random=3"
//             style={{ width: "50%", height: "200px", objectFit: "cover", display: "block" }}
//             alt=""
//           />
//         </div>

//         <img
//           src="https://picsum.photos/800/500?random=4"
//           style={{ width: "100%", height: "300px", objectFit: "cover", display: "block" }}
//           alt=""
//         />

//         <img
//           src="https://picsum.photos/800/400?random=5"
//           style={{ width: "100%", height: "300px", objectFit: "cover", display: "block" }}
//           alt=""
//         />

//         <div style={{ display: "flex", gap: "16px" }}>
//           <img
//             src="https://picsum.photos/400/300?random=6"
//             style={{ width: "50%", height: "200px", objectFit: "cover", display: "block" }}
//             alt=""
//           />
//           <img
//             src="https://picsum.photos/400/300?random=7"
//             style={{ width: "50%", height: "200px", objectFit: "cover", display: "block" }}
//             alt=""
//           />
//         </div>

//         <img
//           src="https://picsum.photos/800/500?random=8"
//           style={{ width: "100%", height: "300px", objectFit: "cover", display: "block" }}
//           alt=""
//         />

//         <img
//           src="https://picsum.photos/800/400?random=9"
//           style={{ width: "100%", height: "300px", objectFit: "cover", display: "block" }}
//           alt=""
//         />

//         <div style={{ display: "flex", gap: "16px" }}>
//           <img
//             src="https://picsum.photos/400/300?random=10"
//             style={{ width: "50%", height: "200px", objectFit: "cover", display: "block" }}
//             alt=""
//           />
//           <img
//             src="https://picsum.photos/400/300?random=11"
//             style={{ width: "50%", height: "200px", objectFit: "cover", display: "block" }}
//             alt=""
//           />
//         </div>

//         <img
//           src="https://picsum.photos/800/500?random=12"
//           style={{ width: "100%", height: "300px", objectFit: "cover", display: "block" }}
//           alt=""
//         />
//       </div>
//     </section>
//   );
// };

// export default ScrollExpandSection;

// import React, { useEffect, useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// const ScrollExpandSection: React.FC = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const leftRef = useRef<HTMLDivElement>(null);
//   const rightRef = useRef<HTMLDivElement>(null);
//   const headingRef = useRef<HTMLHeadingElement>(null);
//   const contentRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const mm = gsap.matchMedia();

//     // ✅ ONLY DESKTOP
//     mm.add("(min-width: 1024px)", () => {
//       const ctx = gsap.context(() => {
//         const tl = gsap.timeline({
//           scrollTrigger: {
//             trigger: containerRef.current,
//             start: "top top",
//             endTrigger: rightRef.current,
//             end: "bottom bottom",
//             scrub: 1,
//           },
//         });

//         tl.to(contentRef.current, {
//           opacity: 0,
//           y: -10,
//           ease: "none",
//           duration: 1,
//         }, 0);

//         tl.to(headingRef.current, {
//           rotation: -90,
//           transformOrigin: "left bottom",
//           ease: "none",
//           duration: 1,
//         }, 0);

//         tl.to(leftRef.current, {
//           width: "60px",
//           ease: "none",
//           duration: 1,
//         }, 0);

//         tl.to(rightRef.current, {
//           width: "calc(100% - 60px)",
//           ease: "none",
//           duration: 1,
//         }, 0);

//         tl.to({}, { duration: 20 });
//       }, containerRef);

//       return () => ctx.revert();
//     });

//     return () => mm.revert();
//   }, []);

//   return (
//     <>
//       {/* ================= MOBILE + TABLET ================= */}
//       <section className="hidden bg-black text-white px-4 py-6 space-y-6">

//         {/* HEADER */}
//         <div className="flex items-center justify-between">
//           <h1 className="text-lg font-bold">wwc</h1>
//           <div className="w-8 h-8 border rounded-full flex items-center justify-center">
//             ☰
//           </div>
//         </div>

//         {/* TITLE */}
//         <p className="text-sm text-yellow-400 font-medium">
//           Exhibition Stall Design
//         </p>

//         {/* DESCRIPTION */}
//         <p className="text-sm leading-relaxed text-gray-300">
//           academic and healthcare ecosystem while being visually adaptable
//           across diverse touchpoints, from hospital signage and research
//           journals to digital platforms and philanthropic initiatives.
//           In essence, it was about shaping a healthcare brand identity
//           that could stand for both excellence and empathy
//         </p>

//         {/* IMAGE GRID */}
//         <div className="space-y-4">

//           <img
//             src="https://picsum.photos/800/400?random=1"
//             className="w-full h-[200px] object-cover rounded-xl"
//           />

//           <div className="grid grid-cols-2 gap-4">
//             <img
//               src="https://picsum.photos/400/300?random=2"
//               className="w-full h-[120px] object-cover rounded-xl"
//             />
//             <img
//               src="https://picsum.photos/400/300?random=3"
//               className="w-full h-[120px] object-cover rounded-xl"
//             />
//           </div>

//           <img
//             src="https://picsum.photos/800/400?random=4"
//             className="w-full h-[200px] object-cover rounded-xl"
//           />

//         </div>
//       </section>

//       {/* ================= DESKTOP (YOUR ORIGINAL) ================= */}
//       <section
//         ref={containerRef}
//         className="hidden lg:flex"
//         style={{
//           width: "100%",
//           display: "flex",
//           alignItems: "flex-start",
//           position: "relative",
//           background: "#fff",
//         }}
//       >
//         {/* LEFT */}
//         <div
//           ref={leftRef}
//           style={{
//             width: "50%",
//             height: "100%",
//             flexShrink: 0,
//             background: "#08f34e",
//             position: "sticky",
//             top: "200px",
//             inset: 15,
//           }}
//         >
//           <h1
//             ref={headingRef}
//             style={{
//               position: "absolute",
//               top: "200px",
//               left: "40px",
//               margin: 0,
//               fontSize: "clamp(2.5rem, 5vw, 4rem)",
//               fontWeight: 900,
//               letterSpacing: "-0.03em",
//               lineHeight: 1,
//               transformOrigin: "left top",
//               whiteSpace: "nowrap",
//               zIndex: 10,
//               color: "#111",
//             }}
//           >
//             PROJECT
//           </h1>

//           <div
//             ref={contentRef}
//             style={{
//               position: "absolute",
//               top: "200px",
//               left: "40px",
//               paddingTop: "calc(clamp(2.5rem, 5vw, 4rem) + 16px)",
//               maxWidth: "380px",
//             }}
//           >
//             <p
//               style={{
//                 color: "#666",
//                 fontSize: "1rem",
//                 lineHeight: 1.7,
//                 marginTop: "1rem",
//               }}
//             >
//               This is a creative project showcasing branding and design.
//               Scroll to see the transformation.
//             </p>
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div
//           ref={rightRef}
//           style={{
//             width: "50%",
//             flexShrink: 0,
//             display: "flex",
//             flexDirection: "column",
//             gap: "16px",
//             padding: "16px",
//             marginLeft: "auto",
//           }}
//         >
//           <img src="https://picsum.photos/800/400?random=1" style={{ width: "100%", height: "300px", objectFit: "cover" }} />

//           <div style={{ display: "flex", gap: "16px" }}>
//             <img src="https://picsum.photos/400/300?random=2" style={{ width: "50%", height: "200px", objectFit: "cover" }} />
//             <img src="https://picsum.photos/400/300?random=3" style={{ width: "50%", height: "200px", objectFit: "cover" }} />
//           </div>

//            <img src="https://picsum.photos/800/400?random=1" style={{ width: "100%", height: "300px", objectFit: "cover" }} />
//             <img src="https://picsum.photos/800/400?random=1" style={{ width: "100%", height: "300px", objectFit: "cover" }} />
//              <img src="https://picsum.photos/800/400?random=1" style={{ width: "100%", height: "300px", objectFit: "cover" }} />
//               <img src="https://picsum.photos/800/400?random=1" style={{ width: "100%", height: "300px", objectFit: "cover" }} />
//                <img src="https://picsum.photos/800/400?random=1" style={{ width: "100%", height: "300px", objectFit: "cover" }} />
//         </div>
//       </section>
//     </>
//   );
// };

// export default ScrollExpandSection;

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StickyNavbar from "./../components/layout/StickyNavbar";

gsap.registerPlugin(ScrollTrigger);

const ScrollExpandSection: React.FC = ({}: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // ✅ DESKTOP ONLY
    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            endTrigger: rightRef.current,
            end: "bottom bottom",
            scrub: 1,
          },
        });

        tl.to(
          contentRef.current,
          {
            opacity: 0,
            y: -10,
            ease: "none",
            duration: 1,
          },
          0,
        );

        tl.to(
          headingRef.current,
          {
            rotation: -90,
            transformOrigin: "left bottom",
            top: "400px",
            left: "60px",
            ease: "none",
            duration: 1,
          },
          0,
        );

        tl.to(
          leftRef.current,
          {
            width: "60px",
            ease: "none",
            duration: 1,
          },
          0,
        );

        tl.to(
          rightRef.current,
          {
            width: "calc(100% - 60px)",
            ease: "none",
            duration: 1,
          },
          0,
        );

        // extra scroll space
        tl.to({}, { duration: 20 });
      }, containerRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      <StickyNavbar />
      {/* ================= MOBILE + TABLET ================= */}
      <section className="block lg:hidden">
        {/* GREEN HEADER */}
        <div className=" px-4 py-6">
          <h1 className="text-head font-primary tracking-widest uppercase leading-tight">
            PROJECT
          </h1>

          <p className="text-body font-secondary text-black mt-3 max-w-md">
            This is a creative project showcasing branding and design. Scroll to
            see the transformation.
          </p>
        </div>

        {/* IMAGE CONTENT */}
        <div className="px-4 py-4 space-y-4 bg-white">
          <img
            src="https://picsum.photos/800/400?random=1"
            className="w-full h-[220px] object-cover rounded-lg"
          />

          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://picsum.photos/400/300?random=2"
              className="w-full h-[140px] object-cover rounded-lg"
            />
            <img
              src="https://picsum.photos/400/300?random=3"
              className="w-full h-[140px] object-cover rounded-lg"
            />
          </div>

          <img
            src="https://picsum.photos/800/400?random=4"
            className="w-full h-[220px] object-cover rounded-lg"
          />

          <img
            src="https://picsum.photos/800/400?random=5"
            className="w-full h-[220px] object-cover rounded-lg"
          />
        </div>
      </section>

      {/* ================= DESKTOP ================= */}
      <section
        ref={containerRef}
        className="hidden lg:flex"
        style={{
          width: "100%",
          alignItems: "flex-start",
          position: "relative",
          background: "#fff",
        }}
      >
        {/* LEFT */}
        <div
          ref={leftRef}
          style={{
            width: "50%",
            height: "100%",
            flexShrink: 0,
            position: "sticky",
            top: "200px",
            inset: 15,
          }}
        >
          <h1
            className="text-head font-primary tracking-widest uppercase leading-tight"
            ref={headingRef}
            style={{
              position: "absolute",
              top: "200px",
              left: "40px",
              margin: 0,
              transformOrigin: "left top",
              whiteSpace: "nowrap",
              zIndex: 10,
              color: "#111",
            }}
          >
            PROJECT
          </h1>

          <div
            ref={contentRef}
            style={{
              position: "absolute",
              top: "200px",
              left: "40px",
              paddingTop: "calc(clamp(2.5rem, 5vw, 4rem) + 16px)",
              maxWidth: "80%",
            }}
          >
            <p className=" text-body font-secondary pt-4">
              This is a creative project showcasing branding and design. Scroll
              to see the transformation.
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
          <img
            src="https://picsum.photos/800/400?random=1"
            style={{ width: "100%", height: "800px", objectFit: "cover" }}
          />

          <div style={{ display: "flex", gap: "16px" }}>
            <img
              src="https://picsum.photos/400/300?random=2"
              style={{ width: "50%", height: "400px", objectFit: "cover" }}
            />
            <img
              src="https://picsum.photos/400/300?random=3"
              style={{ width: "50%", height: "400px", objectFit: "cover" }}
            />
          </div>

          {[4, 5, 6, 7, 8].map((i) => (
            <img
              key={i}
              src={`https://picsum.photos/800/400?random=${i}`}
              style={{ width: "100%", height: "500px", objectFit: "cover" }}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default ScrollExpandSection;
