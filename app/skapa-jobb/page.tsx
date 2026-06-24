"use client";

import { useState } from "react";
import Link from "next/link";
import Falt from "@/components/Falt";
import Knapp from "@/components/Knapp";

/*
  Skapa jobb (mörkt tema) – företagets annons.
  Bekräftelsevy med fest-känsla efter publicering.
  (Jobbet sparas inte i databas än.)
*/

export default function SkapaJobb() {
  const [publicerat, setPublicerat] = useState(false);
  const [titel, setTitel] = useState("");

  function hanteraSkicka(e: React.FormEvent) {
    e.preventDefault();
    setPublicerat(true);
  }

  if (publicerat) {
    return (
      <main className="relative flex-1 overflow-hidden bg-bg">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="anim-float absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-frisk/25 blur-[90px]" />
        </div>
        <div className="relative mx-auto flex min-h-[100svh] max-w-md flex-col items-center justify-center px-6 text-center">
          <div className="anim-scale flex h-24 w-24 items-center justify-center rounded-full bg-frisk/15 text-5xl">
            🎉
          </div>
          <h1 className="anim-up mt-5 text-2xl font-extrabold tracking-tight" style={{ animationDelay: "0.1s" }}>
            Jobbet är publicerat!
          </h1>
          <p className="anim-up mt-2 text-mute" style={{ animationDelay: "0.18s" }}>
            {titel ? `”${titel}”` : "Din annons"} syns nu för unga i flödet. Vi
            pingar dig så fort någon visar intresse.
          </p>
          <div className="anim-up mt-8 flex w-full flex-col gap-3" style={{ animationDelay: "0.26s" }}>
            <Knapp href="/jobb" className="w-full text-lg">
              Se hur det ser ut i flödet
            </Knapp>
            <button
              type="button"
              onClick={() => {
                setPublicerat(false);
                setTitel("");
              }}
              className="glas w-full rounded-2xl px-7 py-4 font-semibold transition hover:bg-white/10"
            >
              Lägg upp ett till jobb
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex-1 overflow-x-hidden bg-bg">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="anim-float absolute -top-20 -right-16 h-72 w-72 rounded-full bg-violet/20 blur-[90px]" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-md flex-col px-6 py-6">
        <div className="flex items-center gap-3">
          <Link
            href="/foretag"
            className="inline-block text-2xl text-mute transition-all duration-200 hover:-translate-x-0.5 hover:text-text"
            aria-label="Tillbaka"
          >
            ←
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight">Nytt jobb</h1>
        </div>

        <form onSubmit={hanteraSkicka} className="anim-up mt-6 flex flex-col gap-4">
          {/* Uppladdningsruta */}
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 bg-white/5 py-10 text-center transition hover:bg-white/[0.07]">
            <span className="text-3xl">📷</span>
            <p className="font-semibold">Lägg till video eller bild</p>
            <p className="text-sm text-mute">Visa hur det är att jobba hos er</p>
          </div>

          <Falt
            etikett="Jobbtitel"
            ikon="💼"
            required
            placeholder="t.ex. Barista för sommaren"
            value={titel}
            onChange={(e) => setTitel(e.target.value)}
          />

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-text">Beskrivning</span>
            <textarea
              required
              rows={4}
              placeholder="Berätta kort om jobbet och vem ni söker."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-text outline-none transition placeholder:text-mute focus:border-rose/60 focus:ring-2 focus:ring-rose/25"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <Falt etikett="Lön" ikon="💰" required placeholder="130 kr/h" />
            <Falt etikett="Ort" ikon="📍" required placeholder="Stockholm" />
          </div>

          <Knapp type="submit" className="mt-2 w-full text-lg">
            Publicera jobb
          </Knapp>
        </form>
      </div>
    </main>
  );
}
