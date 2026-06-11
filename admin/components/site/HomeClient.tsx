"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Hero from "@/components/site/sections/Hero";
import Community from "@/components/site/sections/Community";
import StickyNavbar from "@/components/site/layout/StickyNavbar";
import OurService from "@/components/site/sections/OurService";
import FaqSection from "@/components/site/sections/FaqSection";
import SocialSection from "@/components/site/sections/SocialSection";
import Footer from "@/components/site/layout/Footer";

function EnquireModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setTimeout(onClose, 2500);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={status === "sending" ? undefined : onClose}>
      <div className="relative w-full max-w-xl bg-[#f4f4f2] text-black" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-black/10">
          <h2 className="text-sectionhead font-primary uppercase tracking-widest">Enquire</h2>
          <button onClick={onClose} disabled={status === "sending"} className="text-sectionhead font-light leading-none hover:opacity-50 transition-opacity disabled:opacity-30">✕</button>
        </div>

        {status === "sent" ? (
          <div className="px-8 py-12 flex flex-col items-center gap-4 text-center">
            <div className="text-3xl">✓</div>
            <p className="font-primary uppercase tracking-widest text-sm">Message sent!</p>
            <p className="font-secondary text-black/50 text-sm">We will get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-8 py-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-power font-secondary uppercase tracking-widest text-black/50">Email</label>
              <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="your@email.com" className="bg-transparent border-b border-black/30 py-2 text-body font-secondary placeholder:text-black/25 outline-none focus:border-black transition-colors" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-power font-secondary uppercase tracking-widest text-black/50">Subject</label>
              <input type="text" name="subject" required value={form.subject} onChange={handleChange} placeholder="What's this about?" className="bg-transparent border-b border-black/30 py-2 text-body font-secondary placeholder:text-black/25 outline-none focus:border-black transition-colors" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-power font-secondary uppercase tracking-widest text-black/50">Message</label>
              <textarea name="message" required rows={4} value={form.message} onChange={handleChange} placeholder="Tell us about your project..." className="bg-transparent border-b border-black/30 py-2 text-body font-secondary placeholder:text-black/25 outline-none focus:border-black transition-colors resize-none" />
            </div>
            {status === "error" && (
              <p className="text-red-500 text-sm font-secondary">Failed to send. Please try again.</p>
            )}
            <button type="submit" disabled={status === "sending"} className="mt-2 w-full bg-black text-white font-mono uppercase tracking-widest text-power py-4 hover:bg-white hover:text-black border border-black transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
              {status === "sending" ? "Sending..." : "Send Enquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function EnquireTab({ onOpen }: { onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="fixed z-[100] top-1/2 -translate-y-1/2 right-0 bg-black text-white font-mono uppercase tracking-[0.18em] text-[10px] md:text-body md:px-3 px-2 md:py-5 py-3 hover:bg-white hover:text-black transition-colors duration-300" style={{ writingMode: "vertical-rl" }}>
      Enquire
    </button>
  );
}

export default function HomeClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [enquireOpen, setEnquireOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const scrollTo = searchParams.get("scrollTo");
    if (!scrollTo) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(scrollTo);
      if (el) {
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
      }
      // clear param after scroll starts so re-render doesn't interfere
      setTimeout(() => router.replace("/", { scroll: false }), 200);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchParams, router]);

  return (
    <div>
      <section id="hero"><Hero menuOpen={menuOpen} setMenuOpen={setMenuOpen} /></section>
      {!menuOpen && <StickyNavbar />}
      <section id="community"><Community /></section>
      <section id="ourservice"><OurService /></section>
      <section id="faq"><FaqSection /></section>
      <section id="social"><SocialSection /></section>
      <Footer />
      <EnquireTab onOpen={() => setEnquireOpen(true)} />
      {enquireOpen && <EnquireModal onClose={() => setEnquireOpen(false)} />}
    </div>
  );
}
