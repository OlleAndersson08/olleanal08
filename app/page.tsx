import Link from "next/link";
import Knapp from "@/components/Knapp";
import { TYPER } from "@/data/mojligheter";

/*
  Startsidan – 365-dagarspositionering: tjäna pengar + bygg din framtid.
  Mörk, neon-premium, byggd för att suga in unga direkt.
*/

const kategorier = Object.values(TYPER).map((t) => `${t.emoji} ${t.etikett}`);

export default function Startsida() {
  return (
    <main className="relative flex-1 overflow-x-hidden bg-bg">
      {/* Animerade gradient-blobbar */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="anim-float absolute -top-24 -right-20 h-80 w-80 rounded-full bg-rose/30 blur-[90px]" />
        <div className="anim-float absolute top-52 -left-24 h-72 w-72 rounded-full bg-flame/25 blur-[90px]" style={{ animationDelay: "1.5s" }} />
        <div className="anim-float absolute bottom-10 right-0 h-72 w-72 rounded-full bg-violet/25 blur-[90px]" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-md flex-col px-6 pb-10 pt-7">
        {/* Header */}
        <header className="anim-in flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-frisk opacity-70 [animation:pulse-ring_2s_ease-out_infinite]" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-frisk" />
            </span>
            <span className="text-brand">Knega</span>
          </span>
          <Link href="/logga-in" className="glas rounded-full px-4 py-2 text-sm font-semibold text-text transition hover:bg-white/10">
            Logga in
          </Link>
        </header>

        {/* Hero */}
        <div className="mt-11">
          <span className="anim-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-mute" style={{ animationDelay: "0.05s" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-frisk" />
            Sveriges plattform för unga 15–25
          </span>

          <h1 className="anim-up mt-5 text-[3rem] font-extrabold leading-[0.98] tracking-tight" style={{ animationDelay: "0.12s" }}>
            Tjäna pengar.
            <br />
            Bygg din{" "}
            <span className="text-brand-anim">framtid.</span>
          </h1>

          <p className="anim-up mt-4 text-lg leading-relaxed text-mute" style={{ animationDelay: "0.2s" }}>
            Sommarjobb, extrajobb, gig och praktik – allt på ett ställe.{" "}
            <span className="font-semibold text-text">Svep, matcha, sök på en sekund.</span>
          </p>
        </div>

        {/* Svävande förhandsvisning */}
        <div className="anim-scale relative mt-9 flex justify-center" style={{ animationDelay: "0.3s" }}>
          <div className="absolute top-6 h-64 w-48 rounded-[3rem] bg-brand opacity-40 blur-3xl" />
          <div className="anim-float relative w-60 rounded-[2.4rem] border border-white/10 bg-yta p-2.5 shadow-2xl">
            <div className="relative overflow-hidden rounded-[1.9rem]" style={{ backgroundImage: "linear-gradient(160deg,#f7971e,#ff5e62)" }}>
              <div className="flex h-80 flex-col justify-end p-4 text-white">
                <span className="absolute right-3 top-3 rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-bold backdrop-blur">
                  92% match
                </span>
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-black/80">
                  💸 Gig
                </span>
                <span className="text-4xl drop-shadow">📦</span>
                <p className="mt-2 text-sm font-bold drop-shadow">Flytthjälp på lördag</p>
                <p className="text-xs opacity-90 drop-shadow">📍 1 km · 💰 500 kr / 3h</p>
                <div className="mt-3 rounded-xl bg-white py-2.5 text-center text-xs font-extrabold text-rose">
                  ❤️ Jag är intresserad
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="anim-up mt-auto pt-9" style={{ animationDelay: "0.4s" }}>
          <Knapp href="/onboarding" glow className="w-full text-lg">
            Kom igång – 30 sek →
          </Knapp>
          <p className="mt-4 text-center text-sm text-mute">
            Är du företag?{" "}
            <Link href="/foretag" className="font-semibold text-text underline-offset-4 hover:underline">
              Lägg upp en möjlighet gratis
            </Link>
          </p>
        </div>
      </div>

      {/* Rullande kategorier */}
      <div className="relative border-t border-white/5 py-5">
        <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <div className="anim-marquee flex shrink-0 gap-3 pr-3">
            {[...kategorier, ...kategorier].map((k, i) => (
              <span key={i} className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-mute">
                {k}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-5 flex items-center justify-center gap-5 text-sm text-mute">
          <Link href="/om" className="hover:text-text">Om oss</Link>
          <span className="opacity-30">·</span>
          <Link href="/foretag" className="hover:text-text">För företag</Link>
        </div>
      </div>
    </main>
  );
}
