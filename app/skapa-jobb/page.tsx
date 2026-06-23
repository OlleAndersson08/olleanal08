"use client";

import { useState } from "react";
import Link from "next/link";
import Falt from "@/components/Falt";

/*
  Skapa jobb – företagets sida för att lägga upp en annons.
  När man trycker "Publicera jobb" visas en bekräftelse.
  (Jobbet sparas inte i någon databas än – det kopplar vi på senare.)
*/

export default function SkapaJobb() {
  const [publicerat, setPublicerat] = useState(false);
  const [titel, setTitel] = useState("");

  function hanteraSkicka(e: React.FormEvent) {
    e.preventDefault();
    setPublicerat(true);
  }

  // Bekräftelsevy efter publicering
  if (publicerat) {
    return (
      <main className="flex-1 bg-papper">
        <div className="mx-auto flex min-h-[100svh] max-w-md flex-col items-center justify-center px-6 text-center">
          <div className="bg-frisk/10 flex h-20 w-20 items-center justify-center rounded-full text-4xl">
            ✅
          </div>
          <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-bleck">
            Jobbet är publicerat!
          </h1>
          <p className="mt-2 text-dis">
            {titel ? `"${titel}"` : "Din annons"} syns nu för ungdomar i flödet.
            Vi hör av oss när någon visar intresse.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3">
            <Link
              href="/jobb"
              className="bg-sol-gradient w-full rounded-full px-7 py-4 text-lg font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:brightness-105 active:scale-[0.97]"
            >
              Se hur det ser ut i flödet
            </Link>
            <button
              type="button"
              onClick={() => {
                setPublicerat(false);
                setTitel("");
              }}
              className="w-full rounded-full border border-black/10 bg-white px-7 py-4 font-semibold text-bleck transition hover:bg-black/[0.03]"
            >
              Lägg upp ett till jobb
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-papper">
      <div className="mx-auto flex min-h-[100svh] max-w-md flex-col px-6 py-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-2xl text-dis transition hover:text-bleck"
            aria-label="Tillbaka"
          >
            ←
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-bleck">
            Nytt jobb
          </h1>
        </div>

        <form onSubmit={hanteraSkicka} className="mt-6 flex flex-col gap-4">
          {/* Uppladdningsruta för video/bild */}
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-black/15 bg-white py-10 text-center">
            <span className="text-3xl">📷</span>
            <p className="font-semibold text-bleck">Lägg till video eller bild</p>
            <p className="text-sm text-dis">Visa hur det är att jobba hos er</p>
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
            <span className="mb-1.5 block text-sm font-semibold text-bleck">
              Beskrivning
            </span>
            <textarea
              required
              rows={4}
              placeholder="Berätta kort om jobbet och vem ni söker."
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-bleck outline-none transition placeholder:text-dis focus:border-sol focus:ring-2 focus:ring-sol/30"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <Falt etikett="Lön" ikon="💰" required placeholder="130 kr/h" />
            <Falt etikett="Ort" ikon="📍" required placeholder="Stockholm" />
          </div>

          <button
            type="submit"
            className="bg-sol-gradient mt-2 w-full rounded-full px-7 py-4 text-lg font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:brightness-105 active:scale-[0.97]"
          >
            Publicera jobb
          </button>
        </form>
      </div>
    </main>
  );
}
