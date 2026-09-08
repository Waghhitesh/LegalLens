"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { isLoggedIn, getRole, logout } from "../lib/auth";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/scan", label: "Scan Package", icon: "📷" },
  { href: "/inspections", label: "Inspections", icon: "🔍" },
  { href: "/violations", label: "Violations", icon: "🚩" },
  { href: "/products", label: "Products", icon: "📦" },
  { href: "/manufacturers", label: "Manufacturers", icon: "🏭" },
  { href: "/analytics", label: "Analytics", icon: "📈" },
  { href: "/reports", label: "Reports", icon: "📄" },
];

const BOTTOM_ITEMS = [
  { href: "/admin", label: "Admin Panel", icon: "🛡️" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const role = getRole();

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-navy flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gold to-yellow-600 rounded-xl flex items-center justify-center text-navy text-lg font-bold">⚖</div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight tracking-tight">LegalLens</h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest">Compliance System</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-semibold">Main Menu</p>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-link ${pathname === item.href ? "active" : ""}`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
            {item.href === "/scan" && (
              <span className="ml-auto bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>
            )}
          </Link>
        ))}

        <div className="my-4 border-t border-white/10" />

        <p className="px-3 text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-semibold">System</p>
        {BOTTOM_ITEMS.map((item) => {
          if (item.href === "/admin" && role !== "ADMIN") return null;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${pathname === item.href ? "active" : ""}`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">👤</div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{isLoggedIn() ? "Inspector" : "Guest"}</p>
            <p className="text-slate-400 text-[10px]">Legal Metrology Dept.</p>
          </div>
          {isLoggedIn() && (
            <button onClick={() => { logout(); window.location.href = "/login"; }}
              className="text-slate-400 hover:text-red-400 text-xs" title="Logout">🚪</button>
          )}
        </div>
        <p className="text-slate-500 text-[9px] mt-3 text-center">SIH 2026 · PS-034 · Team LegalLens</p>
      </div>
    </aside>
  );
}
