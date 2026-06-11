import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Analytics from "@/lib/models/Analytics";
import { verifyAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  const { event, url, sessionId, value = 1, meta = "" } = body;
  if (!event || !sessionId) return NextResponse.json({ ok: false }, { status: 400 });
  await Analytics.create({ event, url, sessionId, value, meta });
  return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest) {
  verifyAuth(request);
  await connectDB();

  const period = request.nextUrl.searchParams.get("period") ?? "weekly";
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // UTC+5:30
  const now = new Date();
  let from: Date;
  let to: Date | undefined;
  let groupFormat: string;
  let tzOption: string | undefined;

  if (period === "daily") {
    const nowIST = new Date(now.getTime() + IST_OFFSET_MS);
    nowIST.setHours(0, 0, 0, 0);
    from = new Date(nowIST.getTime() - IST_OFFSET_MS);
    groupFormat = "%H";
    tzOption = "+05:30";
  } else if (period === "monthly") {
    from = new Date(now); from.setDate(now.getDate() - 30);
    groupFormat = "%Y-%m-%d";
  } else if (period === "yearly") {
    const year = parseInt(request.nextUrl.searchParams.get("year") ?? String(now.getFullYear()));
    from = new Date(`${year}-01-01T00:00:00.000Z`);
    to   = new Date(`${year + 1}-01-01T00:00:00.000Z`);
    groupFormat = "%Y-%m";
  } else {
    from = new Date(now); from.setDate(now.getDate() - 6);
    from.setHours(0, 0, 0, 0);
    groupFormat = "%Y-%m-%d";
  }

  const dateMatch = to
    ? { $gte: from, $lt: to }
    : { $gte: from };

  const [pvAgg, timeAgg, clickCount, chartPv, chartClicks, chartTime] = await Promise.all([
    Analytics.aggregate([
      { $match: { event: "pageview", createdAt: dateMatch } },
      { $group: { _id: null, total: { $sum: 1 }, sessions: { $addToSet: "$sessionId" } } },
    ]),
    Analytics.aggregate([
      { $match: { event: "timespent", createdAt: dateMatch } },
      { $group: { _id: null, total: { $sum: "$value" }, count: { $sum: 1 } } },
    ]),
    Analytics.countDocuments({ event: "click", createdAt: dateMatch }),
    Analytics.aggregate([
      { $match: { event: "pageview", createdAt: dateMatch } },
      { $group: { _id: { $dateToString: { format: groupFormat, date: "$createdAt", ...(tzOption && { timezone: tzOption }) } }, views: { $sum: 1 }, sessions: { $addToSet: "$sessionId" } } },
      { $sort: { _id: 1 } },
    ]),
    Analytics.aggregate([
      { $match: { event: "click", createdAt: dateMatch } },
      { $group: { _id: { $dateToString: { format: groupFormat, date: "$createdAt", ...(tzOption && { timezone: tzOption }) } }, clicks: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Analytics.aggregate([
      { $match: { event: "timespent", createdAt: dateMatch } },
      { $group: { _id: { $dateToString: { format: groupFormat, date: "$createdAt", ...(tzOption && { timezone: tzOption }) } }, total: { $sum: "$value" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const visitors = pvAgg[0]?.sessions?.length ?? 0;
  const pageviews = pvAgg[0]?.total ?? 0;
  const totalTime = timeAgg[0]?.total ?? 0;
  const timeCount = timeAgg[0]?.count ?? 0;
  const avgTime = timeCount > 0 ? Math.round(totalTime / timeCount) : 0;

  // Merge chart data
  const chartMap: Record<string, { views: number; visitors: number; clicks: number; avgTime: number }> = {};
  for (const row of chartPv) {
    chartMap[row._id] = { views: row.views, visitors: row.sessions?.length ?? 0, clicks: 0, avgTime: 0 };
  }
  for (const row of chartClicks) {
    if (chartMap[row._id]) chartMap[row._id].clicks = row.clicks;
    else chartMap[row._id] = { views: 0, visitors: 0, clicks: row.clicks, avgTime: 0 };
  }
  for (const row of chartTime) {
    const avg = row.count > 0 ? Math.round(row.total / row.count) : 0;
    if (chartMap[row._id]) chartMap[row._id].avgTime = avg;
    else chartMap[row._id] = { views: 0, visitors: 0, clicks: 0, avgTime: avg };
  }
  const chart = Object.entries(chartMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, v]) => ({ label, ...v }));

  return NextResponse.json({ visitors, pageviews, avgTime, clicks: clickCount, chart });
}
