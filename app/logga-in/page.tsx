"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Falt from "@/components/Falt";

/*
  Inloggningssidan.
  Skickar vidare till jobbflödet när man loggar in.
  (Ingen riktig inloggning än – vi kontrollerar inget lösenord ännu.)
*/

export default function LoggaIn() {
  const router = useRouter();

  function hanteraSkicka(e: React.FormEvent) {
    e.preventDefault();
    router.push("/jobb");
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
            Välkommen tillbaka 👋
          </h1>
          <p className="mt-1.5 text-dis">Logga in för att se nya jobb.</p>
        </div>

        <form onSubmit={hanteraSkicka} className="mt-8 flex flex-col gap-4">
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
            placeholder="Ditt lösenord"
          />

          <button
            type="submit"
            className="bg-sol-gradient mt-2 w-full rounded-full px-7 py-4 text-lg font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:brightness-105 active:scale-[0.97]"
          >
            Logga in
          </button>
        </form>

        <p className="mt-auto pt-8 text-center text-sm text-dis">
          Inget konto än?{" "}
          <Link
            href="/registrera"
            className="font-semibold text-sol-mork hover:underline"
          >
            Skapa konto
          </Link>
        </p>
      </div>
    </main>
  );
}
