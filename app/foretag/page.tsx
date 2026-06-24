import Link from "next/link";

/*
  Företagsportal – arbetsgivarens vy.
  Kandidater visas som "vibe-kort" (badges + match), inte CV:n.
  Måste vara enklare än att skriva en FB-grupp-post.
*/

const annonser = [
  { titel: "Barista för sommaren", typ: "☀️ Sommarjobb", intresserade: 14, status: "Aktiv" },
  { titel: "Helgpersonal kassa", typ: "📅 Helgjobb", intresserade: 6, status: "Aktiv" },
];

const kandidater = [
  { namn: "Maja, 16", emoji: "🙋‍♀️", match: 96, badges: ["⚡ Snabb svarare", "🤝 Pålitlig"], vibe: "☕ Service · 📍 Nära" },
  { namn: "Liam, 17", emoji: "🧑", match: 91, badges: ["💸 Första giget klart"], vibe: "💪 Fysiskt · ⚡ Snabb" },
  { namn: "Noor, 15", emoji: "👩", match: 88, badges: ["🤝 Pålitlig"], vibe: "🧒 Barn · 🎥 Kreativt" },
];

export default function Foretag() {
  return (
    <main className="relative flex-1 overflow-x-hidden bg-bg">
      <div className="mx-auto min-h-[100svh] max-w-md px-5 pb-10 pt-7">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-block text-2xl text-mute transition-all duration-200 hover:-translate-x-0.5 hover:text-text"
              aria-label="Tillbaka"
            >
              ←
            </Link>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">Café Solsken</h1>
              <p className="text-xs text-mute">Företagsportal</p>
            </div>
          </div>
          <Link
            href="/skapa-jobb"
            className="bg-brand rounded-full px-4 py-2 text-sm font-bold text-white transition hover:brightness-110"
          >
            + Ny annons
          </Link>
        </div>

        {/* Statistik */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { tal: "2", text: "Aktiva annonser" },
            { tal: "20", text: "Intresserade" },
            { tal: "2 tim", text: "Svarstid" },
          ].map((s) => (
            <div key={s.text} className="rounded-2xl border border-white/10 bg-white/5 py-4 text-center">
              <p className="text-xl font-extrabold text-brand">{s.tal}</p>
              <p className="mt-0.5 text-[11px] font-medium text-mute">{s.text}</p>
            </div>
          ))}
        </div>

        {/* Dina annonser */}
        <h2 className="mt-7 text-lg font-bold">Dina annonser</h2>
        <div className="mt-3 flex flex-col gap-3">
          {annonser.map((a) => (
            <div key={a.titel} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <p className="font-bold">{a.titel}</p>
                <span className="rounded-full bg-frisk/15 px-2.5 py-1 text-[11px] font-bold text-frisk">
                  {a.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-mute">{a.typ}</p>
              <p className="mt-2 text-sm font-semibold text-brand">
                👀 {a.intresserade} intresserade kandidater
              </p>
            </div>
          ))}
        </div>

        {/* Kandidater som vibe-kort */}
        <h2 className="mt-7 text-lg font-bold">Intresserade kandidater</h2>
        <p className="text-sm text-mute">Vi visar vibe och bevisade badges – inte tråkiga CV:n.</p>
        <div className="mt-3 flex flex-col gap-3">
          {kandidater.map((k) => (
            <div key={k.namn} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="bg-brand-soft flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl">
                {k.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold">{k.namn}</p>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-brand">
                    {k.match}% match
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-mute">{k.vibe}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {k.badges.map((b) => (
                    <span key={b} className="rounded-full bg-frisk/10 px-2.5 py-1 text-[11px] font-semibold text-frisk">
                      {b}
                    </span>
                  ))}
                </div>
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
      </div>
    </main>
  );
}
