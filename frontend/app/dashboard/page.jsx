"use client";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="w-full max-w-[1300px] mx-auto space-y-6 relative">
      
      {/* Background Page Watermark */}
      <div className="fixed right-0 bottom-0 pointer-events-none z-[-1] opacity-[0.04]">
        <img src="/emblem.svg" alt="" className="w-[600px] h-[800px] object-contain translate-x-1/4 translate-y-1/4 filter sepia hue-rotate-15 saturate-150"/>
      </div>

      <div>
        <h1 className="text-[24px] font-black text-[#10264A] tracking-tight">Dashboard</h1>
        <p className="text-[12px] text-[#64748B] font-bold">Compliance Command Center</p>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0B1F3A] via-[#10264A] to-[#1557C0] rounded-2xl p-8 text-white flex justify-between items-center relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        {/* Subtle architectural background pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="absolute right-0 top-0 w-full h-full opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        {/* Ashoka Watermark inside Hero */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none">
          <img src="/emblem.svg" alt="" className="w-[280px] h-[360px] object-contain filter sepia hue-rotate-15 saturate-200"/>
        </div>
        
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-4 text-[9px] font-bold tracking-widest text-[#D9A928] uppercase">
             <span>SIH 2026</span><span className="w-1 h-1 bg-[#D9A928]/50 rounded-full"></span>
             <span>PS-034</span><span className="w-1 h-1 bg-[#D9A928]/50 rounded-full"></span>
             <span>Ministry of Consumer Affairs</span>
          </div>
          <h2 className="text-[36px] font-black mb-3 tracking-tight leading-tight">Inspect a Package</h2>
          <p className="text-white/80 text-[13px] mb-7 max-w-md leading-relaxed font-medium">Upload a package image to extract declarations and perform a compliance check under Legal Metrology Rules, 2011.</p>
          
          <div className="flex items-center gap-3 mb-8">
            <Link href="/scan" className="bg-[#2563EB] hover:bg-[#1557C0] text-white font-bold py-3 px-6 rounded-xl shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] flex items-center gap-2 transition-all border border-blue-400/20 text-[13px]">
              <span className="text-[16px]">📷</span> Start Inspection →
            </Link>
            <Link href="/violations" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-all text-[13px] backdrop-blur-sm">
              <span className="text-[16px]">⚠️</span> View Violations
            </Link>
            <Link href="/reports" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-all text-[13px] backdrop-blur-sm">
              <span className="text-[16px]">📄</span> Generate Report
            </Link>
          </div>

          {/* Workflow */}
          <div className="flex items-center gap-3 text-[9px] font-bold text-blue-200 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><span className="text-[12px] opacity-80">📷</span> SCAN</span>
            <span className="text-white/30">→</span>
            <span className="flex items-center gap-1.5"><span className="text-[12px] opacity-80">🧠</span> EXTRACT</span>
            <span className="text-white/30">→</span>
            <span className="flex items-center gap-1.5 text-white bg-[#16A34A]/80 px-2.5 py-1 rounded-md border border-[#16A34A]"><span className="text-white text-[12px]">✓</span> CHECK</span>
            <span className="text-white/30">→</span>
            <span className="flex items-center gap-1.5"><span className="text-[12px] opacity-80">📄</span> REVIEW</span>
            <span className="text-white/30">→</span>
            <span className="flex items-center gap-1.5"><span className="text-[12px] opacity-80">📊</span> REPORT</span>
          </div>
        </div>

        {/* AI Agent Card */}
        <div className="relative z-10 bg-[#FFFDF7]/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex items-start gap-4 w-[360px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] mr-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#10264A] rounded-2xl flex items-center justify-center text-[32px] border-2 border-white/30 flex-shrink-0 shadow-inner">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
               <div className="bg-[#1557C0] text-white text-[8px] font-black px-2 py-1 rounded inline-block uppercase tracking-wider">AI COMPLIANCE ASSISTANT</div>
            </div>
            <h3 className="text-white font-black text-[16px] leading-tight mb-2">LegalLens AI</h3>
            <p className="text-[10px] text-blue-100/90 mb-4 font-medium leading-relaxed italic border-l-2 border-[#D9A928] pl-2">&quot;I can help you scan products, identify declaration violations, and explain applicable Legal Metrology requirements.&quot;</p>
            <div className="flex items-center gap-2 text-[9px] text-[#16A34A] font-bold bg-[#16A34A]/10 px-2.5 py-1.5 rounded-full w-max border border-[#16A34A]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span> Ready to Assist
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-5">
         {[
           { title: "Packages Scanned", value: "128", change: "12%", icon: "📦", color: "text-[#D9A928]", bg: "bg-[#FFFDF7] border-[#D9A928]/20", up: true },
           { title: "Compliant", value: "94", change: "18%", icon: "✅", color: "text-[#16A34A]", bg: "bg-green-50 border-green-100", up: true },
           { title: "Flagged", value: "24", change: "6%", icon: "⚠️", color: "text-[#F59E0B]", bg: "bg-orange-50 border-orange-100", up: false },
           { title: "Pending Review", value: "10", change: "20%", icon: "⏳", color: "text-purple-600", bg: "bg-purple-50 border-purple-100", up: false },
           { title: "Compliance Rate", value: "73.4%", change: "9%", icon: "🛡️", color: "text-[#1557C0]", bg: "bg-blue-50 border-blue-100", up: true },
         ].map((kpi, i) => (
           <div key={i} className={`rounded-2xl p-5 border ${kpi.bg} shadow-sm hover:shadow-md transition-shadow relative overflow-hidden`}>
             {/* Subtle icon watermark */}
             <div className="absolute -right-2 -bottom-2 text-[64px] opacity-[0.03] pointer-events-none grayscale">{kpi.icon}</div>
             <div className="flex justify-between items-start mb-4 relative z-10">
                 <div className={`w-10 h-10 rounded-xl bg-white ${kpi.color} border border-slate-100 flex items-center justify-center text-xl shadow-sm`}>
                   {kpi.icon}
                 </div>
                 <span className={`text-[11px] font-bold ${kpi.up ? 'text-[#16A34A] bg-[#16A34A]/10' : 'text-red-500 bg-red-500/10'} px-2 py-1 rounded-md flex items-center gap-0.5`}>
                   {kpi.up ? '↑' : '↓'} {kpi.change}
                 </span>
             </div>
             <div className="relative z-10">
               <h3 className="text-[28px] font-black text-[#10264A] leading-none mb-1">{kpi.value}</h3>
               <p className="text-[11px] text-[#64748B] font-bold">{kpi.title}</p>
             </div>
           </div>
         ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-5 gap-5">
        {/* Line Chart */}
        <div className="col-span-3 bg-white rounded-2xl p-6 border border-[#D9E1EC] shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-[#10264A] flex items-center gap-2 text-[14px]">📈 Compliance Trend</h3>
             <select className="text-[11px] font-bold bg-[#F5F7FB] border border-[#D9E1EC] rounded-lg px-3 py-2 text-[#17233C] outline-none cursor-pointer">
               <option>Last 7 Days</option>
             </select>
          </div>
          <div className="flex items-center gap-5 mb-5 text-[10px] font-bold text-[#64748B]">
             <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1557C0]"></span> Scanned</span>
             <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]"></span> Compliant</span>
             <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span> Flagged</span>
          </div>
          <div className="relative h-[220px] flex items-end">
             {/* Y axis labels */}
             <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-[#64748B] font-medium pr-3 w-8 text-right">
               <span>100</span><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span>
             </div>
             {/* Chart area */}
             <div className="absolute left-10 right-0 top-0 bottom-6 flex flex-col justify-between opacity-20 pointer-events-none">
                {[1,2,3,4,5].map(x=><div key={x} className="border-t border-[#64748B] w-full"></div>)}
             </div>
             <svg className="absolute left-10 right-0 top-0 bottom-6" viewBox="0 0 100 50" preserveAspectRatio="none">
                {/* Scanned line */}
                <polyline points="0,28 16,25 33,22 50,20 66,12 83,8 100,10" fill="none" stroke="#1557C0" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Compliant line */}
                <polyline points="0,35 16,32 33,28 50,26 66,18 83,14 100,16" fill="none" stroke="#16A34A" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Green fill */}
                <polygon points="0,35 16,32 33,28 50,26 66,18 83,14 100,16 100,50 0,50" fill="#16A34A" opacity="0.08"/>
                {/* Flagged line */}
                <polyline points="0,44 16,43 33,44 50,42 66,40 83,38 100,40" fill="none" stroke="#F59E0B" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Data points */}
                {[[0,28],[16,25],[33,22],[50,20],[66,12],[83,8],[100,10]].map(([x,y],i) => (
                  <circle key={i} cx={x} cy={y} r="1.5" fill="#1557C0" stroke="white" strokeWidth="0.5"/>
                ))}
             </svg>
             {/* X axis labels */}
             <div className="absolute bottom-0 left-10 right-0 flex justify-between text-[9px] font-bold text-[#64748B]">
                <span>May 6</span><span>May 7</span><span>May 8</span><span>May 9</span><span>May 10</span><span>May 11</span><span>May 12</span>
             </div>
          </div>
        </div>
        
        {/* Donut Chart */}
        <div className="col-span-2 bg-white rounded-2xl p-6 border border-[#D9E1EC] shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-[#10264A] text-[14px]">Violations by Category</h3>
          </div>
          <div className="flex flex-col items-center gap-6">
            {/* Donut */}
            <div className="relative flex-shrink-0">
              <svg width="140" height="140" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="48" fill="none" stroke="#F5F7FB" strokeWidth="16"/>
                {/* Labeling Defect - red 37.5% */}
                <circle cx="60" cy="60" r="48" fill="none" stroke="#EF4444" strokeWidth="16"
                  strokeDasharray={`${0.375 * 301.6} ${301.6}`} strokeDashoffset="0" transform="rotate(-90 60 60)"/>
                {/* Net Quantity - amber 20.8% */}
                <circle cx="60" cy="60" r="48" fill="none" stroke="#F59E0B" strokeWidth="16"
                  strokeDasharray={`${0.208 * 301.6} ${301.6}`} strokeDashoffset={`-${0.375 * 301.6}`} transform="rotate(-90 60 60)"/>
                {/* MRP Mismatch - blue 16.7% */}
                <circle cx="60" cy="60" r="48" fill="none" stroke="#1557C0" strokeWidth="16"
                  strokeDasharray={`${0.167 * 301.6} ${301.6}`} strokeDashoffset={`-${(0.375 + 0.208) * 301.6}`} transform="rotate(-90 60 60)"/>
                {/* Packaged Commodity - gold 12.5% */}
                <circle cx="60" cy="60" r="48" fill="none" stroke="#D9A928" strokeWidth="16"
                  strokeDasharray={`${0.125 * 301.6} ${301.6}`} strokeDashoffset={`-${(0.375 + 0.208 + 0.167) * 301.6}`} transform="rotate(-90 60 60)"/>
                {/* Other - green 12.5% */}
                <circle cx="60" cy="60" r="48" fill="none" stroke="#16A34A" strokeWidth="16"
                  strokeDasharray={`${0.125 * 301.6} ${301.6}`} strokeDashoffset={`-${(0.375 + 0.208 + 0.167 + 0.125) * 301.6}`} transform="rotate(-90 60 60)"/>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[28px] font-black text-[#10264A] leading-none">24</p>
                <p className="text-[8px] font-bold text-[#64748B] uppercase tracking-wide mt-1">Total Violations</p>
              </div>
            </div>
            {/* Legend */}
            <div className="w-full space-y-3">
              {[
                { label: "Labeling Defect", count: 9, pct: "37.5%", color: "bg-[#EF4444]" },
                { label: "Net Quantity", count: 5, pct: "20.8%", color: "bg-[#F59E0B]" },
                { label: "MRP Mismatch", count: 4, pct: "16.7%", color: "bg-[#1557C0]" },
                { label: "Packaged Commodity Rules", count: 3, pct: "12.5%", color: "bg-[#D9A928]" },
                { label: "Other", count: 3, pct: "12.5%", color: "bg-[#16A34A]" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`}></span>
                    <span className="text-[#17233C] font-bold">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#10264A]">{item.count}</span>
                    <span className="text-[9px] text-[#64748B] font-bold">({item.pct})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Institutional Footer */}
      <footer className="mt-12 pt-8 pb-6 border-t border-[#D9E1EC] relative overflow-hidden">
         <div className="absolute bottom-0 left-0 w-full opacity-20 pointer-events-none">
            <img src="/tricolour-wave.png" alt="" className="w-full h-24 object-cover" />
         </div>
         <div className="flex flex-col items-center justify-center relative z-10">
            <div className="flex flex-col items-center text-center">
              <p className="text-[12px] font-bold text-[#10264A] mb-1">Government of India</p>
              <p className="text-[10px] text-[#64748B] font-bold mb-4">Department of Consumer Affairs</p>
              
              <p className="text-[11px] font-bold text-[#1557C0] mb-4">Legal Metrology (Packaged Commodities) Rules, 2011</p>
              
              <div className="flex items-center gap-4 text-[9px] text-[#64748B] font-bold uppercase tracking-widest mb-4">
                 <span>Consumer Protection</span><span className="w-1 h-1 rounded-full bg-[#D9E1EC]"></span>
                 <span>Fair Trade</span><span className="w-1 h-1 rounded-full bg-[#D9E1EC]"></span>
                 <span>Transparent Markets</span>
              </div>
              
              <p className="text-[10px] font-bold text-[#10264A] bg-[#F5F7FB] px-4 py-1.5 rounded-full border border-[#D9E1EC]">Smart India Hackathon 2026 · PS-034</p>
            </div>
         </div>
      </footer>
    </div>
  );
}
