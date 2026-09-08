import "./globals.css";
import LayoutClient from "../components/LayoutClient";

export const metadata = {
  title: "LegalLens — Packaged Commodity Compliance System",
  description: "SIH 2026 PS-034 — AI-Assisted Legal Metrology Compliance Inspection Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
