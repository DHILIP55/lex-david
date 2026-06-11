"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearToken } from "../lib/api";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/community", label: "Community / About" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/social", label: "Social & Contact" },
  { href: "/admin/projects", label: "Projects & Work" },
  { href: "/admin/navigation", label: "Navigation" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearToken();
    router.replace("/admin/login");
  };

  return (
    <aside className="w-60 shrink-0 bg-zinc-950 border-r border-white/10 flex flex-col h-screen sticky top-0">
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-white font-semibold tracking-widest uppercase text-sm">Lex &amp; David</span>
        <p className="text-white/40 text-xs mt-0.5">Admin CMS</p>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full text-left px-2 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
