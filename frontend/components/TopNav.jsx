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
    <header className="bg-white border-b border-[#D9E1EC] px-6 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-sm font-sans h-[72px]">
      <div className="flex items-center gap-5">
         <div className="flex items-center gap-3 pr-5 border-r border-slate-200">
            {/* Government Emblem */}
            <img src="/emblem.svg" alt="Emblem" className="w-10 h-12 object-contain filter drop-shadow-sm"/>
            <div>
               <p className="text-[12px] font-black text-[#10264A] leading-tight">भारत सरकार</p>
               <p className="text-[11px] font-bold text-[#10264A] leading-tight mt-0.5">Government of India</p>
               <p className="text-[8px] font-semibold text-[#64748B] mt-0.5">Ministry of Consumer Affairs, Food &amp; Public Distribution</p>
            </div>
         </div>
      </div>
      
      <div className="flex-1 flex justify-center">
        {/* SIH Logo */}
        <div className="flex items-center">
           <img src="/sih-logo.svg" alt="SIH 2026 Logo" className="h-10 object-contain"/>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative hidden md:block">
          <input type="text" placeholder="Search inspections..." 
            className="bg-[#F5F7FB] border border-[#D9E1EC] rounded-lg px-4 py-2 text-[12px] font-medium w-[220px] focus:outline-none focus:ring-2 focus:ring-[#1557C0] focus:bg-white transition-all text-[#17233C] placeholder:text-[#64748B]" />
          <svg className="absolute right-3 top-2.5 w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
        
        <NotificationBell />
        
        <div className="flex items-center gap-3 pl-5 border-l border-[#D9E1EC]">
           <div className="w-9 h-9 rounded-full bg-[#F5F7FB] border border-[#D9E1EC] text-[#1557C0] flex items-center justify-center font-black text-[13px] shadow-sm">
             {username.charAt(0).toUpperCase()}
           </div>
           <div>
             <p className="font-bold text-[#17233C] text-[12px] leading-tight">{username}</p>
             <p className="text-[9px] font-medium text-[#64748B]">Viewer</p>
           </div>
        </div>
      </div>
    </header>
  );
}
