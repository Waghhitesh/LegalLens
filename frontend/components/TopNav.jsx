import NotificationBell from "./NotificationBell";

export default function TopNav() {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm font-sans h-20">
      <div className="flex items-center gap-6">
         <div className="flex items-center gap-3">
            <img src="/emblem.svg" alt="Emblem" className="w-10 h-12 object-contain" onError={e=>e.target.style.display='none'}/>
            <div>
               <h1 className="text-[13px] font-black text-[#11213d] leading-tight tracking-wide">भारत सरकार<br/>Government of India</h1>
               <p className="text-[8.5px] font-semibold text-slate-500 mt-0.5">Ministry of Consumer Affairs, Food & Public Distribution</p>
            </div>
         </div>
      </div>
      
      <div className="flex-1 flex justify-center ml-10">
        <div className="flex items-center gap-2">
           <span className="text-[32px] drop-shadow-sm flex items-center justify-center -mt-1"><span className="animate-pulse">💡</span></span>
           <div className="text-[11px] font-black text-[#11213d] leading-none tracking-widest uppercase">SMART INDIA<br/>HACKATHON<br/>2026</div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <input type="text" placeholder="Search inspections..." 
            className="bg-slate-50 border border-slate-200 rounded-full px-5 py-2.5 text-sm font-medium w-[280px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400 shadow-inner" />
          <span className="absolute right-4 top-2.5 text-slate-400 text-lg">🔍</span>
        </div>
        
        <div className="scale-110">
          <NotificationBell />
        </div>
        
        <div className="flex items-center gap-3 pl-6 border-l-2 border-slate-100">
           <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-black text-[15px] shadow-sm">G</div>
           <div>
             <p className="font-black text-slate-700 text-[13px] leading-tight">Guest</p>
             <p className="text-[10px] font-semibold text-slate-400">Viewer</p>
           </div>
        </div>
      </div>
    </header>
  );
}
