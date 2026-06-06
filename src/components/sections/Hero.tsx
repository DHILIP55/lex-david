import { useEffect, useRef } from "react";
import gsap from "gsap";
import heroimg from "./../../assets/hero.png";
import Navbar from "./../layout/navbar";

const words = ["Designing", "Creativity", "& Experience"];

export default function Hero({ menuOpen, setMenuOpen }: any) {
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const els = wordsRef.current.filter(Boolean) as HTMLSpanElement[];
    if (!els.length) return;

    gsap.fromTo(
      els,
      { y: "110%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.3,
        clearProps: "transform,opacity",
      },
    );
  }, []);

  return (
    <section
      className="relative min-h-screen w-full text-white overflow-hidden"
      style={{
        backgroundImage: `url(${heroimg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/30 z-0" />

      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="relative z-10 flex items-end h-screen pb-14 md:pb-24 lg:pb-32 px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row w-full gap-5 lg:gap-3 justify-center items-center">
          {words.map((word, i) => (
            <div key={i} className="overflow-hidden">
              <span
                ref={(el) => {
                  wordsRef.current[i] = el;
                }}
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
        .hero-word {
          position: relative;
          display: inline-block;
          padding-bottom: 4px;
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .hero-word::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 2.5px;
          background: white;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .hero-word:hover {
          transform: translateY(-2px);
        }
        .hero-word:hover::after {
          transform: scaleX(1);
        }
      `}</style>
    </section>
  );
}
