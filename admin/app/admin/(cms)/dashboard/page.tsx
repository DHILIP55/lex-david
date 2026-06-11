"use client";

import React, { useEffect, useState } from "react";
import type { ApexOptions } from "apexcharts";
import Link from "next/link";
import { api } from "@/app/lib/api";

const sections = [
  { href: "/admin/hero", label: "Hero", desc: "Edit hero words and background image" },
  { href: "/admin/community", label: "Community / About", desc: "Edit about text and 3 cards" },
  { href: "/admin/services", label: "Services", desc: "Manage services accordion" },
  { href: "/admin/faq", label: "FAQ", desc: "Manage FAQ categories and Q&A" },
  { href: "/admin/social", label: "Social & Contact", desc: "Edit contact info" },
  { href: "/admin/projects", label: "Projects & Work", desc: "Manage portfolio projects" },
  { href: "/admin/navigation", label: "Navigation", desc: "Edit nav links and mobile menu footer" },
];

type Period = "daily" | "weekly" | "monthly" | "yearly";
type ChartRow = { label: string; views: number; visitors: number; clicks: number; avgTime: number };
type Stats = { visitors: number; pageviews: number; avgTime: number; clicks: number; chart: ChartRow[] };

const PERIODS: { key: Period; label: string }[] = [
  { key: "daily", label: "Today" },
  { key: "weekly", label: "Week" },
  { key: "yearly", label: "Year" },
];

const BAR_SERIES = [
  { key: "visitors" as const, color: "#f97316", label: "Visitors" },
  { key: "views" as const, color: "#3b82f6", label: "Page Views" },
  { key: "clicks" as const, color: "#a1a1aa", label: "Clicks" },
];

function fmtTime(s: number) {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60); const r = s % 60;
  return r > 0 ? `${m}m ${r}s` : `${m}m`;
}

