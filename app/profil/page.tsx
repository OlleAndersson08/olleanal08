import Meny from "@/components/Meny";

/*
  Profilsidan (mörkt tema) med statusrad för spel-känsla.
  (Låtsasuppgifter än så länge.)
*/

const statistik = [
  { tal: "3", text: "Ansökningar" },
  { tal: "47", text: "Profilvisningar" },
  { tal: "🔥 5", text: "Dagars streak" },
];

const ansokningar = [
  { foretag: "Café Solsken", titel: "Barista", emoji: "☕", status: "Skickad" },
  { foretag: "ICA Maxi", titel: "Kassa & påfyllning", emoji: "🛒", status: "Skickad" },
  { foretag: "Sommarstad Glassbar", titel: "Glassförsäljare", emoji: "🍦", status: "Sedd av företaget" },
];

export default function Profil() {
  return (
    <main className="relative flex-1 overflow-x-hidden bg-bg">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="anim-float absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-rose/20 blur-[90px]" />
      </div>

      <div className="relative mx-auto min-h-[100svh] max-w-md px-6 pb-28 pt-10">
        {/* Topp: bild och namn */}
        <div className="anim-up flex flex-col items-center text-center">
          <div className="relative">
            <div className="bg-brand-anim flex h-24 w-24 items-center justify-center rounded-full text-4xl shadow-xl">
              🙂
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-bg bg-frisk text-xs">
              ✓
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Olle Andersson</h1>
          <p className="mt-1 text-mute">📍 Stockholm · 17 år</p>

          <button
            type="button"
            className="glas mt-4 rounded-full px-5 py-2 text-sm font-semibold transition hover:bg-white/10"
          >
            Redigera profil
          </button>
        </div>

        {/* Statusrad */}
        <div className="anim-up mt-7 grid grid-cols-3 gap-2" style={{ animationDelay: "0.1s" }}>
          {statistik.map((s) => (
            <div
              key={s.text}
              className="rounded-2xl border border-white/10 bg-white/5 py-4 text-center"
            >
              <p className="text-xl font-extrabold text-brand">{s.tal}</p>
              <p className="mt-0.5 text-[11px] font-medium text-mute">{s.text}</p>
            </div>
          ))}
        </div>

        {/* Om mig */}
        <section className="anim-up mt-8" style={{ animationDelay: "0.16s" }}>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-mute">Om mig</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            Glad och driven 17-åring som gillar att jobba med människor. Söker
            mitt första sommarjobb och lär mig snabbt!
          </div>
        </section>

        {/* Mina ansökningar */}
        <section className="anim-up mt-8" style={{ animationDelay: "0.22s" }}>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-mute">
            Mina ansökningar
          </h2>
          <div className="flex flex-col gap-3">
            {ansokningar.map((a) => (
              <div
                key={a.foretag}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <span className="bg-brand-soft flex h-11 w-11 items-center justify-center rounded-xl text-xl">
                  {a.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{a.foretag}</p>
                  <p className="truncate text-sm text-mute">{a.titel}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                    a.status === "Skickad"
                      ? "bg-frisk/15 text-frisk"
                      : "bg-violet/15 text-violet"
                  }`}
                >
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Meny />
    </main>
  );
}
