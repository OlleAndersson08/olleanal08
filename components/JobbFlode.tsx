"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Jobbkort from "@/components/Jobbkort";
import Meny from "@/components/Meny";
import type { Mojlighet } from "@/data/mojligheter";

/*
  JobbFlode – det kuraterade "För dig"-flödet med möjlighetskort (alla kategorier).
  Följer scrollen för att visa en story-stil progressrad högst upp,
  så man hela tiden ser hur långt man kommit (driver "en till"-känslan).
*/

export default function JobbFlode({
  jobb,
  ansokta = [],
  inloggad = false,
}: {
  jobb: Mojlighet[];
  ansokta?: string[];
  inloggad?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [aktiv, setAktiv] = useState(0);
  const totalt = jobb.length;

  function vidScroll() {
    const el = ref.current;
    if (!el) return;
    const index = Math.round(el.scrollTop / el.clientHeight);
    if (index !== aktiv) setAktiv(Math.min(index, totalt));
  }

  function delaAppen() {
    const data = {
      title: "SommarMatch",
      text: "Kolla in SommarMatch – svep dig till ett sommarjobb! 🔥",
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share(data).catch(() => {});
    }
  }

  return (
    <div className="relative mx-auto h-[100svh] max-w-md bg-bg">
      {/* Story-stil progressrad */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex gap-1.5 px-4 pt-3">
        {jobb.map((_, i) => (
          <span
            key={i}
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/25"
          >
            <span
              className="block h-full rounded-full bg-white transition-all duration-300"
              style={{ width: i <= aktiv ? "100%" : "0%" }}
            />
          </span>
        ))}
      </div>

      {/* Liten rubrik */}
      <div className="pointer-events-none absolute inset-x-0 top-6 z-40 flex justify-center">
        <span className="rounded-full bg-black/25 px-3 py-1 text-xs font-bold text-white backdrop-blur">
          🔥 För dig {aktiv < totalt ? `· ${aktiv + 1}/${totalt}` : ""}
        </span>
      </div>

      {/* Scrollande kort */}
      <div
        ref={ref}
        onScroll={vidScroll}
        className="no-scrollbar h-[100svh] snap-y snap-mandatory overflow-y-scroll"
      >
        {jobb.map((j) => (
          <Jobbkort key={j.id} jobb={j} redanAnsokt={ansokta.includes(j.id)} inloggad={inloggad} />
        ))}

        {/* Slutvy – håll flödet levande med nästa steg */}
        <section className="flex h-[100svh] snap-start flex-col items-center justify-center px-8 text-center">
          <span className="anim-float text-6xl">🎉</span>
          <h2 className="mt-4 text-2xl font-extrabold">Du har sett alla jobb!</h2>
          <p className="mt-2 max-w-xs text-mute">
            Nya jobb dyker upp hela tiden. Slå på notiser så missar du inget.
          </p>

          {/* Actionable nästa steg */}
          <div className="mt-7 flex w-full max-w-xs flex-col gap-3">
            <Link
              href="/profil"
              className="bg-brand group inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-bold text-white shadow-xl shadow-rose/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl active:scale-[0.97]"
            >
              ✨ Komplettera profilen för fler matchningar
            </Link>
            <button
              type="button"
              onClick={delaAppen}
              className="glas inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 active:scale-[0.97]"
            >
              📲 Dela appen med en vän
            </button>
          </div>

          <button
            type="button"
            onClick={() => ref.current?.scrollTo({ top: 0, behavior: "smooth" })}
            className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-mute transition hover:text-text"
          >
            <span className="transition-transform duration-200 group-hover:-translate-y-0.5">↑</span>
            Börja om från toppen
          </button>
        </section>
      </div>

      <Meny />
    </div>
  );
}
