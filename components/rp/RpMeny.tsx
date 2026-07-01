"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const lankar = [
  { href: "/resellpilot/dashboard", emoji: "📊", text: "Översikt" },
  { href: "/resellpilot/nytt", emoji: "📷", text: "Nytt plagg" },
  { href: "/resellpilot/sourcing", emoji: "💡", text: "Sourcing" },
  { href: "/resellpilot/kalkylator", emoji: "🧮", text: "Kalkylator" },
];

export default function RpMeny() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-around px-1 py-2">
        {lankar.map((lank) => {
          const aktiv = pathname === lank.href;
          return (
            <Link
              key={lank.href}
              href={lank.href}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-semibold transition ${
                aktiv ? "text-emerald-600" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              <span className="text-lg">{lank.emoji}</span>
              <span>{lank.text}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
