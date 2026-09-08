"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU = [
  { name: "Dashboard", href: "/", icon: "🏠" },
  { name: "Scan Package", href: "/scan", icon: "📷", badge: "NEW" },
  { name: "Inspections", href: "/inspections", icon: "🔍" },
  { name: "Violations", href: "/violations", icon: "⚠️" },
  { name: "Products", href: "/products", icon: "📦" },
  { name: "Manufacturers", href: "/manufacturers", icon: "🏭" },
  { name: "Analytics", href: "/analytics", icon: "📊" },
  { name: "Reports", href: "/reports", icon: "📄" },
];

export default function Sidebar() {
  const pathname = usePathname();
  
  return (
    <aside className="w-64 bg-[#11213d] text-white flex flex-col fixed h-full z-40 border-r border-[#1e3a8a]/30 font-sans shadow-xl">
      <div className="p-6 pb-5 flex flex-col items-center gap-4 border-b border-white/5 relative overflow-hidden bg-[#0f1c35]">
        <div className="absolute top-0 left-0 w-full h-1.5 flex">
           <div className="flex-1 bg-orange-500"></div><div className="flex-1 bg-white"></div><div className="flex-1 bg-green-500"></div>
        </div>
        <div className="flex items-center gap-3 w-full">
            <img src="/emblem.svg" alt="Emblem" className="w-10 h-12 object-contain brightness-0 invert opacity-90" onError={e=>e.target.style.display='none'}/>
            <div>
               <h1 className="text-[13px] font-black leading-tight tracking-wide text-white">भारत सरकार<br/>Government of India</h1>
               <p className="text-[7.5px] font-semibold text-slate-400 mt-1 leading-tight">Ministry of Consumer Affairs,<br/>Food & Public Distribution</p>
            </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
        <p className="px-7 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Main Menu</p>
        <nav className="space-y-1.5 px-4">
          {MENU.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[13px] transition-all group ${active ? "bg-white text-[#11213d] font-black shadow-lg" : "text-slate-300 font-semibold hover:text-white hover:bg-white/10"}`}>
                <span className={`text-[18px] transition-transform ${active ? "opacity-100 scale-110" : "opacity-80 group-hover:scale-110"}`}>{item.icon}</span>
                <span className="flex-1">{item.name}</span>
                {item.badge && <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${active ? "bg-amber-500 text-white" : "bg-amber-500/80 text-white"}`}>{item.badge}</span>}
              </Link>
            );
          })}
        </nav>
        
        <p className="px-7 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-8 mb-3">System</p>
        <nav className="space-y-1.5 px-4">
          <Link href="/settings" className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[13px] font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all group">
             <span className="text-[18px] opacity-80 group-hover:scale-110 transition-transform">⚙️</span> Settings
          </Link>
        </nav>
      </div>

      <div className="relative overflow-hidden p-5 pt-6 border-t border-white/5 bg-[#0a1428]">
        {/* Abstract tricolor wave graphic at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-20 opacity-20 flex flex-col transform -skew-y-6 origin-bottom-left scale-125 pointer-events-none">
           <div className="h-1/3 bg-orange-500"></div><div className="h-1/3 bg-white"></div><div className="h-1/3 bg-green-500"></div>
        </div>
        <div className="relative z-10 flex items-center gap-3 bg-white/5 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-inner border border-white/20 flex-shrink-0 text-sm">
            👤
          </div>
          <div className="overflow-hidden">
            <p className="text-[13px] font-black text-white truncate">Guest</p>
            <p className="text-[9px] font-semibold text-blue-200 truncate">Legal Metrology Dept.</p>
            <p className="text-[7.5px] font-medium text-slate-400 mt-1 truncate">SIH 2026 - PS-034 - Team LegalLens</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
