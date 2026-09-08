import "./globals.css";
import Sidebar from "../components/Sidebar";
import OllamaAgentWidget from "../components/OllamaAgentWidget";

export const metadata = {
  title: "LegalLens — Packaged Commodity Compliance System",
  description: "SIH 2026 PS-034 — AI-Assisted Legal Metrology Compliance Inspection Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Ashoka Emblem Watermark */}
        <div className="ashoka-watermark" aria-hidden="true"></div>

        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64">
            {children}
          </main>
        </div>

        <OllamaAgentWidget />

        <footer className="ml-64 text-center py-3 text-[10px] text-slate-400 border-t border-slate-200 bg-white">
          LegalLens · Smart India Hackathon 2026 · Problem Statement 034 · Ministry of Consumer Affairs, Government of India
        </footer>
      </body>
    </html>
  );
}
