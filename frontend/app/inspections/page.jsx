"use client";

import { useState } from "react";
import Link from "next/link";
import TopNav from "../../components/TopNav";
import { DEMO_INSPECTIONS } from "../../lib/demoData";

export default function InspectionsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = DEMO_INSPECTIONS.filter(i => {
    if (filter !== "all" && i.status !== filter) return false;
    if (search && !i.product.toLowerCase().includes(search.toLowerCase()) && !i.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="page-enter">
      <TopNav title="Inspections" subtitle="Inspection history and records" />
      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <input type="text" placeholder="Search by product or ID..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="input-field w-64" />
          {["all", "compliant", "flagged", "review"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? "bg-navy text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}>{f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
          <Link href="/scan" className="ml-auto btn-primary text-sm flex items-center gap-2">
            <span>+</span> New Inspection
          </Link>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="table-header">Inspection ID</th>
                  <th className="table-header">Product</th>
                  <th className="table-header">Manufacturer</th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Inspector</th>
                  <th className="table-header">Result</th>
                  <th className="table-header">Violations</th>
                  <th className="table-header">Score</th>
                  <th className="table-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ins) => (
                  <tr key={ins.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                    <td className="table-cell font-mono text-xs text-slate-500">{ins.id}</td>
                    <td className="table-cell font-medium">{ins.product}</td>
                    <td className="table-cell text-slate-600">{ins.manufacturer}</td>
                    <td className="table-cell text-slate-500">{ins.date}</td>
                    <td className="table-cell text-slate-500">{ins.inspector}</td>
                    <td className="table-cell">
                      {ins.status === "compliant" && <span className="status-pass">\u2713 Compliant</span>}
                      {ins.status === "flagged" && <span className="status-fail">\u{1F6A9} Non-Compliant</span>}
                      {ins.status === "review" && <span className="status-review">\u26A0 Review</span>}
                    </td>
                    <td className="table-cell">{ins.issues}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${ins.score >= 80 ? 'bg-green-500' : ins.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${ins.score}%` }}></div>
                        </div>
                        <span className="text-xs font-medium">{ins.score}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <button className="text-blue-600 text-xs font-semibold hover:underline">View \u2192</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
