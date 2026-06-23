"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Falt from "@/components/Falt";
import Knapp from "@/components/Knapp";

/*
  Inloggningssidan (mörkt tema).
  (Ingen riktig inloggning än – inget lösenord kontrolleras.)
*/

export default function LoggaIn() {
  const router = useRouter();

  function hanteraSkicka(e: React.FormEvent) {
    e.preventDefault();
    router.push("/jobb");
  }

  return (
    <main className="relative flex-1 overflow-x-hidden bg-bg">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="anim-float absolute -top-20 -left-16 h-72 w-72 rounded-full bg-flame/25 blur-[90px]" />
        <div
          className="anim-float absolute bottom-0 -right-20 h-72 w-72 rounded-full bg-rose/20 blur-[90px]"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-md flex-col px-6 py-6">
        <Link href="/" className="text-2xl text-mute transition hover:text-text" aria-label="Tillbaka">
          ←
        </Link>

        <div className="anim-up mt-6">
          <h1 className="text-[2.1rem] font-extrabold leading-tight tracking-tight">
            Välkommen tillbaka 👋
          </h1>
          <p className="mt-1.5 text-mute">Logga in för att se nya jobb nära dig.</p>
        </div>

        <form onSubmit={hanteraSkicka} className="anim-up mt-8 flex flex-col gap-4" style={{ animationDelay: "0.1s" }}>
          <Falt etikett="E-post" ikon="✉️" type="email" required placeholder="du@exempel.se" />
          <Falt etikett="Lösenord" ikon="🔒" type="password" required placeholder="Ditt lösenord" />

          <Knapp type="submit" className="mt-2 w-full text-lg">
            Logga in
          </Knapp>
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
