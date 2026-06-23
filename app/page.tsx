import Link from "next/link";
import Knapp from "@/components/Knapp";

/*
  Startsidan 2.0 – mörk, neon-premium, byggd för att suga in unga direkt.
  Animerad gradient-bakgrund, socialt bevis, svävande feed-förhandsvisning
  och rörelse som belönar ögat. Allt med ren CSS = supersnabbt.
*/

const kategorier = [
  "☕ Café",
  "🛒 Butik",
  "🍦 Glass",
  "📦 Lager",
  "🌱 Trädgård",
  "🍕 Servis",
  "🏊 Bad",
  "🎪 Event",
];

export default function Startsida() {
  return (
    <main className="relative flex-1 overflow-x-hidden bg-bg">
      {/* Animerade gradient-blobbar i bakgrunden */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="anim-float absolute -top-24 -right-20 h-80 w-80 rounded-full bg-rose/30 blur-[90px]" />
        <div
          className="anim-float absolute top-52 -left-24 h-72 w-72 rounded-full bg-flame/25 blur-[90px]"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="anim-float absolute bottom-10 right-0 h-72 w-72 rounded-full bg-violet/25 blur-[90px]"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-md flex-col px-6 pb-10 pt-7">
        {/* Header */}
        <header className="anim-in flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-frisk opacity-70 [animation:pulse-ring_2s_ease-out_infinite]" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-frisk" />
            </span>
            Sommar<span className="text-brand">Match</span>
          </span>
          <Link
            href="/logga-in"
            className="glas rounded-full px-4 py-2 text-sm font-semibold text-text transition hover:bg-white/10"
          >
            Logga in
          </Link>
        </header>

        {/* Hero */}
        <div className="mt-11">
          <span
            className="anim-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-mute"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-frisk" />
            12 480 unga matchade i sommar
          </span>

          <h1
            className="anim-up mt-5 text-[3rem] font-extrabold leading-[0.98] tracking-tight"
            style={{ animationDelay: "0.12s" }}
          >
            Svep dig
            <br />
            till{" "}
            <span className="text-brand-anim">sommar­jobbet</span>
          </h1>

          <p
            className="anim-up mt-4 text-lg leading-relaxed text-mute"
            style={{ animationDelay: "0.2s" }}
          >
            Inga CV. Inget krångel. Svep mellan jobb nära dig och sök med{" "}
            <span className="font-semibold text-text">ett enda klick.</span>
          </p>
        </div>

        {/* Svävande feed-förhandsvisning */}
        <div
          className="anim-scale relative mt-9 flex justify-center"
          style={{ animationDelay: "0.3s" }}
        >
          {/* glöd bakom telefonen */}
          <div className="absolute top-6 h-64 w-48 rounded-[3rem] bg-brand opacity-40 blur-3xl" />
          <div className="anim-float relative w-60 rounded-[2.4rem] border border-white/10 bg-yta p-2.5 shadow-2xl">
            <div
              className="relative overflow-hidden rounded-[1.9rem]"
              style={{ backgroundImage: "linear-gradient(160deg,#ff9d4d,#ff2d78)" }}
            >
              <div className="flex h-80 flex-col justify-end p-4 text-white">
                <span className="absolute right-3 top-3 rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-bold backdrop-blur">
                  96% match
                </span>
                <span className="text-4xl drop-shadow">☕</span>
                <p className="mt-2 text-sm font-bold drop-shadow">Café Solsken</p>
                <p className="text-xs opacity-90 drop-shadow">Barista · sommar</p>
                <p className="mt-0.5 text-xs opacity-90 drop-shadow">
                  📍 2 km bort · 130 kr/h
                </p>
                <div className="mt-3 rounded-xl bg-white py-2.5 text-center text-xs font-extrabold text-rose">
                  ❤️ Jag är intresserad
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="anim-up mt-auto pt-9" style={{ animationDelay: "0.4s" }}>
          <Knapp href="/jobb" glow className="w-full text-lg">
            Kom igång – 30 sek →
          </Knapp>
          <p className="mt-4 text-center text-sm text-mute">
            Är du företag?{" "}
            <Link
              href="/registrera"
              className="font-semibold text-text underline-offset-4 hover:underline"
            >
              Lägg upp ett jobb gratis
            </Link>
          </p>
        </div>
      </div>

      {/* Rullande kategorier (marquee) */}
      <div className="relative border-t border-white/5 py-5">
        <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <div className="anim-marquee flex shrink-0 gap-3 pr-3">
            {[...kategorier, ...kategorier].map((k, i) => (
              <span
                key={i}
                className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-mute"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
