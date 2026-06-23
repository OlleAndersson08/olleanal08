"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Falt from "@/components/Falt";

/*
  Registreringssidan – skapa konto.
  Man väljer roll (Ungdom eller Företag). När man trycker "Skapa konto"
  skickas man vidare: ungdomar till jobbflödet, företag till skapa-jobb.
  (Ingen databas än – vi sparar inget riktigt konto ännu.)
*/

type Roll = "ungdom" | "foretag";

export default function Registrera() {
  const router = useRouter();
  const [roll, setRoll] = useState<Roll>("ungdom");

  function hanteraSkicka(e: React.FormEvent) {
    e.preventDefault();
    // Senare: spara kontot i databasen. Nu skickar vi bara vidare.
    router.push(roll === "ungdom" ? "/jobb" : "/skapa-jobb");
  }

  return (
    <main className="flex-1 bg-papper">
      <div className="mx-auto flex min-h-[100svh] max-w-md flex-col px-6 py-6">
        <Link
          href="/"
          className="text-2xl text-dis transition hover:text-bleck"
          aria-label="Tillbaka"
        >
          ←
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-bleck">
            Skapa konto
          </h1>
          <p className="mt-1.5 text-dis">
            Det tar 30 sekunder. Inget CV behövs.
          </p>
        </div>

        {/* Rollväljare */}
        <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-black/[0.04] p-1.5">
          {(["ungdom", "foretag"] as const).map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setRoll(val)}
              className={`rounded-xl py-3 text-sm font-semibold transition ${
                roll === val
                  ? "bg-white text-bleck shadow"
                  : "text-dis hover:text-bleck"
              }`}
            >
              {val === "ungdom" ? "🙋 Jag söker jobb" : "🏢 Jag är företag"}
            </button>
          ))}
        </div>

        <form onSubmit={hanteraSkicka} className="mt-6 flex flex-col gap-4">
          {roll === "foretag" && (
            <Falt etikett="Företagsnamn" ikon="🏢" placeholder="Café Solsken" />
          )}
          <Falt
            etikett="E-post"
            ikon="✉️"
            type="email"
            required
            placeholder="du@exempel.se"
          />
          <Falt
            etikett="Lösenord"
            ikon="🔒"
            type="password"
            required
            placeholder="Minst 6 tecken"
            minLength={6}
          />
          <Falt
            etikett="Din ort"
            ikon="📍"
            required
            placeholder="Stockholm"
          />

          <button
            type="submit"
            className="bg-sol-gradient mt-2 w-full rounded-full px-7 py-4 text-lg font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:brightness-105 active:scale-[0.97]"
          >
            Skapa konto
          </button>
        </form>

        <p className="mt-auto pt-8 text-center text-sm text-dis">
          Har du redan ett konto?{" "}
          <Link
            href="/logga-in"
            className="font-semibold text-sol-mork hover:underline"
          >
            Logga in
          </Link>
        </p>
      </div>
    </main>
  );
}
