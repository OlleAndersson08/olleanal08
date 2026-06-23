"use client";

import { useState } from "react";
import type { Jobb } from "@/data/jobb";

/*
  Jobbkort = ett enda jobb som fyller hela skärmen (som ett TikTok-klipp).
  Knappen "Jag är intresserad" sparas lokalt för stunden (ingen databas än):
  när man trycker blir den grön och visar "Ansökan skickad ✓".
*/

export default function Jobbkort({ jobb }: { jobb: Jobb }) {
  const [intresserad, setIntresserad] = useState(false);

  return (
    <section
      className="relative flex h-[100svh] snap-start snap-always flex-col justify-end overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(160deg, ${jobb.fran}, ${jobb.till})`,
      }}
    >
      {/* Stor emoji som "bild" högt upp */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-1/2 items-center justify-center">
        <span className="text-[7rem] drop-shadow-lg">{jobb.emoji}</span>
      </div>

      {/* Mörk toning i botten så texten alltid syns */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Innehåll */}
      <div className="relative z-10 px-6 pb-28 pt-10 text-white">
        <div className="mb-2 flex flex-wrap gap-2">
          {jobb.taggar.map((tagg) => (
            <span
              key={tagg}
              className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm"
            >
              {tagg}
            </span>
          ))}
        </div>

        <p className="text-sm font-medium opacity-90">{jobb.foretag}</p>
        <h2 className="mt-1 text-3xl font-extrabold leading-tight drop-shadow">
          {jobb.titel}
        </h2>

        <p className="mt-2 flex items-center gap-3 text-sm font-medium opacity-95">
          <span>📍 {jobb.avstandKm} km bort</span>
          <span>·</span>
          <span>💰 {jobb.lon}</span>
        </p>

        <p className="mt-3 max-w-md text-[15px] leading-relaxed opacity-95">
          {jobb.beskrivning}
        </p>

        {/* Intresse-knappen */}
        <button
          type="button"
          onClick={() => setIntresserad(true)}
          disabled={intresserad}
          className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-bold transition active:scale-[0.97] ${
            intresserad
              ? "bg-frisk text-white"
              : "bg-white text-sol-mork shadow-lg hover:brightness-105"
          }`}
        >
          {intresserad ? "Ansökan skickad ✓" : "❤️ Jag är intresserad"}
        </button>
      </div>
    </section>
  );
}
