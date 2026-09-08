"use client";

import { useEffect, useState } from "react";
import { getDashboardStats, getRecentAudits } from "../../lib/api";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  LineElement, PointElement, Title, Tooltip, Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement,
  LineElement, PointElement, Title, Tooltip, Legend
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [s, r] = await Promise.all([getDashboardStats(), getRecentAudits()]);
        setStats(s);
        setRecent(r);
      } catch (err) {
        setError("Failed to load dashboard data. Is the backend running?");
      }
    }
    load();
  }, []);

  if (error) return <div className="p-8 text-red-600 bg-red-50 m-8 rounded-xl">{error}</div>;

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="font-ui text-xs uppercase tracking-widest text-gold mb-1">Analytics</p>
        <h1 className="font-display text-4xl text-navy">Compliance Dashboard</h1>
        <p className="text-sm text-ink/50 font-ui mt-1">Real-time compliance statistics and audit trends</p>
      </div>

      {!stats ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-ink/40 font-ui">Loading…</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KpiCard label="Total Audits" value={stats.total_audits} color="navy" icon="📋" />
            <KpiCard label="Pass" value={stats.total_pass} color="green-600" icon="✅" />
            <KpiCard label="Fail" value={stats.total_fail} color="red-600" icon="❌" />
            <KpiCard label="Pass Rate" value={`${stats.pass_rate}%`} color="gold" icon="📈" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* 7-day trend */}
            <div className="lg:col-span-2 bg-white border border-gold/30 rounded-2xl p-6">
              <h2 className="font-display text-xl text-navy mb-4">Audits — Last 7 Days</h2>
              <Line
                data={{
                  labels: stats.audits_last_7_days.map((d) => d.date),
                  datasets: [{
                    label: "Audits",
                    data: stats.audits_last_7_days.map((d) => d.count),
                    borderColor: "#11213d",
                    backgroundColor: "rgba(17,33,61,0.08)",
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: "#c9a227",
                  }],
                }}
                options={{ responsive: true, plugins: { legend: { display: false } } }}
              />
            </div>

            {/* Violations donut */}
            <div className="bg-white border border-gold/30 rounded-2xl p-6">
              <h2 className="font-display text-xl text-navy mb-4">Violations by Rule</h2>
              <Doughnut
                data={{
                  labels: ["Rule 6", "Rule 7", "Overcharging"],
                  datasets: [{
                    data: [
                      stats.violations_by_rule["RULE_6_MANDATORY_DECLARATION"] || 0,
                      stats.violations_by_rule["RULE_7_FONT_LEGIBILITY"] || 0,
                      stats.violations_by_rule["OVERCHARGING"] || 0,
                    ],
                    backgroundColor: ["#11213d", "#c9a227", "#6b1e23"],
                  }],
                }}
                options={{ responsive: true, plugins: { legend: { position: "bottom" } } }}
              />
            </div>
          </div>

          {/* Pass/Fail Bar */}
          <div className="bg-white border border-gold/30 rounded-2xl p-6 mb-8">
            <h2 className="font-display text-xl text-navy mb-4">Pass vs Fail</h2>
            <Bar
              data={{
                labels: ["Results"],
                datasets: [
                  { label: "Pass", data: [stats.total_pass], backgroundColor: "#16a34a" },
                  { label: "Fail", data: [stats.total_fail], backgroundColor: "#dc2626" },
                ],
              }}
              options={{ responsive: true, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } }}
            />
          </div>

          {/* Recent Audits */}
          <div className="bg-white border border-gold/30 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gold/20">
              <h2 className="font-display text-xl text-navy">Recent Audits</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-ui">
                <thead className="bg-navy text-white">
                  <tr>
                    <th className="text-left px-4 py-3">Product</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Score</th>
                    <th className="text-left px-4 py-3">Violations</th>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((a) => (
                    <tr key={a.id} className="border-t border-gold/10 hover:bg-gold/5">
                      <td className="px-4 py-3 max-w-xs">
                        <span className="truncate block text-xs text-ink/60">
                          {a.product_url ? a.product_url.replace(/https?:\/\/[^/]+/, "") : "Field Upload"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          a.status === "PASS" || a.status === "PASS_" ? "bg-green-100 text-green-700" :
                          a.status === "FAIL" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {a.status === "PASS_" ? "PASS" : a.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold">{a.compliance_score?.toFixed(0) ?? "—"}</td>
                      <td className="px-4 py-3">{a.violation_count}</td>
                      <td className="px-4 py-3 text-ink/50 text-xs">
                        {a.created_at ? new Date(a.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <a href={`/inspector/${a.id}`} className="text-navy text-xs font-semibold hover:underline">View →</a>
                      </td>
                    </tr>
                  ))}
                  {!recent.length && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-ink/40">No audits yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

function KpiCard({ label, value, color, icon }) {
  return (
    <div className="bg-white border border-gold/30 rounded-2xl p-5">
      <div className="text-2xl mb-2">{icon}</div>
      <div className={`font-display text-3xl text-${color} mb-1`}>{value}</div>
      <div className="text-xs font-ui text-ink/50 uppercase tracking-wide">{label}</div>
    </div>
  );
}
