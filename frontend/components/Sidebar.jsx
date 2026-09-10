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
  { name: "Laws & Rules", href: "/laws", icon: "📜" },
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
    <aside className="w-[240px] bg-[#0B1F3A] text-white flex flex-col fixed h-full z-40 font-sans shadow-[4px_0_24px_rgba(0,0,0,0.06)] border-r border-[#1557C0]/20">
      {/* Header */}
      <div className="p-5 pb-4 flex flex-col gap-3 relative overflow-hidden bg-[#10264A]">
        {/* Tricolour Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 flex">
           <div className="flex-1 bg-[#F59E0B]"></div>
           <div className="flex-1 bg-white"></div>
           <div className="flex-1 bg-[#16A34A]"></div>
        </div>
        
        <div className="flex items-center gap-3 w-full mt-1 relative z-10">
            <img src="/emblem.svg" alt="Emblem" className="w-10 h-12 object-contain filter drop-shadow-md"/>
            <div>
               <h1 className="text-[14px] font-black leading-tight text-white tracking-wide">LegalLens</h1>
               <p className="text-[9px] font-bold text-[#D9A928] tracking-widest uppercase mt-0.5 opacity-90">Compliance System</p>
            </div>
        </div>
      </div>
      
      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-5 custom-scrollbar relative">
        <div className="px-5 mb-2 flex items-center gap-2">
           <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Main Menu</p>
        </div>
        
        <nav className="space-y-1.5 px-3 relative z-10">
          {MENU.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] transition-all group ${active ? "bg-[#1557C0] text-white font-bold shadow-md border border-white/10" : "text-[#D9E1EC] font-medium hover:text-white hover:bg-white/5"}`}>
                <span className={`text-[16px] ${active ? "opacity-100 drop-shadow-sm" : "opacity-70 group-hover:opacity-100"}`}>{item.icon}</span>
                <span className="flex-1">{item.name}</span>
                {item.badge && <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-[#D9A928] text-[#10264A] shadow-sm">{item.badge}</span>}
              </Link>
            );
          })}
        </nav>
        
        <div className="px-5 mt-8 mb-2">
           <div className="w-full h-px bg-white/10 mb-4"></div>
           <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">System</p>
        </div>
        <nav className="space-y-1.5 px-3 relative z-10">
          <Link href="/admin" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium text-[#D9E1EC] hover:text-white hover:bg-white/5 transition-all group">
             <span className="text-[16px] opacity-70">🛡️</span> Admin Panel
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium text-[#D9E1EC] hover:text-white hover:bg-white/5 transition-all group">
             <span className="text-[16px] opacity-70">⚙️</span> Settings
          </Link>
        </nav>
        
        {/* Very faint watermark in sidebar */}
        <img src="/emblem.svg" alt="" className="absolute -bottom-10 -right-10 w-48 h-64 object-contain opacity-[0.03] pointer-events-none filter sepia hue-rotate-15 saturate-150"/>
      </div>

      {/* User Profile + Logout */}
      <div className="p-4 pt-4 border-t border-white/10 bg-[#0B1F3A] relative overflow-hidden">
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1557C0] to-[#10264A] flex items-center justify-center text-white font-black text-sm flex-shrink-0 border border-white/20 shadow-inner">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-[12px] font-bold text-white truncate">{username}</p>
              <p className="text-[9px] font-medium text-[#D9E1EC]/80 truncate">{role || "Legal Metrology Dept."}</p>
            </div>
          </div>
          
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-[#10264A] hover:bg-[#1557C0] text-white border border-white/10 rounded-lg py-2.5 text-[11px] font-bold transition-all active:scale-95 shadow-sm group">
            <svg className="w-3.5 h-3.5 text-[#D9A928] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Secure Logout
          </button>
        </div>
        <p className="text-[8px] font-medium text-[#64748B] mt-4 text-center">SIH 2026 · PS-034 · Team LegalLens</p>
      </div>
    </aside>
  );
}
