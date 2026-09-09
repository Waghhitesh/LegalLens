"use client";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="w-full max-w-[1300px] mx-auto space-y-5">
      
      <div>
        <h1 className="text-[22px] font-black text-[#0c1a36] tracking-tight">Dashboard</h1>
        <p className="text-[11px] text-slate-500 font-medium">Compliance Command Center</p>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0c1a36] via-[#1e3a8a] to-[#2563eb] rounded-2xl p-8 text-white flex justify-between items-center relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="absolute right-0 bottom-0 w-[300px] h-[300px] bg-white opacity-5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        {/* Watermark emblem */}
        <div className="absolute right-4 bottom-2 opacity-[0.08] pointer-events-none">
          <img src="/emblem.svg" alt="" className="w-28 h-36 object-contain"/>
          <p className="text-[8px] text-center font-bold mt-0.5 text-white">सत्यमेव जयते</p>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-2 mb-3 text-[8px] font-bold tracking-widest text-blue-200 uppercase">
             <span>SIH 2026</span><span className="w-1 h-1 bg-blue-300 rounded-full"></span>
             <span>PS-034</span><span className="w-1 h-1 bg-blue-300 rounded-full"></span>
             <span>Ministry of Consumer Affairs</span>
          </div>
          <h2 className="text-4xl font-black mb-3 tracking-tight leading-tight">Inspect a Package</h2>
          <p className="text-blue-100 text-[12px] mb-6 max-w-md leading-relaxed font-medium">Upload a package image to extract declarations and perform a compliance check.</p>
          
          <div className="flex items-center gap-3 mb-6">
            <Link href="/scan" className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-3 px-5 rounded-xl shadow-lg flex items-center gap-2 transition-all border border-blue-400/30 text-[12px]">
              <span>📷</span> Start Inspection →
            </Link>
            <Link href="/violations" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 px-5 rounded-xl flex items-center gap-2 transition-all text-[12px]">
              <span>⚠️</span> View Violations
            </Link>
            <Link href="/reports" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 px-5 rounded-xl flex items-center gap-2 transition-all text-[12px]">
              <span>📄</span> Generate Report
            </Link>
          </div>

          <div className="flex items-center gap-3 text-[8px] font-bold text-blue-200 uppercase tracking-widest">
            <span className="flex items-center gap-1"><span className="text-[11px]">📷</span> SCAN →</span>
            <span className="flex items-center gap-1"><span className="text-[11px]">🧠</span> EXTRACT →</span>
            <span className="flex items-center gap-1 text-white bg-white/10 px-2 py-0.5 rounded border border-white/20"><span className="text-green-400 text-[11px]">✓</span> CHECK →</span>
            <span className="flex items-center gap-1"><span className="text-[11px]">📄</span> REVIEW →</span>
            <span className="flex items-center gap-1"><span className="text-[11px]">📊</span> REPORT</span>
          </div>
        </div>

        {/* AI Agent Card */}
        <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 flex items-center gap-4 w-[340px] shadow-lg mr-2">
          <div className="w-16 h-16 bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-xl flex items-center justify-center text-3xl border-2 border-white/30 flex-shrink-0">
            🤖
          </div>
          <div>
            <div className="bg-blue-500/60 text-white text-[7px] font-black px-2 py-0.5 rounded inline-block mb-1.5 uppercase tracking-wider">AI Agent</div>
            <h3 className="text-white font-black text-[15px] leading-tight mb-1.5">Hi! I&apos;m your<br/>Compliance Assistant</h3>
            <p className="text-[9px] text-blue-100 mb-2.5 font-medium leading-relaxed">I can help you scan, detect violations, and guide you with legal metrology rules.</p>
            <div className="flex items-center gap-1.5 text-[8px] text-green-300 font-bold bg-green-900/30 px-2 py-1 rounded-full w-max border border-green-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Ready to Assist
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
         {[
           { title: "Packages Scanned", value: "128", change: "12%", icon: "📦", color: "text-amber-600", bg: "bg-amber-50 border-amber-100", up: true },
           { title: "Compliant", value: "94", change: "18%", icon: "✅", color: "text-green-600", bg: "bg-green-50 border-green-100", up: true },
           { title: "Flagged", value: "24", change: "6%", icon: "⚠️", color: "text-red-600", bg: "bg-red-50 border-red-100", up: false },
           { title: "Pending Review", value: "10", change: "20%", icon: "⏳", color: "text-purple-600", bg: "bg-purple-50 border-purple-100", up: false },
           { title: "Compliance Rate", value: "73.4%", change: "9%", icon: "🛡️", color: "text-blue-600", bg: "bg-blue-50 border-blue-100", up: true },
         ].map((kpi, i) => (
           <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
             <div className={`w-10 h-10 rounded-xl ${kpi.bg} ${kpi.color} border flex items-center justify-center text-xl mb-4`}>
               {kpi.icon}
             </div>
             <div className="flex items-end justify-between mb-1">
               <h3 className="text-[26px] font-black text-[#0c1a36] leading-none">{kpi.value}</h3>
               <span className={`text-[10px] font-bold ${kpi.up ? 'text-green-500' : 'text-red-500'} flex items-center gap-0.5`}>
                 {kpi.up ? '↑' : '↓'} {kpi.change}
               </span>
             </div>
             <div className="flex items-center justify-between">
               <p className="text-[10px] text-slate-500 font-semibold">{kpi.title}</p>
               <p className="text-[8px] font-medium text-slate-400">vs. last 7 days</p>
             </div>
           </div>
         ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-5 gap-4">
        {/* Line Chart */}
        <div className="col-span-3 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-[#0c1a36] flex items-center gap-2 text-[13px]">📈 Compliance Trend — Last 7 Days</h3>
             <select className="text-[10px] font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 outline-none cursor-pointer">
               <option>Last 7 Days</option>
             </select>
          </div>
          <div className="flex items-center gap-4 mb-3 text-[8px] font-bold text-slate-500">
             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Scanned</span>
             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Compliant</span>
             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Flagged</span>
          </div>
          <div className="relative h-[200px] flex items-end">
             {/* Y axis labels */}
             <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[8px] text-slate-400 font-medium pr-2">
               <span>100</span><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span>
             </div>
             {/* Chart area */}
             <div className="absolute left-6 right-0 top-0 bottom-5 flex flex-col justify-between opacity-10 pointer-events-none">
                {[1,2,3,4,5].map(x=><div key={x} className="border-t border-dashed border-slate-800 w-full"></div>)}
             </div>
             <svg className="absolute left-6 right-0 top-0 bottom-5" viewBox="0 0 100 50" preserveAspectRatio="none">
                {/* Scanned line (blue) */}
                <polyline points="0,28 16,25 33,22 50,20 66,12 83,8 100,10" fill="none" stroke="#3b82f6" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Compliant line (green) */}
                <polyline points="0,35 16,32 33,28 50,26 66,18 83,14 100,16" fill="none" stroke="#22c55e" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Green fill */}
                <polygon points="0,35 16,32 33,28 50,26 66,18 83,14 100,16 100,50 0,50" fill="#22c55e" opacity="0.08"/>
                {/* Flagged line (red) */}
                <polyline points="0,44 16,43 33,44 50,42 66,40 83,38 100,40" fill="none" stroke="#ef4444" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Data points on blue line */}
                {[[0,28],[16,25],[33,22],[50,20],[66,12],[83,8],[100,10]].map(([x,y],i) => (
                  <circle key={i} cx={x} cy={y} r="1" fill="#3b82f6"/>
                ))}
             </svg>
             {/* X axis labels */}
             <div className="absolute bottom-0 left-6 right-0 flex justify-between text-[7px] font-medium text-slate-400">
                <span>May 6</span><span>May 7</span><span>May 8</span><span>May 9</span><span>May 10</span><span>May 11</span><span>May 12</span>
             </div>
          </div>
        </div>
        
        {/* Donut Chart */}
        <div className="col-span-2 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-[#0c1a36] text-[13px]">Violations by Category</h3>
             <select className="text-[10px] font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 outline-none cursor-pointer">
               <option>All Categories</option>
             </select>
          </div>
          <div className="flex items-start gap-4">
            {/* Donut */}
            <div className="relative flex-shrink-0">
              <svg width="120" height="120" viewBox="0 0 120 120">
                {/* Background circle */}
                <circle cx="60" cy="60" r="48" fill="none" stroke="#e2e8f0" strokeWidth="14"/>
                {/* Labeling Defect - red 37.5% */}
                <circle cx="60" cy="60" r="48" fill="none" stroke="#ef4444" strokeWidth="14"
                  strokeDasharray={`${0.375 * 301.6} ${301.6}`} strokeDashoffset="0" transform="rotate(-90 60 60)"/>
                {/* Net Quantity - amber 20.8% */}
                <circle cx="60" cy="60" r="48" fill="none" stroke="#f59e0b" strokeWidth="14"
                  strokeDasharray={`${0.208 * 301.6} ${301.6}`} strokeDashoffset={`-${0.375 * 301.6}`} transform="rotate(-90 60 60)"/>
                {/* MRP Mismatch - blue 16.7% */}
                <circle cx="60" cy="60" r="48" fill="none" stroke="#3b82f6" strokeWidth="14"
                  strokeDasharray={`${0.167 * 301.6} ${301.6}`} strokeDashoffset={`-${(0.375 + 0.208) * 301.6}`} transform="rotate(-90 60 60)"/>
                {/* Packaged Commodity - purple 12.5% */}
                <circle cx="60" cy="60" r="48" fill="none" stroke="#8b5cf6" strokeWidth="14"
                  strokeDasharray={`${0.125 * 301.6} ${301.6}`} strokeDashoffset={`-${(0.375 + 0.208 + 0.167) * 301.6}`} transform="rotate(-90 60 60)"/>
                {/* Other - green 12.5% */}
                <circle cx="60" cy="60" r="48" fill="none" stroke="#10b981" strokeWidth="14"
                  strokeDasharray={`${0.125 * 301.6} ${301.6}`} strokeDashoffset={`-${(0.375 + 0.208 + 0.167 + 0.125) * 301.6}`} transform="rotate(-90 60 60)"/>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xl font-black text-[#0c1a36]">24</p>
                <p className="text-[7px] font-bold text-slate-400 uppercase tracking-wide">Total Violations</p>
              </div>
            </div>
            {/* Legend */}
            <div className="flex-1 space-y-2.5 pt-1">
              {[
                { label: "Labeling Defect", count: 9, pct: "37.5%", color: "bg-red-500" },
                { label: "Net Quantity", count: 5, pct: "20.8%", color: "bg-amber-500" },
                { label: "MRP Mismatch", count: 4, pct: "16.7%", color: "bg-blue-500" },
                { label: "Packaged Commodity Rules", count: 3, pct: "12.5%", color: "bg-purple-500" },
                { label: "Other", count: 3, pct: "12.5%", color: "bg-emerald-500" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                    <span className="text-slate-600 font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-slate-800">{item.count}</span>
                    <span className="text-[8px] text-slate-400">({item.pct})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="pt-4 pb-1 flex flex-col items-center justify-center">
         <div className="flex items-center gap-5 text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-2">
            <span>Safe Consumers</span><span className="w-px h-2.5 bg-slate-300"></span>
            <span>Fair Trade</span><span className="w-px h-2.5 bg-slate-300"></span>
            <span>Stronger India</span>
         </div>
         <div className="flex w-48 h-0.5 rounded-full overflow-hidden opacity-30">
            <div className="flex-1 bg-orange-500"></div><div className="flex-1 bg-white"></div><div className="flex-1 bg-green-500"></div>
         </div>
      </div>
    </div>
  );
}
