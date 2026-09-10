"use client";

import { DEMO_STATS, DEMO_VIOLATIONS, DEMO_MANUFACTURERS } from "../../lib/demoData";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement,
  LineElement, PointElement, Title, Tooltip, Legend, Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

export default function AnalyticsPage() {
  const violByType = {};
  DEMO_VIOLATIONS.forEach(v => { violByType[v.violation] = (violByType[v.violation] || 0) + 1; });

  return (
    <div className="page-enter">
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compliance Trend */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Compliance Rate Trend</h3>
            <Line
              data={{
                labels: DEMO_STATS.trendData.map(d => d.date),
                datasets: [{
                  label: "Compliance %", data: DEMO_STATS.trendData.map(d => d.compliance),
                  borderColor: "#22c55e", backgroundColor: "rgba(34,197,94,0.1)", tension: 0.4, fill: true,
                }],
              }}
              options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100 } } }}
            />
          </div>
          {/* Violations by Type */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Violations by Category</h3>
            <Bar
              data={{
                labels: Object.keys(DEMO_STATS.violationsByType),
                datasets: [{ label: "Violations", data: Object.values(DEMO_STATS.violationsByType), backgroundColor: ["#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#06b6d4", "#22c55e", "#f97316"] }],
              }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          </div>
          {/* Recurring Types */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Recurring Violation Types</h3>
            <Doughnut
              data={{
                labels: Object.keys(violByType),
                datasets: [{ data: Object.values(violByType), backgroundColor: ["#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#06b6d4", "#22c55e", "#f97316", "#ec4899"] }],
              }}
              options={{ responsive: true, plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } } } }}
            />
          </div>
          {/* Manufacturer-wise */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Manufacturer Compliance</h3>
            <Bar
              data={{
                labels: DEMO_MANUFACTURERS.map(m => m.name.split(" ").slice(0, 2).join(" ")),
                datasets: [
                  { label: "Compliant", data: DEMO_MANUFACTURERS.map(m => m.compliant), backgroundColor: "#22c55e" },
                  { label: "Flagged", data: DEMO_MANUFACTURERS.map(m => m.flagged), backgroundColor: "#ef4444" },
                ],
              }}
              options={{ responsive: true, plugins: { legend: { position: "bottom" } }, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
