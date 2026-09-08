"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="w-full h-full max-w-[1400px] mx-auto space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-[26px] font-black text-[#11213d] tracking-tight">Dashboard</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Compliance Command Center</p>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#3b82f6] rounded-3xl p-10 text-white flex justify-between items-center shadow-xl relative overflow-hidden">
        {/* Abstract Backgrounds */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3 mb-4">
             <span className="text-[10px] font-bold tracking-widest text-blue-200 uppercase">SIH 2026</span>
             <span className="w-1 h-1 bg-blue-300 rounded-full"></span>
             <span className="text-[10px] font-bold tracking-widest text-blue-200 uppercase">PS-034</span>
             <span className="w-1 h-1 bg-blue-300 rounded-full"></span>
             <span className="text-[10px] font-bold tracking-widest text-blue-200 uppercase">Ministry of Consumer Affairs</span>
          </div>
          <h2 className="text-5xl font-black mb-4 tracking-tight">Inspect a Package</h2>
          <p className="text-blue-100 text-sm mb-8 max-w-md leading-relaxed font-medium">Upload a package image to extract declarations and perform a compliance check.</p>
          
          <div className="flex items-center gap-4 mb-10">
            <Link href="/scan" className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-900/40 flex items-center gap-3 transition-all border border-blue-400/30">
              <span className="text-xl">📷</span> Start Inspection →
            </Link>
            <Link href="/violations" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3.5 px-6 rounded-xl flex items-center gap-3 transition-all backdrop-blur-md">
              <span className="text-xl">🛡️</span> View Violations
            </Link>
            <Link href="/reports" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3.5 px-6 rounded-xl flex items-center gap-3 transition-all backdrop-blur-md">
              <span className="text-xl">📄</span> Generate Report
            </Link>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-bold text-blue-200 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><span className="text-sm">📷</span> SCAN <span className="opacity-50 ml-1">→</span></span>
            <span className="flex items-center gap-1.5"><span className="text-sm">🧠</span> EXTRACT <span className="opacity-50 ml-1">→</span></span>
            <span className="flex items-center gap-1.5 text-white bg-white/10 px-2 py-1 rounded-md border border-white/20"><span className="text-sm text-green-400">✓</span> CHECK <span className="opacity-50 ml-1">→</span></span>
            <span className="flex items-center gap-1.5"><span className="text-sm">📄</span> REVIEW <span className="opacity-50 ml-1">→</span></span>
            <span className="flex items-center gap-1.5"><span className="text-sm">📊</span> REPORT</span>
          </div>
        </div>

        {/* Robot Agent Card Graphic */}
        <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl p-6 flex items-center gap-6 w-[420px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] mr-6 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
          {/* Glowing orb behind robot */}
          <div className="absolute -left-6 -top-6 w-32 h-32 bg-blue-400 rounded-full mix-blend-screen filter blur-2xl opacity-50"></div>
          
          <div className="w-24 h-24 bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-2xl flex items-center justify-center text-5xl shadow-inner border-2 border-white/50 relative z-10 flex-shrink-0">
            🤖
          </div>
          <div className="relative z-10">
            <div className="bg-blue-500/80 text-white text-[9px] font-black px-2.5 py-1 rounded-lg inline-block mb-2 backdrop-blur border border-blue-400/50 uppercase tracking-wider">AI AGENT</div>
            <h3 className="text-white font-black text-xl leading-tight mb-2">Hi! I'm your<br/>Compliance Assistant</h3>
            <p className="text-[11px] text-blue-100 mb-4 font-medium leading-relaxed">I can help you scan, detect violations, and guide you with legal metrology rules.</p>
            <div className="flex items-center gap-2 text-[10px] text-green-300 font-bold bg-green-900/40 px-3 py-1.5 rounded-full w-max border border-green-400/30">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Ready to Assist
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-5">
         {[
           { title: "Packages Scanned", value: "128", change: "+12%", icon: "📦", color: "text-amber-600", bg: "bg-amber-50 border-amber-100", up: true },
           { title: "Compliant", value: "94", change: "+18%", icon: "✓", color: "text-green-600", bg: "bg-green-50 border-green-100", up: true },
           { title: "Flagged", value: "24", change: "-6%", icon: "⚠️", color: "text-red-600", bg: "bg-red-50 border-red-100", up: false },
           { title: "Pending Review", value: "10", change: "-20%", icon: "⏳", color: "text-purple-600", bg: "bg-purple-50 border-purple-100", up: false },
           { title: "Compliance Rate", value: "73.4%", change: "+9%", icon: "🛡️", color: "text-blue-600", bg: "bg-blue-50 border-blue-100", up: true },
         ].map((kpi, i) => (
           <div key={i} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
             <div className={`w-12 h-12 rounded-2xl ${kpi.bg} ${kpi.color} border flex items-center justify-center text-2xl mb-5 shadow-sm`}>
               {kpi.icon}
             </div>
             <div>
               <div className="flex items-end justify-between mb-1.5">
                 <h3 className="text-3xl font-black text-[#11213d]">{kpi.value}</h3>
                 <span className={`text-[11px] font-black ${kpi.up ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-lg flex items-center gap-0.5`}>
                   {kpi.up ? '↑' : '↓'} {kpi.change}
                 </span>
               </div>
               <div className="flex items-center justify-between">
                 <p className="text-xs text-slate-500 font-bold">{kpi.title}</p>
                 <p className="text-[9px] font-medium text-slate-400">vs. last 7 days</p>
               </div>
             </div>
           </div>
         ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-[#11213d] flex items-center gap-2 text-sm"><span className="text-blue-600 text-lg">📈</span> Compliance Trend — Last 7 Days</h3>
             <select className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 outline-none hover:bg-slate-100 cursor-pointer">
               <option>📅 Last 7 Days</option>
             </select>
          </div>
          {/* Chart Graphic Simulation */}
          <div className="flex-1 w-full flex items-end gap-2 relative min-h-[220px]">
             <div className="absolute inset-0 flex flex-col justify-between opacity-5 pointer-events-none pb-6">
                {[1,2,3,4,5,6].map(x=><div key={x} className="border-t-2 border-dashed border-slate-800 w-full"></div>)}
             </div>
             
             {/* Simple visual representation of line chart for aesthetics */}
             <div className="absolute top-4 right-4 flex items-center gap-4 text-[9px] font-bold text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Scanned</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Compliant</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Flagged</span>
             </div>
             
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                    <polyline points="0,40 20,35 40,30 60,25 80,10 100,15" fill="none" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="0,45 20,40 40,38 60,32 80,15 100,20" fill="none" stroke="#22c55e" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1,1"/>
                    <polyline points="0,48 20,47 40,48 60,45 80,42 100,44" fill="none" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1,1"/>
                 </svg>
             </div>
             
             {/* X axis labels */}
             <div className="absolute bottom-0 left-0 w-full flex justify-between text-[8px] font-bold text-slate-400 px-2">
                <span>May 6</span><span>May 7</span><span>May 8</span><span>May 9</span><span>May 10</span><span>May 11</span><span>May 12</span>
             </div>
          </div>
        </div>
        
        <div className="col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-[#11213d] flex items-center gap-2 text-sm"><span className="text-purple-600 text-lg">⚠️</span> Violations by Category</h3>
             <select className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-600 outline-none hover:bg-slate-100 cursor-pointer">
               <option>All Categories</option>
             </select>
          </div>
          {/* Donut Chart Simulation */}
          <div className="flex-1 w-full flex flex-col items-center justify-center relative pt-2">
             <div className="w-36 h-36 rounded-full border-[14px] border-[#3b82f6] border-r-[#8b5cf6] border-b-[#f59e0b] border-l-[#ef4444] flex items-center justify-center shadow-inner">
                <div className="text-center">
                  <p className="text-2xl font-black text-[#11213d]">24</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total Violations</p>
                </div>
             </div>
             <div className="w-full mt-8 space-y-3">
               {[
                 { label: "Labeling Defect", count: 9, pct: "37.5%", color: "bg-[#ef4444]" },
                 { label: "Net Quantity", count: 5, pct: "20.8%", color: "bg-[#f59e0b]" },
                 { label: "MRP Mismatch", count: 4, pct: "16.7%", color: "bg-[#3b82f6]" },
                 { label: "Packaged Commodity", count: 3, pct: "12.5%", color: "bg-[#8b5cf6]" },
                 { label: "Other", count: 3, pct: "12.5%", color: "bg-[#10b981]" }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between text-xs font-semibold">
                   <div className="flex items-center gap-3">
                     <span className={`w-2.5 h-2.5 rounded-full ${item.color}`}></span>
                     <span className="text-slate-600">{item.label}</span>
                   </div>
                   <div className="text-right flex items-center gap-2">
                     <span className="font-black text-slate-800">{item.count}</span>
                     <span className="text-[9px] text-slate-400 w-10 text-right">({item.pct})</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
      
      {/* Bottom footer wave decoration */}
      <div className="pt-6 pb-2 flex flex-col items-center justify-center relative">
         <div className="flex items-center gap-6 text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-3 relative z-10">
            <span>Safe Consumers</span>
            <span className="w-px h-3 bg-slate-300"></span>
            <span>Fair Trade</span>
            <span className="w-px h-3 bg-slate-300"></span>
            <span>Stronger India</span>
         </div>
         <div className="flex w-64 h-1 rounded-full overflow-hidden opacity-30 shadow-sm relative z-10">
            <div className="flex-1 bg-orange-500"></div>
            <div className="flex-1 bg-white"></div>
            <div className="flex-1 bg-green-500"></div>
         </div>
      </div>

    </div>
  );
}
