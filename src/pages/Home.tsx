import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/sections/Hero";
import Community from "../components/sections/community";
import StickyNavbar from "../components/layout/StickyNavbar";
import OurService from "../components/sections/OurService";
import FaqSection from "../components/sections/Faqsection";
import SocialSection from "../components/sections/SocialSection";

/* ─── ENQUIRE MODAL ──────────────────────────────────────────────── */
function EnquireModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ email: "", subject: "", message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up to your email / API endpoint
    console.log("Enquiry submitted:", form);
    onClose();
  };

  return (
    /* BACKDROP */
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      {/* PANEL — stop click propagating to backdrop */}
      <div
        className="relative w-full max-w-xl bg-[#f4f4f2] text-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP BAR */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-black/10">
          <h2 className="text-sectionhead font-primary uppercase tracking-widest">
            Enquire
          </h2>
          <button
            onClick={onClose}
            className="text-sectionhead font-light leading-none hover:opacity-50 transition-opacity"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="px-8 py-8 flex flex-col gap-6">
          {/* EMAIL */}
          <div className="flex flex-col gap-2">
            <label className="text-power font-secondary uppercase tracking-widest text-black/50">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="bg-transparent border-b border-black/30 py-2 text-body font-secondary
                placeholder:text-black/25 outline-none focus:border-black transition-colors"
            />
          </div>

          {/* SUBJECT */}
          <div className="flex flex-col gap-2">
            <label className="text-power font-secondary uppercase tracking-widest text-black/50">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              required
              value={form.subject}
              onChange={handleChange}
              placeholder="What's this about?"
              className="bg-transparent border-b border-black/30 py-2 text-body font-secondary
                placeholder:text-black/25 outline-none focus:border-black transition-colors"
            />
          </div>

          {/* MESSAGE */}
          <div className="flex flex-col gap-2">
            <label className="text-power font-secondary uppercase tracking-widest text-black/50">
              Message
            </label>
            <textarea
              name="message"
              required
              rows={4}
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us about your project..."
              className="bg-transparent border-b border-black/30 py-2 text-body font-secondary
                placeholder:text-black/25 outline-none focus:border-black transition-colors resize-none"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="mt-2 w-full bg-black text-white font-mono uppercase tracking-widest
              text-power py-4 hover:bg-white hover:text-black border border-black transition-colors duration-300"
          >
            Send Enquiry
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── ENQUIRE TAB ────────────────────────────────────────────────── */
function EnquireTab({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="fixed z-[100] top-1/2 -translate-y-1/2 right-0
        bg-black text-white font-mono uppercase tracking-[0.18em] text-[10px]
        md:text-body md:px-3 px-2 md:py-5 py-3
        hover:bg-white hover:text-black transition-colors duration-300"
      style={{ writingMode: "vertical-rl" }}
    >
      Enquire
    </button>
  );
}

/* ─── HOME PAGE ──────────────────────────────────────────────────── */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [enquireOpen, setEnquireOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const scrollTo = (location.state as any)?.scrollTo;
    if (!scrollTo) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(scrollTo);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [location.state]);

  return (
    <div>
      <section id="hero">
        <Hero menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </section>

      {!menuOpen && <StickyNavbar />}

      <section id="community">
        <Community />
      </section>
      <section id="ourservice">
        <OurService />
      </section>
      <section id="faqsection">
        <FaqSection />
      </section>
      <section id="social">
        <SocialSection />
      </section>

      <EnquireTab onOpen={() => setEnquireOpen(true)} />
      {enquireOpen && <EnquireModal onClose={() => setEnquireOpen(false)} />}
    </div>
  );
}
