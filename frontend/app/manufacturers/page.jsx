"use client";

import { useState } from "react";
import { DEMO_MANUFACTURERS } from "../../lib/demoData";

export default function ManufacturersPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="relative">
      <div className="p-6 space-y-6">
        {DEMO_MANUFACTURERS.map((m) => (
          <div key={m.id} className="card p-6 relative">
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
              <div className="flex flex-col items-end gap-2">
                <div className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                  m.rate >= 80 ? "bg-green-50 text-green-700 border border-green-200" :
                  m.rate >= 60 ? "bg-amber-50 text-amber-700 border border-amber-200" :
                  "bg-red-50 text-red-700 border border-red-200"
                }`}>{m.rate}% Compliance</div>
                <button onClick={() => setSelected(m)} className="text-xs text-blue-600 font-semibold hover:underline mt-2">Details →</button>
              </div>
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
        
        {/* Modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-xl font-bold">×</button>
              <h2 className="text-lg font-bold text-slate-800 mb-4">Manufacturer Details</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-sm text-slate-500">ID:</p><p className="text-sm font-medium">{selected.id}</p>
                  <p className="text-sm text-slate-500">Name:</p><p className="text-sm font-medium">{selected.name}</p>
                  <p className="text-sm text-slate-500">Address:</p><p className="text-sm font-medium">{selected.address}</p>
                  <p className="text-sm text-slate-500">Total Products:</p><p className="text-sm font-medium">{selected.products}</p>
                  <p className="text-sm text-slate-500">Compliant:</p><p className="text-sm font-medium text-green-600">{selected.compliant}</p>
                  <p className="text-sm text-slate-500">Flagged:</p><p className="text-sm font-medium text-red-600">{selected.flagged}</p>
                  <p className="text-sm text-slate-500">Compliance Rate:</p><p className="text-sm font-medium text-blue-600">{selected.rate}%</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setSelected(null)} className="px-4 py-2 text-sm bg-navy text-white rounded-lg font-medium">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
