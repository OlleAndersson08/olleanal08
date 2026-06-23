"use client";

import { useRef, useState } from "react";
import type { Jobb } from "@/data/jobb";

/*
  Jobbkort 2.0 – ett jobb som fyller skärmen, som ett TikTok-klipp.
  Beroende-mekanik:
   - Dubbeltryck var som helst = gilla + hjärt-explosion
   - Actionrad i kanten: gilla, spara, dela
   - Matchnings-% och "tittar nu" som socialt bevis
   - Ett-klicks-ansökan som belönar med en grön bekräftelse
*/

function formatTal(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".", ",") + " tn";
  return String(n);
}

export default function Jobbkort({ jobb }: { jobb: Jobb }) {
  const [gillad, setGillad] = useState(false);
  const [sparad, setSparad] = useState(false);
  const [intresserad, setIntresserad] = useState(false);
  const [burst, setBurst] = useState(0); // ökar varje gång ett hjärta ska poppa
  const sistaTryck = useRef(0);

  const antalGillar = jobb.gillar + (gillad ? 1 : 0);

  function poppaHjarta() {
    setBurst((b) => b + 1);
  }

  function gilla() {
    if (!gillad) setGillad(true);
    poppaHjarta();
  }

  function hanteraTryck() {
    const nu = Date.now();
    if (nu - sistaTryck.current < 300) {
      // dubbeltryck
      gilla();
    }
    sistaTryck.current = nu;
  }

  function dela() {
    const text = `${jobb.titel} hos ${jobb.foretag} på SommarMatch`;
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "SommarMatch", text }).catch(() => {});
    }
  }

  return (
    <section
      onClick={hanteraTryck}
      className="relative flex h-[100svh] snap-start snap-always select-none flex-col justify-end overflow-hidden"
      style={{ backgroundImage: `linear-gradient(160deg, ${jobb.fran}, ${jobb.till})` }}
    >
      {/* Stor emoji som "bild" */}
      <div className="anim-float pointer-events-none absolute inset-x-0 top-[12%] flex justify-center">
        <span className="text-[8rem] drop-shadow-xl">{jobb.emoji}</span>
      </div>

      {/* Toningar för läsbarhet */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

      {/* Topp: match + tittar nu */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-5">
        <span className="flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
          ⚡ {jobb.match}% match
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-frisk" />
          {jobb.tittarNu} tittar nu
        </span>
      </div>

      {/* Dubbeltryck-hjärtan (poppar i mitten) */}
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        {burst > 0 && (
          <span key={burst} className="anim-heart text-[8rem] drop-shadow-2xl">
            ❤️
          </span>
        )}
      </div>

      {/* Actionrad i höger kant */}
      <div className="absolute bottom-36 right-3 z-30 flex flex-col items-center gap-5">
        {/* Företagsavatar */}
        <div className="flex flex-col items-center gap-1">
          <span className="bg-brand flex h-12 w-12 items-center justify-center rounded-full text-xl ring-2 ring-white/70">
            {jobb.emoji}
          </span>
        </div>

        <RailKnapp
          aktiv={gillad}
          onClick={(e) => {
            e.stopPropagation();
            gilla();
          }}
          label={formatTal(antalGillar)}
        >
          <Hjarta fylld={gillad} />
        </RailKnapp>

        <RailKnapp
          aktiv={sparad}
          onClick={(e) => {
            e.stopPropagation();
            setSparad((s) => !s);
          }}
          label={sparad ? "Sparad" : "Spara"}
        >
          <Bokmarke fylld={sparad} />
        </RailKnapp>

        <RailKnapp
          onClick={(e) => {
            e.stopPropagation();
            dela();
          }}
          label="Dela"
        >
          <Dela />
        </RailKnapp>
      </div>

      {/* Innehåll längst ner */}
      <div className="relative z-10 px-5 pb-28 pr-20 pt-10 text-white">
        <div className="mb-2 flex flex-wrap gap-2">
          {jobb.taggar.map((tagg) => (
            <span
              key={tagg}
              className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm"
            >
              {tagg}
            </span>
          ))}
        </div>

        <p className="text-sm font-semibold opacity-90">{jobb.foretag}</p>
        <h2 className="mt-1 text-[1.9rem] font-extrabold leading-tight drop-shadow">
          {jobb.titel}
        </h2>

        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold opacity-95">
          <span>📍 {jobb.avstandKm} km bort</span>
          <span className="opacity-50">·</span>
          <span>💰 {jobb.lon}</span>
        </p>

        <p className="mt-2.5 max-w-sm text-[15px] leading-relaxed opacity-90">
          {jobb.beskrivning}
        </p>

        {/* Ansök-knappen */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIntresserad(true);
          }}
          disabled={intresserad}
          className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-7 py-4 text-base font-extrabold transition active:scale-[0.97] ${
            intresserad
              ? "bg-frisk text-white"
              : "bg-white text-rose shadow-xl hover:brightness-105"
          }`}
        >
          {intresserad ? (
            <span className="anim-bump">Ansökan skickad ✓</span>
          ) : (
            "❤️ Jag är intresserad"
          )}
        </button>
      </div>
    </section>
  );
}

/* En knapp i actionraden: ikon + liten text under */
function RailKnapp({
  children,
  label,
  onClick,
  aktiv,
}: {
  children: React.ReactNode;
  label: string;
  onClick: (e: React.MouseEvent) => void;
  aktiv?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 transition active:scale-90"
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full backdrop-blur transition ${
          aktiv ? "bg-white/90 text-rose" : "bg-black/30 text-white"
        } ${aktiv ? "anim-bump" : ""}`}
      >
        {children}
      </span>
      <span className="text-[11px] font-semibold text-white drop-shadow">{label}</span>
    </button>
  );
}

/* ---- Ikoner ---- */
function Hjarta({ fylld }: { fylld: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={fylld ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}
function Bokmarke({ fylld }: { fylld: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={fylld ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function Dela() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}
