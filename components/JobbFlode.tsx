"use client";

import { useRef, useState } from "react";
import Jobbkort from "@/components/Jobbkort";
import Meny from "@/components/Meny";
import type { Jobb } from "@/data/jobb";

/*
  JobbFlode – den scrollande bunten med jobbkort.
  Följer scrollen för att visa en story-stil progressrad högst upp,
  så man hela tiden ser hur långt man kommit (driver "en till"-känslan).
*/

export default function JobbFlode({ jobb }: { jobb: Jobb[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [aktiv, setAktiv] = useState(0);
  const totalt = jobb.length;

  function vidScroll() {
    const el = ref.current;
    if (!el) return;
    const index = Math.round(el.scrollTop / el.clientHeight);
    if (index !== aktiv) setAktiv(Math.min(index, totalt));
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
          <Jobbkort key={j.id} jobb={j} />
        ))}

        {/* Slutvy */}
        <section className="flex h-[100svh] snap-start flex-col items-center justify-center gap-4 bg-bg px-8 text-center">
          <span className="anim-float text-6xl">🎉</span>
          <h2 className="text-2xl font-extrabold">Du har sett alla jobb!</h2>
          <p className="max-w-xs text-mute">
            Nya jobb dyker upp hela tiden. Slå på notiser så missar du inget.
          </p>
          <button
            type="button"
            onClick={() => ref.current?.scrollTo({ top: 0, behavior: "smooth" })}
            className="glas mt-2 rounded-2xl px-6 py-3 font-semibold"
          >
            ↑ Börja om från toppen
          </button>
        </section>
      </div>

      <Meny />
    </div>
  );
}
