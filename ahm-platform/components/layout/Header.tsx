"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/market",   label: "Market",   active: "text-violet-400",  hover: "hover:text-violet-300"  },
  { href: "/stocks",   label: "Stocks",   active: "text-emerald-400", hover: "hover:text-emerald-300" },
  { href: "/sectors",  label: "Sectors",  active: "text-blue-400",    hover: "hover:text-blue-300"    },
  { href: "/research", label: "Research", active: "text-amber-400",   hover: "hover:text-amber-300"   },
  { href: "/learn",    label: "Learn",    active: "text-tx-primary",  hover: "hover:text-tx-primary"  },
];

const WA_LINK = "https://wa.me/923001234567?text=Hi%2C%20I%27d%20like%20to%20get%20daily%20PSX%20updates%20on%20WhatsApp";

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Read saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("ahm-theme");
    const current = document.documentElement.getAttribute("data-theme");
    setTheme((saved as "dark" | "light") || (current as "dark" | "light") || "dark");
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("ahm-theme", next);
  }

  return (
    <header className="sticky top-0 z-50 bg-base border-b border-border-theme">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <span className="text-xs font-mono text-tx-secondary uppercase tracking-widest group-hover:text-tx-primary transition-colors">
            AHM
          </span>
          <span className="w-px h-3 bg-border-theme" />
          <span className="text-xs font-mono text-tx-secondary group-hover:text-tx-primary transition-colors">
            Platform
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1 flex-1">
          {NAV.map(({ href, label, active, hover }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-widest transition-colors ${
                  isActive ? active : `text-tx-secondary ${hover}`
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTAs */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-tx-secondary hover:text-tx-primary hover:bg-surface transition-all"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* WhatsApp */}
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all uppercase tracking-widest"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.863L.057 23.886a.5.5 0 0 0 .609.61l6.101-1.526A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.511-5.188-1.402l-.373-.22-3.87.968.999-3.793-.242-.389A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            WhatsApp
          </a>

          {/* Open Account */}
          <Link
            href="/open-account"
            className="text-xs font-mono px-3 py-1.5 rounded-lg bg-tx-primary text-base hover:opacity-90 transition-opacity font-bold uppercase tracking-widest"
          >
            Open Account
          </Link>
        </div>
      </div>
    </header>
  );
}
