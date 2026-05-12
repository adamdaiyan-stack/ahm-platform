"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/market",   label: "Market",   active: "text-violet-400",  hover: "hover:text-violet-300"  },
  { href: "/stocks",   label: "Stocks",   active: "text-emerald-400", hover: "hover:text-emerald-300" },
  { href: "/sectors",  label: "Sectors",  active: "text-blue-400",    hover: "hover:text-blue-300"    },
  { href: "/research", label: "Research", active: "text-amber-400",   hover: "hover:text-amber-300"   },
  { href: "/learn",    label: "Learn",    active: "text-gray-200",    hover: "hover:text-white"       },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
        >
          <span className="text-xs font-mono text-gray-600 uppercase tracking-widest group-hover:text-gray-400 transition-colors">
            AHM
          </span>
          <span className="w-px h-3 bg-gray-700" />
          <span className="text-xs font-mono text-gray-500 group-hover:text-gray-300 transition-colors">
            Platform
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {NAV.map(({ href, label, active, hover }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(href + "/");

            return (
              <Link
                key={href}
                href={href}
                className={`
                  px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-widest transition-colors
                  ${isActive ? active : `text-gray-600 ${hover}`}
                `}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
