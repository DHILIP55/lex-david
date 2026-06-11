"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchApi } from "@/utils/api";

type NavItem = { order: number; prefixLabel: string; label: string; type: "link" | "scroll"; target: string };
type FooterLink = { label: string; order: number };
type NavData = { logoUrl: string; items: NavItem[]; mobileFooterLinks: FooterLink[] };

export default function Navbar({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (v: boolean) => void }) {
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
    setMenuOpen(false);
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
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const renderDesktopItem = (item: NavItem) => {
    const inner = (
      <div className="flex items-baseline gap-4">
        {item.prefixLabel && <span className="text-power font-secondary opacity-80">{item.prefixLabel}</span>}
        <h1 className="text-navbar uppercase font-primary tracking-widest transition-transform duration-300 group-hover:translate-x-3">{item.label}</h1>
      </div>
    );
    if (item.type === "link" && item.target !== "/") return <Link key={item.order} href={item.target} className="group flex flex-row gap-4">{inner}</Link>;
    return <button key={item.order} onClick={() => scrollToSection(item.target)} className="group flex flex-row gap-4">{inner}</button>;
  };

  const renderMobileItem = (item: NavItem) => {
    const cls = "text-3xl font-primary py-5 border-b uppercase tracking-[0.1em]";
    if (item.type === "link" && item.target !== "/") return <Link key={item.order} href={item.target} onClick={() => setMenuOpen(false)} className={cls}>{item.label}</Link>;
    return <button key={item.order} className={cls} onClick={() => scrollToSection(item.target)}>{item.label}</button>;
  };

  const logoContent = navData.logoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={navData.logoUrl} className="w-[40px] h-[30px] xl:w-[130px] xl:h-[70px] lg:w-[80px] lg:h-[50px] object-contain" alt="Logo" />
  ) : (
    <span className="uppercase tracking-widest font-primary text-white text-sm lg:text-base xl:text-lg">Lex &amp; David</span>
  );

  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-4 py-6 text-white">
      <div className="w-full mx-auto flex justify-between items-center">
        <a href="/#hero" onClick={handleLogoClick} className="text-navbar font-primary tracking-widest">
          {logoContent}
        </a>

        <button className="lg:hidden text-white font-bold" onClick={() => setMenuOpen(true)}>☰</button>

        <div className="hidden lg:flex whitespace-nowrap items-center justify-center w-full lg:pl-7 lg:gap-[20px] xl:gap-[50px]">
          {navData.items.map(renderDesktopItem)}
        </div>
      </div>

      {menuOpen && (
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
            <button className="font-semibold" onClick={() => setMenuOpen(false)}>✕</button>
          </div>
          <div className="mt-10 text-center flex flex-col">{navData.items.map(renderMobileItem)}</div>
          {navData.mobileFooterLinks.length > 0 && (
            <div className="mt-auto text-center text-sm space-y-2">
              {navData.mobileFooterLinks.map((link, i) => <p key={i}>{link.label}</p>)}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
