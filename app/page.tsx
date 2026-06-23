import Link from "next/link";
import Knapp from "@/components/Knapp";

/*
  Startsidan – det första en besökare ser.
  Mål: snabbt förmedla "svep dig till ett sommarjobb" och locka in i flödet.
  Mobil först: allt staplas i en smal kolumn och växer snyggt på större skärmar.
*/

export default function Startsida() {
  return (
    <main className="relative flex-1 overflow-hidden bg-papper">
      {/* Mjuk färgglöd i bakgrunden för premium-känsla */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-sol-ljus/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 -left-24 h-80 w-80 rounded-full bg-sol/20 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-[100svh] max-w-md flex-col px-6 pb-10 pt-8">
        {/* Logga */}
        <header className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-bleck">
            <span className="bg-sol-gradient flex h-8 w-8 items-center justify-center rounded-xl text-white">
              ☀
            </span>
            SommarMatch
          </span>
          <Link
            href="/logga-in"
            className="text-sm font-medium text-dis hover:text-bleck"
          >
            Logga in
          </Link>
        </header>

        {/* Rubrik och budskap */}
        <div className="mt-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-sol-mork shadow-sm">
            🔥 Nytt sätt att hitta jobb
          </span>
          <h1 className="mt-5 text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-bleck">
            Hitta ditt
            <br />
            sommarjobb
            <br />
            <span className="bg-sol-gradient bg-clip-text text-transparent">
              genom att svepa.
            </span>
          </h1>
          <p className="mt-4 text-lg text-dis">
            Inga CV. Inget krångel. Svep mellan jobb nära dig och sök med ett
            klick.
          </p>
        </div>

        {/* Liten förhandsvisning av jobbflödet */}
        <div className="mt-10 flex justify-center">
          <div className="relative w-56 rounded-[2rem] border-4 border-natt bg-natt p-2 shadow-2xl">
            <div className="overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-amber-200 to-orange-400">
              <div className="flex h-72 flex-col justify-end p-4 text-white">
                <span className="text-3xl">☕</span>
                <p className="mt-2 text-sm font-semibold drop-shadow">
                  Café Solsken
                </p>
                <p className="text-xs opacity-90 drop-shadow">
                  Barista · sommar
                </p>
                <p className="mt-1 text-xs opacity-90 drop-shadow">
                  📍 2 km bort · 130 kr/h
                </p>
                <div className="mt-3 rounded-full bg-white/95 py-2 text-center text-xs font-bold text-sol-mork">
                  ❤️ Jag är intresserad
                </div>
                <p className="mt-2 text-center text-[10px] opacity-80">
                  ↑ Svep för nästa jobb
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Knappar */}
        <div className="mt-auto pt-10">
          <Knapp href="/jobb" className="w-full text-lg">
            Kom igång →
          </Knapp>
          <p className="mt-4 text-center text-sm text-dis">
            Är du företag?{" "}
            <Link
              href="/registrera"
              className="font-semibold text-sol-mork hover:underline"
            >
              Lägg upp ett jobb
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
