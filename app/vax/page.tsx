"use client";

import { useState } from "react";
import Link from "next/link";
import Meny from "@/components/Meny";
import { lektioner as startLektioner, badges } from "@/data/lektioner";

/*
  Väx – "Duolingo för anställningsbarhet".
  Mikro-lektioner som ger XP + streak, badges arbetsgivare litar på,
  och ingång till AI-karriärcoachen. Den dagliga vanan.
*/

export default function Vax() {
  const [lektioner, setLektioner] = useState(startLektioner);
  const klara = lektioner.filter((l) => l.klar).length;
  const xp = lektioner.filter((l) => l.klar).reduce((s, l) => s + l.xp, 0);
  const dagsmal = 3;

  function klaraLektion(id: string) {
    setLektioner((ls) => ls.map((l) => (l.id === id ? { ...l, klar: true, last: false } : l)));
  }

  return (
    <main className="relative flex-1 overflow-x-hidden bg-bg">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="anim-float absolute -top-20 -left-16 h-64 w-64 rounded-full bg-violet/20 blur-[90px]" />
      </div>

      <div className="relative mx-auto min-h-[100svh] max-w-md px-5 pb-28 pt-7">
        <h1 className="text-2xl font-extrabold tracking-tight">Väx</h1>
        <p className="mt-1 text-sm text-mute">2 minuter om dagen gör dig anställningsbar.</p>

        {/* Streak + dagsmål */}
        <div className="mt-4 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-flame/15 px-4 py-3">
            <span className="text-2xl">🔥</span>
            <span className="text-lg font-extrabold">5</span>
            <span className="text-[10px] text-mute">dagar</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Dagens mål</span>
              <span className="text-mute">
                {Math.min(klara, dagsmal)}/{dagsmal} lektioner
              </span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-brand transition-all duration-500"
                style={{ width: `${Math.min((klara / dagsmal) * 100, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-mute">
              ⭐ {xp} XP totalt · Nivå {Math.floor(xp / 50) + 1}
            </p>
          </div>
        </div>

        {/* AI-coach-ingång */}
        <Link
          href="/coach"
          className="mt-5 flex items-center gap-3 rounded-3xl border border-white/10 p-4 transition hover:brightness-110 bg-brand-soft"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-2xl">🤖</span>
          <div className="flex-1">
            <p className="font-bold">Fråga din AI-karriärcoach</p>
            <p className="text-sm text-mute">”Får jag jobba 14 år?” · ”Vad säger jag till chefen?”</p>
          </div>
          <span className="text-mute">→</span>
        </Link>

        {/* Studio – AI-bildredigerare */}
        <Link
          href="/redigera"
          className="mt-3 flex items-center gap-3 rounded-3xl border border-white/10 p-4 transition hover:brightness-110 bg-brand-soft"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-2xl">🎨</span>
          <div className="flex-1">
            <p className="font-bold">Redigera bilder i Studio</p>
            <p className="text-sm text-mute">Berätta hur du vill ha bilden – Vibe fixar stämningen.</p>
          </div>
          <span className="text-mute">→</span>
        </Link>

        {/* Lektionsstig */}
        <h2 className="mt-6 text-lg font-bold">Din stig</h2>
        <div className="mt-3 flex flex-col gap-3">
          {lektioner.map((l) => (
            <div
              key={l.id}
              className={`flex items-center gap-3 rounded-2xl border p-3.5 ${
                l.klar ? "border-frisk/30 bg-frisk/5" : "border-white/10 bg-white/5"
              }`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl">
                {l.klar ? "✅" : l.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`truncate font-semibold ${l.klar ? "text-mute line-through" : ""}`}>
                  {l.titel}
                </p>
                <p className="text-xs text-mute">
                  {l.minuter} min · +{l.xp} XP
                </p>
              </div>
              {l.klar ? (
                <span className="shrink-0 text-xs font-bold text-frisk">Klar</span>
              ) : (
                <button
                  type="button"
                  onClick={() => klaraLektion(l.id)}
                  className="bg-brand shrink-0 rounded-full px-4 py-2 text-xs font-bold text-white transition hover:brightness-110 active:scale-95"
                >
                  Starta
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Badges */}
        <h2 className="mt-7 text-lg font-bold">Dina badges</h2>
        <p className="text-sm text-mute">Bevisar för arbetsgivare vad du går för.</p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-center ${
                b.upplast ? "border-white/10 bg-white/5" : "border-white/5 bg-white/[0.02] opacity-40"
              }`}
            >
              <span className="text-2xl">{b.upplast ? b.emoji : "🔒"}</span>
              <span className="text-[11px] font-semibold leading-tight">{b.titel}</span>
            </div>
          ))}
        </div>
      </div>

      <Meny />
    </main>
  );
}
