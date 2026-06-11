"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function getSessionId(): string {
  let sid = sessionStorage.getItem("_ld_sid");
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("_ld_sid", sid);
  }
  return sid;
}

function beacon(data: object) {
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  navigator.sendBeacon("/api/analytics", blob);
}

async function track(data: object) {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {}
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const startRef = useRef<number>(Date.now());

  // Skip tracking on admin pages
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) return null;

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const sessionId = getSessionId();
    startRef.current = Date.now();

    // Track page view
    track({ event: "pageview", url: pathname, sessionId });

    // Track time on page when leaving
    const sendTime = () => {
      const duration = Math.round((Date.now() - startRef.current) / 1000);
      if (duration < 1) return;
      beacon({ event: "timespent", url: pathname, sessionId, value: duration });
    };

    // Track clicks on interactive elements
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as Element).closest("a, button");
      if (!target) return;
      const label = (target.textContent ?? "").trim().slice(0, 60);
      track({ event: "click", url: pathname, sessionId, meta: label });
    };

    window.addEventListener("beforeunload", sendTime);
    document.addEventListener("click", handleClick);

    return () => {
      sendTime();
      window.removeEventListener("beforeunload", sendTime);
      document.removeEventListener("click", handleClick);
    };
  }, [pathname]);

  return null;
}
