"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/*
  Meny = fast bottenmeny (glas, mörkt tema) – den nya 5-delade arkitekturen:
  Flöde · Utforska · Tjäna · Väx · Profil.
*/

const lankar = [
  { href: "/jobb", emoji: "🏠", text: "Flöde" },
  { href: "/utforska", emoji: "🔍", text: "Utforska" },
  { href: "/tjana", emoji: "⚡", text: "Tjäna" },
  { href: "/vax", emoji: "🎓", text: "Väx" },
  { href: "/profil", emoji: "👤", text: "Profil" },
];

export default function Meny() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md">
      <div className="glas m-3 flex items-center justify-around rounded-2xl px-1.5 py-2 shadow-2xl">
        {lankar.map((lank) => {
          const aktiv = pathname === lank.href;
          return (
            <Link
              key={lank.href}
              href={lank.href}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-semibold transition ${
                aktiv ? "text-text" : "text-mute hover:text-text"
              }`}
            >
              <span className={`text-lg transition ${aktiv ? "scale-110" : ""}`}>
                {lank.emoji}
              </span>
              <span className={aktiv ? "text-brand" : ""}>{lank.text}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
