"use client";
import { RULE_CATEGORIES } from "../../lib/rules";

export default function SettingsPage() {
  return (
    <div className="relative">
      <div className="p-6 space-y-6">
        {/* Rule Engine */}
        <div className="card p-6">
          <h3 className="text-base font-bold text-slate-800 mb-1">⚖ Rule Engine Configuration</h3>
          <p className="text-xs text-slate-500 mb-4">Legal Metrology (Packaged Commodities) Rules, 2011</p>
          {RULE_CATEGORIES.map((cat) => (
            <div key={cat.id} className="mb-6">
              <h4 className="text-sm font-bold text-slate-700 mb-1">{cat.title}</h4>
              <p className="text-xs text-slate-500 mb-3">{cat.description}</p>
              <div className="space-y-2">
                {cat.rules.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-xs font-bold text-blue-600">{r.id.split('-')[1]}</div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{r.title}</p>
                        <p className="text-[10px] text-slate-400">Type: {r.validationType} · Severity: {r.severity}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* AI Configuration */}
        <div className="card p-6">
          <h3 className="text-base font-bold text-slate-800 mb-4">🤖 AI / OCR Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600">Ollama Base URL</label>
              <input type="text" defaultValue="http://localhost:11434" className="input-field mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Vision Model</label>
              <input type="text" defaultValue="llava" className="input-field mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Text Model</label>
              <input type="text" defaultValue="llava" className="input-field mt-1" />
            </div>
            <button className="btn-primary text-sm">Save Configuration</button>
          </div>
        </div>
      </div>
    </div>
  );
}
