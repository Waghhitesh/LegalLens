"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NotificationBell from "./NotificationBell";

export default function TopNav() {
  const router = useRouter();
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "Guest");
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("full_name");
    router.push("/login");
  };
  
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-sm font-sans h-[66px]">
      <div className="flex items-center gap-4">
         <div className="flex items-center gap-2.5">
            <img src="/emblem.svg" alt="Emblem" className="w-9 h-11 object-contain"/>
            <div>
               <p className="text-[11px] font-extrabold text-[#0c1a36] leading-tight">भारत सरकार</p>
               <p className="text-[10px] font-bold text-[#0c1a36] leading-tight">Government of India</p>
               <p className="text-[7px] font-medium text-slate-400 mt-0.5">Ministry of Consumer Affairs, Food &amp; Public Distribution</p>
            </div>
         </div>
      </div>
      
      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-2">
           <span className="text-[26px]">💡</span>
           <div className="text-[9px] font-black text-[#0c1a36] leading-none tracking-widest uppercase">SMART INDIA<br/>HACKATHON<br/>2026</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <input type="text" placeholder="Search inspections..." 
            className="bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-[12px] font-medium w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400" />
          <svg className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
        
        <NotificationBell />
        
        <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
           <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-black text-[12px]">
             {username.charAt(0).toUpperCase()}
           </div>
           <div>
             <p className="font-bold text-slate-700 text-[11px] leading-tight">{username}</p>
             <p className="text-[8px] font-medium text-slate-400">Viewer</p>
           </div>
        </div>
        
        <button onClick={handleLogout}
          className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg px-2.5 py-1.5 text-[10px] font-bold transition-all active:scale-95"
          title="Logout">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Logout
        </button>
      </div>
    </header>
  );
}
