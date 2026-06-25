import Link from "next/link";
import Meny from "@/components/Meny";
import { badges } from "@/data/lektioner";
import { TYPER } from "@/data/mojligheter";
import { nuvarandeAnvandare } from "@/lib/auth";
import { ansokningarForAnvandare } from "@/lib/db";
import { loggaUtAction } from "@/lib/actions";

/*
  Profil – ungas karriär-pass. Nu med riktigt konto och riktiga ansökningar
  från databasen. Streak/nivå är fortfarande illustrativa tills de spåras.
*/

export const dynamic = "force-dynamic";

const skills = ["☕ Service", "🧒 Barn", "💪 Fysiskt", "🎥 Kreativt", "📍 Lokal", "⚡ Snabb"];

export default async function Profil() {
  const u = await nuvarandeAnvandare();

  // Ej inloggad
  if (!u) {
    return (
      <main className="relative flex-1 bg-bg">
        <div className="mx-auto flex min-h-[100svh] max-w-md flex-col items-center justify-center px-8 pb-28 text-center">
          <span className="text-6xl">👤</span>
          <h1 className="mt-4 text-2xl font-extrabold">Din profil väntar</h1>
          <p className="mt-2 text-mute">Logga in för att se dina ansökningar, badges och din intjäning.</p>
          <div className="mt-6 flex w-full max-w-xs flex-col gap-3">
            <Link href="/registrera" className="bg-brand rounded-2xl px-6 py-4 font-bold text-white transition hover:brightness-110">
              Skapa konto
            </Link>
            <Link href="/logga-in" className="glas rounded-2xl px-6 py-4 font-semibold transition hover:bg-white/10">
              Logga in
            </Link>
          </div>
        </div>
        <Meny />
      </main>
    );
  }

  const ansokningar = await ansokningarForAnvandare(u.id);
  const visningsnamn = u.namn || u.email.split("@")[0];
  const statistik = [
    { tal: `${ansokningar.length}`, text: "Ansökningar" },
    { tal: "🔥 5", text: "Dagars streak" },
    { tal: "Nivå 4", text: "1 240 XP" },
  ];

  return (
    <main className="relative flex-1 overflow-x-hidden bg-bg">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="anim-float absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-rose/20 blur-[90px]" />
      </div>

      <div className="relative mx-auto min-h-[100svh] max-w-md px-6 pb-28 pt-10">
        {/* Topp */}
        <div className="anim-up flex flex-col items-center text-center">
          <div className="relative">
            <div className="bg-brand-anim flex h-24 w-24 items-center justify-center rounded-full text-4xl shadow-xl">🙂</div>
            <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-bg bg-frisk text-xs">
              ✓
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight">{visningsnamn}</h1>
          <p className="mt-1 text-mute">
            📍 {u.ort || "Sverige"}
            {u.alder ? ` · ${u.alder} år` : ""} · Verifierad
          </p>

          <div className="mt-4 flex gap-2">
            <button type="button" className="glas rounded-full px-5 py-2 text-sm font-semibold transition hover:bg-white/10">
              Dela profil
            </button>
            <form action={loggaUtAction}>
              <button type="submit" className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-mute transition hover:text-text">
                Logga ut
              </button>
            </form>
          </div>
        </div>

        {/* Karriär-status */}
        <div className="anim-up mt-7 grid grid-cols-3 gap-2" style={{ animationDelay: "0.1s" }}>
          {statistik.map((s) => (
            <div key={s.text} className="rounded-2xl border border-white/10 bg-white/5 py-4 text-center">
              <p className="text-lg font-extrabold text-brand">{s.tal}</p>
              <p className="mt-0.5 text-[11px] font-medium text-mute">{s.text}</p>
            </div>
          ))}
        </div>

        {/* Skills / vibe */}
        <section className="anim-up mt-8" style={{ animationDelay: "0.14s" }}>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-mute">Min vibe</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium">
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Badges */}
        <section className="anim-up mt-8" style={{ animationDelay: "0.18s" }}>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-mute">Verifierade badges</h2>
            <Link href="/vax" className="text-xs font-semibold text-brand">
              Tjäna fler →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {badges.filter((b) => b.upplast).map((b) => (
              <span key={b.id} className="flex items-center gap-1.5 rounded-full bg-frisk/10 px-3 py-1.5 text-sm font-semibold text-frisk">
                {b.emoji} {b.titel}
              </span>
            ))}
          </div>
        </section>

        {/* Ansökningar (riktiga) */}
        <section className="anim-up mt-8" style={{ animationDelay: "0.22s" }}>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-mute">Mina ansökningar</h2>
          {ansokningar.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center text-sm text-mute">
              Inga ansökningar än. Svep i flödet och tryck “Jag är intresserad”. 🔥
              <Link href="/jobb" className="mt-3 block font-semibold text-brand">
                Till flödet →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {ansokningar.map((a) => (
                <div key={a.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="bg-brand-soft flex h-11 w-11 items-center justify-center rounded-xl text-xl">{a.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{a.foretag}</p>
                    <p className="truncate text-sm text-mute">
                      {a.titel} · {TYPER[a.typ]?.etikett ?? ""}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-frisk/15 px-3 py-1 text-xs font-bold text-frisk">{a.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Företagsingång */}
        <Link
          href="/foretag"
          className="anim-up mt-8 flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-4 text-sm font-semibold text-mute transition hover:text-text"
          style={{ animationDelay: "0.26s" }}
        >
          🏢 Är du arbetsgivare? Gå till företagsportalen →
        </Link>
      </div>

      <Meny />
    </main>
  );
}
