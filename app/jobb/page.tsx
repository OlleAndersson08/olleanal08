import Jobbkort from "@/components/Jobbkort";
import Meny from "@/components/Meny";
import { jobb } from "@/data/jobb";

/*
  Jobbflödet – hjärtat i appen.
  Korten staplas på varandra och "snäpper" på plats när man sveper,
  precis som klippen i TikTok.
*/

export default function JobbFlode() {
  return (
    <main className="relative flex-1 bg-natt">
      <div className="mx-auto h-[100svh] max-w-md snap-y snap-mandatory overflow-y-scroll no-scrollbar">
        {jobb.map((j) => (
          <Jobbkort key={j.id} jobb={j} />
        ))}

        {/* Sista vyn: slut på flödet */}
        <section className="flex h-[100svh] snap-start flex-col items-center justify-center gap-4 bg-natt px-8 text-center text-white">
          <span className="text-5xl">🎉</span>
          <h2 className="text-2xl font-bold">Du har sett alla jobb!</h2>
          <p className="text-white/60">
            Fler jobb dyker upp hela tiden. Kika i din profil så länge.
          </p>
        </section>
      </div>

      <Meny />
    </main>
  );
}