function fmtLabel(raw: string, period: Period) {
  if (period === "daily") {
    const h = parseInt(raw, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12} ${ampm}`;
  }
  if (period === "yearly") {
    const [y, m] = raw.split("-");
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${months[parseInt(m) - 1]} ${y.slice(2)}`;
  }
  const [, m, d] = raw.split("-");
  return `${d}/${m}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApexComponent = React.ComponentType<any>;

function BarChart({ data, period }: { data: ChartRow[]; period: Period }) {
  const [ApexChart, setApexChart] = useState<ApexComponent | null>(null);

  useEffect(() => {
    import("react-apexcharts").then(m => setApexChart(() => m.default));
  }, []);

  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-white/20 text-sm">No data yet</div>
  );
  if (!ApexChart) return <div className="h-[320px] animate-pulse bg-white/5 rounded-lg" />;

  const categories = data.map(r => fmtLabel(r.label, period));
  const series = BAR_SERIES.map(s => ({
    name: s.label,
    data: data.map(r => r[s.key as keyof ChartRow] as number),
  }));

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 320,
      background: "transparent",
      toolbar: { show: false },
      zoom: { enabled: false },
      dropShadow: { enabled: true, color: "#ffffff", top: 6, left: 4, blur: 8, opacity: 0.06 },
    },
    theme: { mode: "dark" },
    colors: BAR_SERIES.map(s => s.color),
    stroke: { curve: "smooth", width: 2.5 },
    markers: {
      size: 4,
      colors: BAR_SERIES.map(s => s.color),
      strokeColors: "#111827",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: "rgba(255,255,255,0.07)",
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "rgba(255,255,255,0.4)", fontSize: "11px" } },
    },
    yaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "rgba(255,255,255,0.35)", fontSize: "11px" } },
    },
    tooltip: {
      theme: "dark",
      shared: true,
      intersect: false,
      y: { formatter: (v: number) => String(v) },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      labels: { colors: "rgba(255,255,255,0.5)" },
      markers: { size: 6 },
    },
  };

  return <ApexChart type="line" height={320} series={series} options={options} />;
}

function LineChart({ data, period }: { data: ChartRow[]; period: Period }) {
  const [ApexChart, setApexChart] = useState<ApexComponent | null>(null);

  useEffect(() => {
    import("react-apexcharts").then(m => setApexChart(() => m.default));
  }, []);

  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-white/20 text-sm">No data yet</div>
  );
  if (!ApexChart) return <div className="h-[280px] animate-pulse bg-white/5 rounded-lg" />;

  const categories = data.map(r => fmtLabel(r.label, period));
  const seriesData = data.map(r => r.avgTime);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 280,
      background: "transparent",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    theme: { mode: "dark" },
    colors: ["#f97316"],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "55%",
        dataLabels: { position: "top" },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -18,
      formatter: (v: number) => fmtTime(v),
      style: { fontSize: "10px", colors: ["#f97316"] },
      background: { enabled: false },
    },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    grid: {
      borderColor: "rgba(255,255,255,0.07)",
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories,
      position: "top",
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "rgba(255,255,255,0.4)", fontSize: "11px" } },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: { colorFrom: "rgba(255,255,255,0.08)", colorTo: "rgba(255,255,255,0.02)", stops: [0, 100], opacityFrom: 0.5, opacityTo: 0.3 },
        },
      },
    },
    yaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "rgba(255,255,255,0.35)", fontSize: "11px" },
        formatter: (v: number) => fmtTime(v),
      },
    },
    tooltip: {
      theme: "dark",
      y: { formatter: (v: number) => fmtTime(v), title: { formatter: () => "Avg. Time" } },
    },
    legend: { show: false },
  };

  return (
    <ApexChart type="bar" height={280} series={[{ name: "Avg. Time", data: seriesData }]} options={options} />
  );
}

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>("weekly");
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setStats(null);
    const url = period === "yearly"
      ? `/api/analytics?period=yearly&year=${selectedYear}`
      : `/api/analytics?period=${period}`;
    api.get<Stats>(url)
      .then(({ data }) => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [period, selectedYear]);

  const chartData: ChartRow[] = (() => {
    if (!stats) return [];
    if (period === "daily") {
      const byHour: Record<string, ChartRow> = {};
      for (const row of stats.chart) byHour[row.label] = row;
      return Array.from({ length: 24 }, (_, h) => {
        const key = String(h).padStart(2, "0");
        return byHour[key] ?? { label: key, views: 0, visitors: 0, clicks: 0, avgTime: 0 };
      });
    }
    if (period === "yearly") {
      const byMonth: Record<string, ChartRow> = {};
      for (const row of stats.chart) byMonth[row.label] = row;
      return Array.from({ length: 12 }, (_, m) => {
        const key = `${selectedYear}-${String(m + 1).padStart(2, "0")}`;
        return byMonth[key] ?? { label: key, views: 0, visitors: 0, clicks: 0, avgTime: 0 };
      });
    }
    return stats.chart;
  })();

  return (
    <div>
      {/* ── Analytics ── */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl text-white font-semibold tracking-wider">Analytics</h1>
            <p className="text-white/40 text-sm mt-0.5">Site visitor activity</p>
          </div>
          <div className="flex items-center gap-2">
            {period === "yearly" && (
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/70 focus:outline-none focus:border-white/30 transition"
              >
                {YEAR_OPTIONS.map(y => (
                  <option key={y} value={y} className="bg-[#111827]">{y}</option>
                ))}
              </select>
            )}
            <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
              {PERIODS.map(({ key, label }) => (
                <button key={key} onClick={() => setPeriod(key)}
                  className={`px-4 py-1.5 rounded text-xs font-medium transition ${
                    period === key ? "bg-white text-black" : "text-white/50 hover:text-white"
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Visitors", value: stats?.visitors ?? 0, sub: "unique sessions", color: "#f97316" },
            { label: "Page Views", value: stats?.pageviews ?? 0, sub: "total views", color: "#3b82f6" },
            { label: "Avg. Time", value: fmtTime(stats?.avgTime ?? 0), sub: "per session", color: "#f97316" },
            { label: "Clicks", value: stats?.clicks ?? 0, sub: "interactions", color: "#a1a1aa" },
          ].map((card) => (
            <div key={card.label} className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ background: card.color }} />
                <p className="text-white/40 text-xs uppercase tracking-wider">{card.label}</p>
              </div>
              <p className={`text-3xl font-semibold text-white ${loading ? "opacity-30" : ""}`}>
                {loading ? "—" : card.value}
              </p>
              <p className="text-white/30 text-xs mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="p-5 rounded-lg bg-white/5 border border-white/10 mb-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white/60 text-xs uppercase tracking-wider font-medium">Overview</p>
            <div className="flex items-center gap-4">
              {BAR_SERIES.map((s) => (
                <div key={s.key} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                  <span className="text-white/40 text-xs">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="h-48 animate-pulse bg-white/5 rounded-lg" />
          ) : (
            <BarChart data={chartData} period={period} />
          )}
        </div>

        {/* Avg time line chart */}
        <div className="p-5 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white/60 text-xs uppercase tracking-wider font-medium">Avg. Time on Site</p>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-0.5 rounded-full" style={{ background: "#f97316" }} />
              <span className="text-white/40 text-xs">Avg. Time</span>
            </div>
          </div>
          {loading ? (
            <div className="h-36 animate-pulse bg-white/5 rounded-lg" />
          ) : (
            <LineChart data={chartData} period={period} />
          )}
        </div>
      </div>

      {/* ── CMS Sections ── */}
      <div className="mb-4">
        <h2 className="text-lg text-white font-semibold">CMS Sections</h2>
        <p className="text-white/40 text-sm mt-0.5">Select a section to edit</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Link key={s.href} href={s.href}
            className="block p-5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition group">
            <h2 className="text-white font-medium group-hover:text-white/90">{s.label}</h2>
            <p className="text-white/40 text-sm mt-1">{s.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10">
        <p className="text-white/60 text-sm">
          Preview:{" "}
          <a href="http://localhost:3000/" target="_blank" rel="noopener noreferrer"
            className="text-white underline hover:text-white/80 transition">
            Open frontend in new tab
          </a>
        </p>
      </div>
    </div>
  );
}
