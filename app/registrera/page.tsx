"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Falt from "@/components/Falt";
import { registreraAction } from "@/lib/actions";

/*
  Registreringssidan – riktig registrering (sparar konto i databasen).
  Väljer roll (Ungdom/Företag) → skickas vidare till rätt startpunkt.
*/

type Roll = "ungdom" | "foretag";

export default function Registrera() {
  const [roll, setRoll] = useState<Roll>("ungdom");
  const [state, formAction, pending] = useActionState(registreraAction, undefined);

  return (
    <main className="relative flex-1 overflow-x-hidden bg-bg">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="anim-float absolute -top-20 -right-16 h-72 w-72 rounded-full bg-rose/25 blur-[90px]" />
        <div className="anim-float absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-violet/20 blur-[90px]" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-md flex-col px-6 py-6">
        <Link href="/" className="inline-block text-2xl text-mute transition-all duration-200 hover:-translate-x-0.5 hover:text-text" aria-label="Tillbaka">
          ←
        </Link>

        <div className="anim-up mt-6">
          <h1 className="text-[2.1rem] font-extrabold leading-tight tracking-tight">Skapa konto</h1>
          <p className="mt-1.5 text-mute">Det tar 30 sekunder. Inget CV behövs.</p>
        </div>

        {/* Rollväljare */}
        <div className="anim-up mt-6 grid grid-cols-2 gap-1.5 rounded-2xl border border-white/10 bg-white/5 p-1.5" style={{ animationDelay: "0.08s" }}>
          {(["ungdom", "foretag"] as const).map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setRoll(val)}
              className={`rounded-xl py-3 text-sm font-bold transition ${
                roll === val ? "bg-brand text-white shadow-lg" : "text-mute hover:text-text"
              }`}
            >
              {val === "ungdom" ? "🙋 Jag söker jobb" : "🏢 Jag är företag"}
            </button>
          ))}
        </div>

        <form action={formAction} className="anim-up mt-6 flex flex-col gap-4" style={{ animationDelay: "0.15s" }}>
          <input type="hidden" name="roll" value={roll} />
          {roll === "foretag" && (
            <Falt etikett="Företagsnamn" ikon="🏢" name="foretag" required placeholder="Café Solsken" />
          )}
          <Falt etikett="E-post" ikon="✉️" name="email" type="email" required placeholder="du@exempel.se" />
          <Falt etikett="Lösenord" ikon="🔒" name="losen" type="password" required placeholder="Minst 6 tecken" minLength={6} />
          <Falt etikett="Din ort" ikon="📍" name="ort" required placeholder="Stockholm" />

          {state?.error && (
            <p className="rounded-xl bg-rose/15 px-4 py-3 text-sm font-medium text-rose">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="bg-brand mt-2 w-full rounded-2xl px-7 py-4 text-lg font-bold text-white shadow-xl shadow-rose/25 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
          >
            {pending ? "Skapar konto ..." : "Skapa konto"}
          </button>
        </form>

        <p className="mt-auto pt-8 text-center text-sm text-mute">
          Har du redan ett konto?{" "}
          <Link href="/logga-in" className="font-semibold text-text underline-offset-4 hover:underline">
            Logga in
          </Link>
        </p>
      </div>
    </main>
  );
}
