"use client";

import { useActionState } from "react";
import Link from "next/link";
import Falt from "@/components/Falt";
import { loggaInAction } from "@/lib/actions";

/*
  Inloggningssidan – riktig inloggning (kontrollerar lösenord mot databasen).
*/

export default function LoggaIn() {
  const [state, formAction, pending] = useActionState(loggaInAction, undefined);

  return (
    <main className="relative flex-1 overflow-x-hidden bg-bg">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="anim-float absolute -top-20 -left-16 h-72 w-72 rounded-full bg-flame/25 blur-[90px]" />
        <div className="anim-float absolute bottom-0 -right-20 h-72 w-72 rounded-full bg-rose/20 blur-[90px]" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-md flex-col px-6 py-6">
        <Link href="/" className="inline-block text-2xl text-mute transition-all duration-200 hover:-translate-x-0.5 hover:text-text" aria-label="Tillbaka">
          ←
        </Link>

        <div className="anim-up mt-6">
          <h1 className="text-[2.1rem] font-extrabold leading-tight tracking-tight">Välkommen tillbaka 👋</h1>
          <p className="mt-1.5 text-mute">Logga in för att se nya möjligheter nära dig.</p>
        </div>

        <form action={formAction} className="anim-up mt-8 flex flex-col gap-4" style={{ animationDelay: "0.1s" }}>
          <Falt etikett="E-post" ikon="✉️" name="email" type="email" required placeholder="du@exempel.se" />
          <Falt etikett="Lösenord" ikon="🔒" name="losen" type="password" required placeholder="Ditt lösenord" />

          {state?.error && (
            <p className="rounded-xl bg-rose/15 px-4 py-3 text-sm font-medium text-rose">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="bg-brand mt-2 w-full rounded-2xl px-7 py-4 text-lg font-bold text-white shadow-xl shadow-rose/25 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
          >
            {pending ? "Loggar in ..." : "Logga in"}
          </button>
        </form>

        <p className="mt-auto pt-8 text-center text-sm text-mute">
          Inget konto än?{" "}
          <Link href="/registrera" className="font-semibold text-text underline-offset-4 hover:underline">
            Skapa konto
          </Link>
        </p>
      </div>
    </main>
  );
}
