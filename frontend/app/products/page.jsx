"use client";

import TopNav from "../../components/TopNav";
import { DEMO_PRODUCTS } from "../../lib/demoData";

export default function ProductsPage() {
  return (
    <div className="page-enter">
      <TopNav title="Products" subtitle="Product registry and compliance overview" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_PRODUCTS.map((p) => (
            <div key={p.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-lg">📦</div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  p.status === "compliant" ? "bg-green-50 text-green-700 border border-green-200" :
                  p.status === "flagged" ? "bg-red-50 text-red-700 border border-red-200" :
                  "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>{p.status === "compliant" ? "✓ Compliant" : p.status === "flagged" ? "🚩 Flagged" : "⚠ Review"}</span>
              </div>
              <h3 className="font-bold text-slate-800 mb-0.5">{p.name}</h3>
              <p className="text-xs text-slate-500 mb-3">{p.manufacturer}</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 rounded-lg py-2">
                  <p className="text-sm font-bold text-slate-700">{p.inspections}</p>
                  <p className="text-[10px] text-slate-400">Inspections</p>
                </div>
                <div className="bg-slate-50 rounded-lg py-2">
                  <p className="text-sm font-bold text-slate-700">{p.rate}%</p>
                  <p className="text-[10px] text-slate-400">Compliance</p>
                </div>
                <div className="bg-slate-50 rounded-lg py-2">
                  <p className="text-sm font-bold text-slate-700">₹{p.mrp}</p>
                  <p className="text-[10px] text-slate-400">MRP</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400">{p.category} · {p.netQty}</span>
                <button className="text-xs text-blue-600 font-semibold hover:underline">Details →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
