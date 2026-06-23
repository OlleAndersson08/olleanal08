"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Falt from "@/components/Falt";
import Knapp from "@/components/Knapp";

/*
  Registreringssidan (mörkt tema).
  Välj roll (Ungdom/Företag) → skickas vidare till rätt startpunkt.
  (Ingen databas än – inget riktigt konto sparas ännu.)
*/

type Roll = "ungdom" | "foretag";

export default function Registrera() {
  const router = useRouter();
  const [roll, setRoll] = useState<Roll>("ungdom");

  function hanteraSkicka(e: React.FormEvent) {
    e.preventDefault();
    router.push(roll === "ungdom" ? "/jobb" : "/skapa-jobb");
  }

  return (
    <main className="relative flex-1 overflow-x-hidden bg-bg">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="anim-float absolute -top-20 -right-16 h-72 w-72 rounded-full bg-rose/25 blur-[90px]" />
        <div
          className="anim-float absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-violet/20 blur-[90px]"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-md flex-col px-6 py-6">
        <Link
          href="/"
          className="inline-block text-2xl text-mute transition-all duration-200 hover:-translate-x-0.5 hover:text-text"
          aria-label="Tillbaka"
        >
          ←
        </Link>

        <div className="anim-up mt-6">
          <h1 className="text-[2.1rem] font-extrabold leading-tight tracking-tight">
            Skapa konto
          </h1>
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

        <form onSubmit={hanteraSkicka} className="anim-up mt-6 flex flex-col gap-4" style={{ animationDelay: "0.15s" }}>
          {roll === "foretag" && (
            <Falt etikett="Företagsnamn" ikon="🏢" required placeholder="Café Solsken" />
          )}
          <Falt etikett="E-post" ikon="✉️" type="email" required placeholder="du@exempel.se" />
          <Falt etikett="Lösenord" ikon="🔒" type="password" required placeholder="Minst 6 tecken" minLength={6} />
          <Falt etikett="Din ort" ikon="📍" required placeholder="Stockholm" />

          <Knapp type="submit" className="mt-2 w-full text-lg">
            Skapa konto
          </Knapp>
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
