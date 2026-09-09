"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
  const router = useRouter();
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("full_name");
    router.push("/login");
  };

  const username = typeof window !== "undefined" ? localStorage.getItem("username") || "Guest" : "Guest";
  const role = typeof window !== "undefined" ? localStorage.getItem("role") || "" : "";
  
  return (
    <aside className="w-64 bg-[#11213d] text-white flex flex-col fixed h-full z-40 border-r border-[#1e3a8a]/30 font-sans shadow-xl">
      {/* Header */}
      <div className="p-5 pb-4 flex flex-col items-center gap-3 border-b border-white/5 relative overflow-hidden bg-[#0f1c35]">
        <div className="absolute top-0 left-0 w-full h-1.5 flex">
           <div className="flex-1 bg-orange-500"></div><div className="flex-1 bg-white"></div><div className="flex-1 bg-green-500"></div>
        </div>
        <div className="flex items-center gap-3 w-full mt-1">
            <img src="/emblem.svg" alt="Emblem" className="w-10 h-12 object-contain brightness-0 invert opacity-90"/>
            <div>
               <h1 className="text-[12px] font-black leading-tight tracking-wide text-white">भारत सरकार<br/>Government of India</h1>
               <p className="text-[7px] font-semibold text-slate-400 mt-1 leading-tight">Ministry of Consumer Affairs,<br/>Food &amp; Public Distribution</p>
            </div>
        </div>
      </div>
      
      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-5">
        <p className="px-6 text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">Main Menu</p>
        <nav className="space-y-1 px-3">
          {MENU.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] transition-all group ${active ? "bg-white text-[#11213d] font-black shadow-lg" : "text-slate-300 font-semibold hover:text-white hover:bg-white/10"}`}>
                <span className={`text-[17px] transition-transform ${active ? "opacity-100 scale-110" : "opacity-80 group-hover:scale-110"}`}>{item.icon}</span>
                <span className="flex-1">{item.name}</span>
                {item.badge && <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-amber-500 text-white">{item.badge}</span>}
              </Link>
            );
          })}
        </nav>
        
        <p className="px-6 text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-6 mb-2.5">System</p>
        <nav className="space-y-1 px-3">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all group">
             <span className="text-[17px] opacity-80">🛡️</span> Admin Panel
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all group">
             <span className="text-[17px] opacity-80">⚙️</span> Settings
          </Link>
        </nav>
      </div>

      {/* User Profile + Logout */}
      <div className="relative overflow-hidden p-4 pt-4 border-t border-white/5 bg-[#0a1428]">
        <div className="relative z-10 flex items-center gap-3 bg-white/5 p-3 rounded-xl backdrop-blur-sm border border-white/10 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-inner border border-white/20 flex-shrink-0 text-xs">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-[12px] font-black text-white truncate">{username}</p>
            <p className="text-[8px] font-semibold text-blue-200 truncate">{role || "Legal Metrology Dept."}</p>
          </div>
        </div>
        
        {/* LOGOUT BUTTON */}
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-red-200 border border-red-500/30 rounded-xl py-2.5 text-[12px] font-bold transition-all active:scale-95">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Logout
        </button>
        
        <p className="text-[7px] font-medium text-slate-500 mt-2.5 text-center">SIH 2026 - PS-034 - Team LegalLens</p>
      </div>
    </aside>
  );
}
