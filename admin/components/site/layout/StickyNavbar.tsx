"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchApi } from "@/utils/api";

type NavItem = { order: number; prefixLabel: string; label: string; type: "link" | "scroll"; target: string };
type FooterLink = { label: string; order: number };
type NavData = { logoUrl: string; items: NavItem[]; mobileFooterLinks: FooterLink[] };

export default function StickyNavbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [navData, setNavData] = useState<NavData>({ logoUrl: "", items: [], mobileFooterLinks: [] });

  useEffect(() => {
    fetchApi("/api/nav")
      .then((d) => {
        const data = d as NavData;
        setNavData({
          logoUrl: data.logoUrl ?? "",
          items: (data.items ?? []).sort((a, b) => a.order - b.order),
          mobileFooterLinks: (data.mobileFooterLinks ?? []).sort((a, b) => a.order - b.order),
        });
      })
      .catch(() => {});
  }, []);

  const scrollToSection = (id: string) => {
    const normalizedId = (id === "/" || id === "home" || id === "") ? "hero" : id;
    setOpen(false);
    if (pathname !== "/") {
      router.push(`/?scrollTo=${normalizedId}`);
      return;
    }
    setTimeout(() => {
      const el = document.getElementById(normalizedId);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    }, 300);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection("hero");
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const renderDesktopItem = (item: NavItem) => {
    const inner = (
      <div className="flex items-center gap-4">
        {item.prefixLabel && <span className="text-power pt-2 font-secondary opacity-90">{item.prefixLabel}</span>}
        <h1 className="text-navbar uppercase font-primary tracking-widest transition-transform duration-300 group-hover:translate-x-3">{item.label}</h1>
      </div>
    );
    if (item.type === "link" && item.target !== "/") return <Link key={item.order} href={item.target} className="group flex flex-row gap-4">{inner}</Link>;
    return <button key={item.order} onClick={() => scrollToSection(item.target)} className="group flex flex-row gap-4">{inner}</button>;
  };

  const renderMobileItem = (item: NavItem) => {
    const cls = "text-3xl font-primary py-5 border-b uppercase text-center tracking-[0.1em]";
    if (item.type === "link" && item.target !== "/") return <Link key={item.order} href={item.target} onClick={() => setOpen(false)} className={cls}>{item.label}</Link>;
    return <button key={item.order} className={cls} onClick={() => scrollToSection(item.target)}>{item.label}</button>;
  };

  return (
    <div className="sticky top-0 z-50 w-full">
      <nav className="flex items-center justify-between px-4 py-3 xl:pt-6 bg-white/85 backdrop-blur-md">
        <div className=" mx-auto w-full flex items-center justify-between">
          <a onClick={handleLogoClick} href="/#hero" className="shrink-0 text-navbar font-primary tracking-widest text-black">
            {navData.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={navData.logoUrl} className="w-[40px] h-[30px] xl:w-[130px] xl:h-[70px] lg:w-[100px] lg:h-[50px] object-contain" alt="Logo" />
            ) : (
              <span className="uppercase tracking-widest font-primary text-black text-sm lg:text-base xl:text-lg">Lex &amp; David</span>
            )}
          </a>
          <div className="hidden lg:flex items-center justify-center w-full lg:pl-7 lg:gap-[10px] xl:gap-[40px]">
            {navData.items.map(renderDesktopItem)}
          </div>
          <button className="lg:hidden text-black text-xl" onClick={() => setOpen(true)}>☰</button>
        </div>
      </nav>
      <div className="relative w-full h-[30px] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-transparent" />
      </div>

      {open && (
        <div className="fixed inset-0 z-[999] bg-[#f4f4f2] text-black flex flex-col px-6 py-6">
          <div className="flex justify-between items-center">
            <button onClick={() => scrollToSection("hero")} className="text-navbar font-primary text-black">
              {navData.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={navData.logoUrl} className="w-[40px] h-[30px] object-contain" alt="Logo" />
              ) : (
                <span className="uppercase tracking-widest font-primary text-black text-sm">Lex &amp; David</span>
              )}
            </button>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="mt-10 flex pt-10 flex-col">{navData.items.map(renderMobileItem)}</div>
          {navData.mobileFooterLinks.length > 0 && (
            <div className="mt-auto text-center text-sm space-y-2">
              {navData.mobileFooterLinks.map((link, i) => <p key={i}>{link.label}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
