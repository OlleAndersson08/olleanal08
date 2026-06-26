import Link from "next/link";
import AffischQR from "@/components/AffischQR";
import SkrivUtKnapp from "@/components/SkrivUtKnapp";

/*
  Utskrivbar värvningsaffisch (A5) för arbetsgivare.
  Ljus och bläcksnål för utskrift. Öppna den på din live-länk och tryck
  "Skriv ut" (eller Ctrl/Cmd + P). QR-koden pekar automatiskt på din sajt.
*/

export default function Affisch() {
  return (
    <main className="min-h-[100svh] bg-white text-zinc-900">
      {/* Knappar – göms vid utskrift */}
      <div className="mx-auto flex max-w-md items-center justify-between px-5 pt-5 print:hidden">
        <Link href="/" className="text-sm font-semibold text-zinc-400 hover:text-zinc-700">
          ← Till appen
        </Link>
        <SkrivUtKnapp />
      </div>

      {/* Själva affischen */}
      <div className="mx-auto flex max-w-md flex-col items-center px-8 py-8 text-center">
        {/* Logga */}
        <div className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl text-white"
            style={{ backgroundImage: "linear-gradient(135deg,#ffb347,#ff2d78)" }}
          >
            ☀
          </span>
          SommarMatch
        </div>

        <span className="mt-7 inline-block rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-bold text-white">
          Till dig som arbetsgivare
        </span>

        <h1 className="mt-5 text-[2.5rem] font-extrabold leading-[1.05]">
          Lägg upp ett jobb{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(120deg,#ff7a45,#ff2d78)" }}
          >
            gratis
          </span>
        </h1>

        <p className="mt-4 text-lg text-zinc-600">
          Vi fyller din lediga tjänst med en ung, peppad person — utan CV och utan krångel.
        </p>

        {/* QR */}
        <div className="mt-8 rounded-3xl border-2 border-zinc-100 p-5 shadow-sm">
          <AffischQR />
          <p className="mt-3 text-base font-bold">📲 Skanna med mobilkameran</p>
        </div>

        {/* Steg */}
        <div className="mt-8 w-full space-y-3 text-left">
          {[
            { n: "1", t: "Skanna QR-koden med din telefon" },
            { n: "2", t: "Lägg upp jobbet på 2 minuter (gärna med en kort video)" },
            { n: "3", t: "Få intresserade unga direkt i appen" },
          ].map((s) => (
            <div key={s.n} className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white"
                style={{ backgroundImage: "linear-gradient(135deg,#ff7a45,#ff2d78)" }}
              >
                {s.n}
              </span>
              <span className="font-medium text-zinc-700">{s.t}</span>
            </div>
          ))}
        </div>

        {/* Underskrift – fyll i för hand */}
        <div className="mt-10 w-full border-t border-zinc-200 pt-5 text-sm text-zinc-500">
          <p className="font-semibold text-zinc-700">Frågor? Hör av dig:</p>
          <p className="mt-2">Namn: ______________________</p>
          <p className="mt-2">Telefon / e-post: ______________________</p>
          <p className="mt-5 text-xs text-zinc-400">SommarMatch · byggt i Sverige för unga 15–25</p>
        </div>
      </div>
    </main>
  );
}

