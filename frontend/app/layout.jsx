import "./globals.css";
import Navbar from "../components/Navbar";
import EmblemWatermark from "../components/EmblemWatermark";
import OllamaAgentWidget from "../components/OllamaAgentWidget";

export const metadata = {
  title: "LegalLens — Legal Metrology Compliance Inspector",
  description: "SIH 2026 PS-034 — Automated Legal Metrology Compliance Architecture, Ministry of Consumer Affairs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <EmblemWatermark />
        <div className="page-shell min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-1">{children}</div>
          <footer className="text-center py-4 text-xs text-ink/40 font-ui border-t border-gold/20">
            LegalLens · SIH 2026 · Problem Statement 034 · Ministry of Consumer Affairs, Government of India
          </footer>
        </div>
        <OllamaAgentWidget />
      </body>
    </html>
  );
}
