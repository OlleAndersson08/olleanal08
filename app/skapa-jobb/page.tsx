"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Falt from "@/components/Falt";
import { skapaMojlighetAction } from "@/lib/actions";
import { TYPER } from "@/data/mojligheter";

/*
  Skapa annons (företag) – sparar en riktig möjlighet i databasen.
  Den dyker direkt upp i flödet och i Utforska.
*/

export default function SkapaJobb() {
  const [titel, setTitel] = useState("");
  const [state, formAction, pending] = useActionState(skapaMojlighetAction, undefined);

  return (
    <main className="relative flex-1 overflow-x-hidden bg-bg">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="anim-float absolute -top-20 -right-16 h-72 w-72 rounded-full bg-violet/20 blur-[90px]" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-md flex-col px-6 py-6">
        <div className="flex items-center gap-3">
          <Link href="/foretag" className="inline-block text-2xl text-mute transition-all duration-200 hover:-translate-x-0.5 hover:text-text" aria-label="Tillbaka">
            ←
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight">Ny möjlighet</h1>
        </div>

        <form action={formAction} className="anim-up mt-6 flex flex-col gap-4">
          {/* Uppladdningsruta (visuell) */}
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 bg-white/5 py-10 text-center transition hover:bg-white/[0.07]">
            <span className="text-3xl">📷</span>
            <p className="font-semibold">Lägg till video eller bild</p>
            <p className="text-sm text-mute">Visa hur det är att jobba hos er</p>
          </div>

          <Falt
            etikett="Titel"
            ikon="💼"
            name="titel"
            required
            placeholder="t.ex. Barista för sommaren"
            value={titel}
            onChange={(e) => setTitel(e.target.value)}
          />

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-text">Kategori</span>
            <select
              name="typ"
              defaultValue="extra"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-text outline-none focus:border-rose/60"
            >
              {Object.values(TYPER).map((t) => (
                <option key={t.nyckel} value={t.nyckel} className="bg-yta">
                  {t.emoji} {t.etikett}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-text">Beskrivning</span>
            <textarea
              name="beskrivning"
              required
              rows={4}
              placeholder="Berätta kort om möjligheten och vem ni söker."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-text outline-none transition placeholder:text-mute focus:border-rose/60 focus:ring-2 focus:ring-rose/25"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <Falt etikett="Ersättning" ikon="💰" name="ersattning" required placeholder="130 kr/h" />
            <Falt etikett="Ort" ikon="📍" name="ort" required placeholder="Stockholm" />
          </div>

          {state?.error && (
            <p className="rounded-xl bg-rose/15 px-4 py-3 text-sm font-medium text-rose">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="bg-brand mt-2 w-full rounded-2xl px-7 py-4 text-lg font-bold text-white shadow-xl shadow-rose/25 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
          >
            {pending ? "Publicerar ..." : "Publicera möjlighet"}
          </button>
        </form>
      </div>
    </main>
  );
}
