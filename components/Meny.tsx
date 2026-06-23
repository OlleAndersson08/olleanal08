"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/*
  Meny = fasta menyn längst ner (som i TikTok/Instagram).
  Markerar vilken sida man är på just nu.
*/

const lankar = [
  { href: "/jobb", emoji: "🔥", text: "Jobb" },
  { href: "/profil", emoji: "👤", text: "Profil" },
];

export default function Meny() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md">
      <div className="m-3 flex items-center justify-around rounded-full border border-white/10 bg-natt/90 px-2 py-2 text-white shadow-2xl backdrop-blur-md">
        {lankar.map((lank) => {
          const aktiv = pathname === lank.href;
          return (
            <Link
              key={lank.href}
              href={lank.href}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-full py-2 text-xs font-medium transition ${
                aktiv ? "text-sol-ljus" : "text-white/60 hover:text-white"
              }`}
            >
              <span className="text-lg">{lank.emoji}</span>
              {lank.text}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
