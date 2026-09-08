"use client";
import { useState } from "react";
import { isLoggedIn, getUsername, getRole } from "../lib/auth";

export default function TopNav({ title, subtitle }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center justify-between px-6 py-3">
        <div>
          <h1 className="text-lg font-bold text-slate-800">{title || "Dashboard"}</h1>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search inspections..."
              className="w-52 bg-slate-100 border-0 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:w-72 transition-all"
            />
          </div>
          {/* Notifications */}
          <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <span className="text-lg">🔔</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          {/* Profile */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">{(getUsername() || "G")[0].toUpperCase()}</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-700">{getUsername() || "Guest"}</p>
              <p className="text-[10px] text-slate-400">{getRole() || "Viewer"}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
