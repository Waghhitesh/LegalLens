"use client";

import TopNav from "../../components/TopNav";
import { DEMO_MANUFACTURERS } from "../../lib/demoData";

export default function ManufacturersPage() {
  return (
    <div className="page-enter">
      <TopNav title="Manufacturers" subtitle="Manufacturer compliance history and recurring issues" />
      <div className="p-6 space-y-6">
        {DEMO_MANUFACTURERS.map((m) => (
          <div key={m.id} className="card p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{m.name}</h3>
                  <p className="text-xs text-slate-500">{m.address}</p>
                </div>
              </div>
              <div className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                m.rate >= 80 ? "bg-green-50 text-green-700 border border-green-200" :
                m.rate >= 60 ? "bg-amber-50 text-amber-700 border border-amber-200" :
                "bg-red-50 text-red-700 border border-red-200"
              }`}>{m.rate}% Compliance</div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-5">
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-slate-700">{m.products}</p>
                <p className="text-[10px] text-slate-400">Products</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-green-600">{m.compliant}</p>
                <p className="text-[10px] text-slate-400">Compliant</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-red-600">{m.flagged}</p>
                <p className="text-[10px] text-slate-400">Flagged</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-blue-600">{m.rate}%</p>
                <p className="text-[10px] text-slate-400">Rate</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
