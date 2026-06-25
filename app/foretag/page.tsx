import Link from "next/link";
import { TYPER } from "@/data/mojligheter";
import { nuvarandeAnvandare } from "@/lib/auth";
import { mojligheterForAgare, sokandeForAgare } from "@/lib/db";
import { loggaUtAction } from "@/lib/actions";

/*
  Företagsportal – arbetsgivarens vy, nu med riktiga annonser och sökande.
  Kandidater visas som vibe-kort (ej CV).
*/

export const dynamic = "force-dynamic";

export default async function Foretag() {
  const u = await nuvarandeAnvandare();

  if (!u || u.roll !== "foretag") {
    return (
      <main className="relative flex-1 bg-bg">
        <div className="mx-auto flex min-h-[100svh] max-w-md flex-col items-center justify-center px-8 text-center">
          <span className="text-6xl">🏢</span>
          <h1 className="mt-4 text-2xl font-extrabold">Företagsportal</h1>
          <p className="mt-2 text-mute">
            Logga in som företag för att lägga upp möjligheter och se intresserade unga.
          </p>
          <div className="mt-6 flex w-full max-w-xs flex-col gap-3">
            <Link href="/registrera" className="bg-brand rounded-2xl px-6 py-4 font-bold text-white transition hover:brightness-110">
              Skapa företagskonto
            </Link>
            <Link href="/logga-in" className="glas rounded-2xl px-6 py-4 font-semibold transition hover:bg-white/10">
              Logga in
            </Link>
            <Link href="/" className="text-sm font-semibold text-mute transition hover:text-text">
              ← Till startsidan
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const annonser = await mojligheterForAgare(u.id);
  const sokande = await sokandeForAgare(u.id);

  return (
    <main className="relative flex-1 overflow-x-hidden bg-bg">
      <div className="mx-auto min-h-[100svh] max-w-md px-5 pb-10 pt-7">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">{u.foretag || "Ditt företag"}</h1>
            <p className="text-xs text-mute">Företagsportal</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/skapa-jobb" className="bg-brand rounded-full px-4 py-2 text-sm font-bold text-white transition hover:brightness-110">
              + Ny annons
            </Link>
            <form action={loggaUtAction}>
              <button type="submit" className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-mute transition hover:text-text">
                Logga ut
              </button>
            </form>
          </div>
        </div>

        {/* Statistik */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { tal: `${annonser.length}`, text: "Annonser" },
            { tal: `${sokande.length}`, text: "Intresserade" },
            { tal: "~2 tim", text: "Svarstid" },
          ].map((s) => (
            <div key={s.text} className="rounded-2xl border border-white/10 bg-white/5 py-4 text-center">
              <p className="text-xl font-extrabold text-brand">{s.tal}</p>
              <p className="mt-0.5 text-[11px] font-medium text-mute">{s.text}</p>
            </div>
          ))}
        </div>

        {/* Annonser */}
        <h2 className="mt-7 text-lg font-bold">Dina annonser</h2>
        {annonser.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-center text-sm text-mute">
            Du har inga annonser än.
            <Link href="/skapa-jobb" className="mt-3 block font-semibold text-brand">
              Lägg upp din första →
            </Link>
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {annonser.map((a) => (
              <div key={a.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-bold">{a.titel}</p>
                  <span className="rounded-full bg-frisk/15 px-2.5 py-1 text-[11px] font-bold text-frisk">Aktiv</span>
                </div>
                <p className="mt-1 text-sm text-mute">
                  {TYPER[a.typ]?.emoji} {TYPER[a.typ]?.etikett} · {a.ersattning}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Sökande */}
        <h2 className="mt-7 text-lg font-bold">Intresserade kandidater</h2>
        <p className="text-sm text-mute">Vibe och badges – inte tråkiga CV:n.</p>
        {sokande.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-center text-sm text-mute">
            Inga intresserade än. Så fort någon trycker “Jag är intresserad” i flödet dyker de upp här. 👀
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {sokande.map((k, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="bg-brand-soft flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl">🙋</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold">{k.namn || "Ung kandidat"}{k.alder ? `, ${k.alder}` : ""}</p>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-brand">Ny</span>
                  </div>
                  <p className="mt-0.5 text-sm text-mute">
                    Sökte: {k.titel} · 📍 {k.ort || "Sverige"}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button type="button" className="bg-brand flex-1 rounded-full py-2 text-xs font-bold text-white transition hover:brightness-110">
                      Kontakta
                    </button>
                    <button type="button" className="glas flex-1 rounded-full py-2 text-xs font-semibold transition hover:bg-white/10">
                      Spara
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
