"use client";

import { useState } from "react";
import Meny from "@/components/Meny";
import { gigs } from "@/data/gig";

/*
  Tjäna – den icke-episodiska kroken.
  Gig du kan göra IDAG + din intjäning (plånbok). En anledning att
  öppna appen varje dag även när man inte söker ett fast jobb.
*/

export default function Tjana() {
  const [bokade, setBokade] = useState<Record<string, boolean>>({});

  function toggla(id: string) {
    setBokade((b) => ({ ...b, [id]: !b[id] }));
  }

  return (
    <main className="relative flex-1 overflow-x-hidden bg-bg">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="anim-float absolute -top-20 -right-16 h-64 w-64 rounded-full bg-flame/20 blur-[90px]" />
      </div>

      <div className="relative mx-auto min-h-[100svh] max-w-md px-5 pb-28 pt-7">
        <h1 className="text-2xl font-extrabold tracking-tight">Tjäna</h1>
        <p className="mt-1 text-sm text-mute">Snabba gig nära dig. Få betalt samma dag.</p>

        {/* Plånbok / intjäning */}
        <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 p-5 bg-brand-anim">
          <p className="text-sm font-semibold text-white/80">Din intjäning i år</p>
          <p className="mt-1 text-4xl font-extrabold text-white">8 450 kr</p>
          <div className="mt-4 flex gap-3">
            <div className="flex-1 rounded-2xl bg-black/20 px-3 py-2 backdrop-blur">
              <p className="text-lg font-extrabold text-white">12</p>
              <p className="text-[11px] text-white/80">gig klara</p>
            </div>
            <div className="flex-1 rounded-2xl bg-black/20 px-3 py-2 backdrop-blur">
              <p className="text-lg font-extrabold text-white">1 200 kr</p>
              <p className="text-[11px] text-white/80">denna månad</p>
            </div>
            <div className="flex-1 rounded-2xl bg-black/20 px-3 py-2 backdrop-blur">
              <p className="text-lg font-extrabold text-white">⭐ 4,9</p>
              <p className="text-[11px] text-white/80">betyg</p>
            </div>
          </div>
        </div>

        {/* Gig idag */}
        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-lg font-bold">⚡ Tjäna idag</h2>
          <span className="rounded-full bg-frisk/15 px-2.5 py-1 text-xs font-bold text-frisk">
            {gigs.length} nära dig
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-3">
          {gigs.map((g) => {
            const bokat = !!bokade[g.id];
            return (
              <div
                key={g.id}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl">
                  {g.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{g.titel}</p>
                  <p className="truncate text-sm text-mute">
                    {g.vem} · {g.avstandKm} km · {g.tid}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-mute">🕐 {g.nar}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="font-extrabold text-brand">{g.ersattning}</span>
                  <button
                    type="button"
                    onClick={() => toggla(g.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                      bokat ? "bg-frisk text-white" : "bg-brand text-white hover:brightness-110"
                    }`}
                  >
                    {bokat ? "Bokat ✓" : "Ta gig"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Meny />
    </main>
  );
}
