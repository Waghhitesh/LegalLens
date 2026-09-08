"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import OllamaAgentWidget from "./OllamaAgentWidget";
import AshokaWatermark from "./AshokaWatermark";

export default function LayoutClient({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <AshokaWatermark />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64">
          {children}
        </main>
      </div>
      <OllamaAgentWidget />
      <footer className="ml-64 text-center py-3 text-[10px] text-slate-400 border-t border-slate-200 bg-white">
        LegalLens · Smart India Hackathon 2026 · PS-034 · Ministry of Consumer Affairs, Government of India
      </footer>
    </>
  );
}
