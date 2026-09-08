"use client";

import { useState } from "react";
import TopNav from "../../components/TopNav";
import { DEMO_VIOLATIONS } from "../../lib/demoData";
import { SEVERITY_CONFIG } from "../../lib/rules";

export default function ViolationsPage() {
  const [filter, setFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  const filtered = DEMO_VIOLATIONS.filter(v => {
    if (filter !== "all" && v.status !== filter) return false;
    if (severityFilter !== "all" && v.severity !== severityFilter) return false;
    return true;
  });

  return (
    <div className="page-enter">
      <TopNav title="Violations" subtitle="Track and manage detected compliance violations" />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="kpi-card"><p className="text-2xl font-bold text-red-600">{DEMO_VIOLATIONS.filter(v => v.status === 'open').length}</p><p className="text-xs text-slate-500">Open</p></div>
          <div className="kpi-card"><p className="text-2xl font-bold text-amber-600">{DEMO_VIOLATIONS.filter(v => v.status === 'review').length}</p><p className="text-xs text-slate-500">Under Review</p></div>
          <div className="kpi-card"><p className="text-2xl font-bold text-blue-600">{DEMO_VIOLATIONS.filter(v => v.status === 'confirmed').length}</p><p className="text-xs text-slate-500">Confirmed</p></div>
          <div className="kpi-card"><p className="text-2xl font-bold text-green-600">{DEMO_VIOLATIONS.filter(v => v.status === 'resolved').length}</p><p className="text-xs text-slate-500">Resolved</p></div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {["all", "open", "review", "confirmed", "resolved"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? "bg-navy text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}>{f === "all" ? "All Status" : f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
          <div className="w-px bg-slate-200"></div>
          {["all", "critical", "high", "medium", "low"].map(s => (
            <button key={s} onClick={() => setSeverityFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                severityFilter === s ? "bg-navy text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}>{s === "all" ? "All Severity" : s.charAt(0).toUpperCase() + s.slice(1)}</button>
          ))}
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="table-header">ID</th>
                  <th className="table-header">Product</th>
                  <th className="table-header">Manufacturer</th>
                  <th className="table-header">Violation</th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Confidence</th>
                  <th className="table-header">Severity</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => {
                  const sev = SEVERITY_CONFIG[v.severity] || SEVERITY_CONFIG.medium;
                  return (
                    <tr key={v.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                      <td className="table-cell font-mono text-xs text-slate-500">{v.id}</td>
                      <td className="table-cell font-medium">{v.product}</td>
                      <td className="table-cell text-slate-600">{v.manufacturer}</td>
                      <td className="table-cell font-medium text-slate-800">{v.violation}</td>
                      <td className="table-cell text-slate-500">{v.date}</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${v.confidence}%` }}></div>
                          </div>
                          <span className="text-xs">{v.confidence}%</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sev.bg} ${sev.text} ${sev.border} border`}>
                          {sev.label}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          v.status === 'open' ? 'bg-red-50 text-red-600' :
                          v.status === 'review' ? 'bg-amber-50 text-amber-600' :
                          v.status === 'confirmed' ? 'bg-blue-50 text-blue-600' :
                          'bg-green-50 text-green-600'
                        }`}>{v.status.charAt(0).toUpperCase() + v.status.slice(1)}</span>
                      </td>
                      <td className="table-cell">
                        <button className="text-blue-600 text-xs font-semibold hover:underline">View →</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
