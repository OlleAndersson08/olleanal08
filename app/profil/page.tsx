import Meny from "@/components/Meny";

/*
  Profilsidan.
  Visar användarens uppgifter och deras ansökningar.
  (Låtsasuppgifter än så länge – kopplas till riktigt konto senare.)
*/

const ansokningar = [
  { foretag: "Café Solsken", titel: "Barista", emoji: "☕", status: "Skickad" },
  { foretag: "ICA Maxi", titel: "Kassa & påfyllning", emoji: "🛒", status: "Skickad" },
  { foretag: "Sommarstad Glassbar", titel: "Glassförsäljare", emoji: "🍦", status: "Sedd av företaget" },
];

export default function Profil() {
  return (
    <main className="flex-1 bg-papper">
      <div className="mx-auto min-h-[100svh] max-w-md px-6 pb-28 pt-8">
        {/* Topp: bild och namn */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-sol-gradient flex h-24 w-24 items-center justify-center rounded-full text-4xl text-white shadow-lg">
            🙂
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-bleck">
            Olle Andersson
          </h1>
          <p className="mt-1 text-dis">📍 Stockholm · 17 år</p>

          <button
            type="button"
            className="mt-4 rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-semibold text-bleck transition hover:bg-black/[0.03]"
          >
            Redigera profil
          </button>
        </div>

        {/* Om mig */}
        <section className="mt-8">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-dis">
            Om mig
          </h2>
          <div className="rounded-2xl border border-black/5 bg-white p-4 text-bleck shadow-sm">
            Glad och driven 17-åring som gillar att jobba med människor. Söker
            mitt första sommarjobb och lär mig snabbt!
          </div>
        </section>

        {/* Mina ansökningar */}
        <section className="mt-8">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-dis">
            Mina ansökningar
          </h2>
          <div className="flex flex-col gap-3">
            {ansokningar.map((a) => (
              <div
                key={a.foretag}
                className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/[0.04] text-xl">
                  {a.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-bleck">
                    {a.foretag}
                  </p>
                  <p className="truncate text-sm text-dis">{a.titel}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    a.status === "Skickad"
                      ? "bg-frisk/10 text-frisk"
                      : "bg-sol/10 text-sol-mork"
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
