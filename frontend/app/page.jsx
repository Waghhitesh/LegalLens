"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopNav from "../components/TopNav";
import { DEMO_STATS, DEMO_INSPECTIONS } from "../lib/demoData";
import { getDashboardStats, getRecentAudits } from "../lib/api";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement,
  LineElement, PointElement, Title, Tooltip, Legend, Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement,
  LineElement, PointElement, Title, Tooltip, Legend, Filler
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [useDemo, setUseDemo] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [s, r] = await Promise.all([getDashboardStats(), getRecentAudits()]);
        if (s.total_audits > 0) {
          setStats(s);
          setRecent(r);
        } else {
          setUseDemo(true);
        }
      } catch {
        setUseDemo(true);
      }
    }
    load();
  }, []);

  const ds = useDemo ? DEMO_STATS : stats;
  const recentList = useDemo ? DEMO_INSPECTIONS.slice(0, 8) : recent;

  const kpis = ds ? [
    { label: "Packages Scanned", value: useDemo ? ds.totalScanned : ds.total_audits, icon: "📋", color: "blue" },
    { label: "Compliant", value: useDemo ? ds.compliant : ds.total_pass, icon: "✅", color: "green" },
    { label: "Flagged", value: useDemo ? ds.flagged : ds.total_fail, icon: "🚩", color: "red" },
    { label: "Pending Review", value: useDemo ? ds.pendingReview : (ds.total_audits - ds.total_pass - ds.total_fail), icon: "⏳", color: "amber" },
    { label: "Compliance Rate", value: useDemo ? `${ds.complianceRate}%` : `${ds.pass_rate}%`, icon: "📈", color: "blue" },
  ] : [];

  const trendData = useDemo ? ds?.trendData : ds?.audits_last_7_days?.map(d => ({ date: d.date, inspections: d.count, compliance: 75 }));
  const violData = useDemo ? ds?.violationsByType : ds?.violations_by_rule;

  return (
    <div className="page-enter">
      <TopNav title="Dashboard" subtitle="Compliance Command Center" />
      <div className="p-6 space-y-6">
        {/* Hero CTA */}
        <div className="card p-6 bg-gradient-to-r from-navy to-slate-800 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 text-[12rem] leading-none">⚖</div>
          <div className="relative z-10">
            <p className="text-blue-300 text-xs uppercase tracking-widest mb-1">SIH 2026 · PS-034 · Ministry of Consumer Affairs</p>
            <h2 className="text-2xl font-bold mb-1">Inspect a Package</h2>
            <p className="text-slate-300 text-sm mb-5">Upload a package image to extract declarations and perform a compliance check.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/scan" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow">
                <span>📷</span> Start Inspection
              </Link>
              <Link href="/violations" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">
                View Violations
              </Link>
              <Link href="/reports" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">
                Generate Report
              </Link>
            </div>
            <div className="flex items-center gap-8 mt-5 text-xs text-slate-400">
              <span>SCAN</span><span>→</span><span>EXTRACT</span><span>→</span><span>CHECK</span><span>→</span><span>REVIEW</span><span>→</span><span>REPORT</span>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        {ds && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {kpis.map((k, i) => (
              <div key={i} className="kpi-card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{k.icon}</span>
                  <span className={`w-2 h-2 rounded-full bg-${k.color}-500`}></span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{k.value}</p>
                <p className="text-xs text-slate-500 mt-1">{k.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Charts Row */}
        {trendData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trend */}
            <div className="card p-5 lg:col-span-2">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Compliance Trend — Last 7 Days</h3>
              <Line
                data={{
                  labels: trendData.map(d => d.date),
                  datasets: [
                    { label: "Inspections", data: trendData.map(d => d.inspections), borderColor: "#3b82f6", backgroundColor: "rgba(59,130,246,0.08)", tension: 0.4, fill: true, pointBackgroundColor: "#3b82f6" },
                    { label: "Compliance %", data: trendData.map(d => d.compliance), borderColor: "#22c55e", backgroundColor: "transparent", tension: 0.4, borderDash: [5, 5], pointBackgroundColor: "#22c55e", yAxisID: "y1" },
                  ],
                }}
                options={{ responsive: true, interaction: { mode: "index", intersect: false }, plugins: { legend: { position: "bottom", labels: { boxWidth: 12, usePointStyle: true } } }, scales: { y: { beginAtZero: true, title: { display: true, text: "Count" } }, y1: { position: "right", min: 0, max: 100, title: { display: true, text: "%" }, grid: { drawOnChartArea: false } } } }}
              />
            </div>
            {/* Violations donut */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Violations by Category</h3>
              <Doughnut
                data={{
                  labels: Object.keys(violData || {}),
                  datasets: [{ data: Object.values(violData || {}), backgroundColor: ["#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#06b6d4", "#22c55e", "#f97316"] }],
                }}
                options={{ responsive: true, plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } } } }}
              />
            </div>
          </div>
        )}

        {/* Recent Inspections */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">Recent Inspections</h3>
            <Link href="/inspections" className="text-xs text-blue-600 font-semibold hover:underline">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="table-header">ID</th>
                  <th className="table-header">Product</th>
                  <th className="table-header">Manufacturer</th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Issues</th>
                  <th className="table-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentList.map((r, i) => (
                  <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/50">
                    <td className="table-cell font-mono text-xs text-slate-500">{r.id}</td>
                    <td className="table-cell font-medium text-slate-800">{r.product || r.product_url?.split("/").pop() || "Product"}</td>
                    <td className="table-cell text-slate-600">{r.manufacturer || "—"}</td>
                    <td className="table-cell text-slate-500">{r.date || (r.created_at ? new Date(r.created_at).toLocaleDateString() : "—")}</td>
                    <td className="table-cell">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="table-cell">{r.issues ?? r.violation_count ?? 0}</td>
                    <td className="table-cell">
                      <Link href={r.id?.startsWith?.("LL") ? `/inspections` : `/inspector/${r.id}`} className="text-blue-600 text-xs font-semibold hover:underline">View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {useDemo && (
          <p className="text-center text-xs text-slate-400 py-2">💡 Showing demo data. Run real audits from the Scan Package page to populate live data.</p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  if (s === "compliant" || s === "pass" || s === "pass_") return <span className="status-pass">✓ Compliant</span>;
  if (s === "flagged" || s === "fail") return <span className="status-fail">🚩 Non-Compliant</span>;
  if (s === "review" || s === "pending") return <span className="status-review">⚠ Needs Review</span>;
  return <span className="status-pending">{status || "—"}</span>;
}
