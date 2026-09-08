"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import OllamaAgentWidget from "./OllamaAgentWidget";

export default function LayoutClient({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen relative z-10">
        <TopNav />
        <main className="flex-1 p-8 relative z-10 overflow-x-hidden">
          {children}
        </main>
      </div>
      <OllamaAgentWidget />
    </div>
  );
}
