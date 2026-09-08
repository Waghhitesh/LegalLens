"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getRole, getUsername, isLoggedIn, logout } from "../lib/auth";

const ROLE_LABELS = {
  CITIZEN: "Citizen",
  ADMIN: "Admin",
  GOVERNMENT_OFFICIAL: "Government Official",
  COMPANY: "Company",
  SHOPKEEPER: "Shopkeeper",
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setRole(getRole());
    setUsername(getUsername());
  }, [pathname]);

  function handleLogout() {
    logout();
    router.push("/");
    router.refresh();
  }

  const navLink = (href, label) => (
    <Link
      href={href}
      className={`font-ui text-sm px-3 py-1.5 rounded-md transition-colors ${
        pathname === href
          ? "bg-gold/20 text-gold font-semibold"
          : "text-paper/85 hover:text-gold hover:bg-white/5"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="relative z-10 bg-navy border-b-2 border-gold/60">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-full border-2 border-gold flex items-center justify-center text-gold text-xs font-display font-bold">
              LM
            </span>
            <span className="font-display text-lg text-paper tracking-wide group-hover:text-gold transition-colors">
              Legal Metrology Compliance
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLink("/", "Inspector")}
            {navLink("/law", "The Law")}
            {loggedIn && role === "ADMIN" && navLink("/admin", "Admin")}

            {/* Login-as menu */}
            {!loggedIn ? (
              <div className="relative ml-3">
                <button
                  onClick={() => setRoleMenuOpen((v) => !v)}
                  onBlur={() => setTimeout(() => setRoleMenuOpen(false), 150)}
                  className="font-ui text-sm px-4 py-1.5 rounded-md bg-gold text-navy font-semibold hover:bg-gold-light transition-colors"
                >
                  Log in ↓
                </button>
                {roleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-paper border border-gold/50 rounded-lg shadow-xl overflow-hidden">
                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                      <Link
                        key={value}
                        href={`/login?role=${value}`}
                        className="block px-4 py-2.5 text-sm font-ui text-ink hover:bg-gold/15 border-b border-paper-dark last:border-b-0"
                      >
                        {label}
                      </Link>
                    ))}
                    <Link
                      href="/register"
                      className="block px-4 py-2.5 text-sm font-ui text-maroon font-semibold hover:bg-gold/15"
                    >
                      New here? Register →
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-3">
                <span className="font-ui text-xs text-paper/70">
                  {username} • <span className="text-gold">{ROLE_LABELS[role] || role}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="font-ui text-sm px-3 py-1.5 rounded-md border border-gold/50 text-paper hover:bg-gold/15 transition-colors"
                >
                  Log out
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
