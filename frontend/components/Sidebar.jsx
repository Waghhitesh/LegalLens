"use client";
import { useState, useEffect } from "react";
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
  const [username, setUsername] = useState("Guest");
  const [role, setRole] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "Guest");
    setRole(localStorage.getItem("role") || "");
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("full_name");
    router.push("/login");
  };
  
  return (
    <aside className="w-[220px] bg-[#0c1a36] text-white flex flex-col fixed h-full z-40 font-sans shadow-xl">
      {/* Header */}
      <div className="p-4 pb-3 flex flex-col gap-3 border-b border-white/5 relative overflow-hidden bg-[#0a1630]">
        <div className="absolute top-0 left-0 w-full h-1 flex">
           <div className="flex-1 bg-orange-500"></div><div className="flex-1 bg-white"></div><div className="flex-1 bg-green-500"></div>
        </div>
        <div className="flex items-center gap-2.5 w-full mt-1">
            <img src="/emblem.svg" alt="Emblem" className="w-9 h-11 object-contain brightness-0 invert opacity-90"/>
            <div>
               <p className="text-[11px] font-extrabold leading-tight text-white">भारत सरकार</p>
               <p className="text-[10px] font-bold leading-tight text-white">Government of India</p>
               <p className="text-[7px] font-medium text-blue-300/70 mt-0.5 leading-tight">Ministry of Consumer Affairs,<br/>Food &amp; Public Distribution</p>
            </div>
        </div>
      </div>
      
      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-4">
        <p className="px-5 text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Main Menu</p>
        <nav className="space-y-0.5 px-2.5">
          {MENU.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] transition-all group ${active ? "bg-white text-[#0c1a36] font-black shadow-md" : "text-slate-300 font-semibold hover:text-white hover:bg-white/8"}`}>
                <span className={`text-[15px] ${active ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>{item.icon}</span>
                <span className="flex-1">{item.name}</span>
                {item.badge && <span className="text-[7px] font-black px-1.5 py-0.5 rounded-full bg-amber-500 text-white">{item.badge}</span>}
              </Link>
            );
          })}
        </nav>
        
        <p className="px-5 text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-5 mb-2">System</p>
        <nav className="space-y-0.5 px-2.5">
          <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-300 hover:text-white hover:bg-white/8 transition-all group">
             <span className="text-[15px] opacity-70">🛡️</span> Admin Panel
          </Link>
          <Link href="/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-300 hover:text-white hover:bg-white/8 transition-all group">
             <span className="text-[15px] opacity-70">⚙️</span> Settings
          </Link>
        </nav>
      </div>

      {/* User + Logout */}
      <div className="p-3 pt-3 border-t border-white/5 bg-[#081225]">
        <div className="flex items-center gap-2.5 bg-white/5 p-2.5 rounded-xl border border-white/5 mb-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-[11px] flex-shrink-0 border border-white/20">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-[11px] font-bold text-white truncate">{username}</p>
            <p className="text-[8px] font-medium text-blue-300/60 truncate">{role || "Legal Metrology Dept."}</p>
          </div>
        </div>
        
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-1.5 bg-red-500/15 hover:bg-red-500/30 text-red-300 hover:text-red-200 border border-red-500/20 rounded-xl py-2 text-[11px] font-bold transition-all active:scale-95">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Logout
        </button>
        <p className="text-[6.5px] font-medium text-slate-600 mt-2 text-center">SIH 2026 · PS-034 · Team LegalLens</p>
      </div>
    </aside>
  );
}
