"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TYPER, type Mojlighet } from "@/data/mojligheter";
import { ansokAction } from "@/lib/actions";

/*
  Möjlighetskort – ett kort som fyller skärmen, som ett TikTok-klipp.
  Fungerar för ALLA kategorier (jobb, gig, praktik, volontär ...).
  Färgkodas efter kategori (Spotify-stil) och visar en typ-tagg.
  Beroende-mekanik: dubbeltryck = gilla + hjärt-explosion, actionrad,
  matchnings-% med förklaring, spring-animation, ett-kliks-intresse.
*/

function formatTal(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".", ",") + " tn";
  return String(n);
}

export default function Jobbkort({
  jobb,
  redanAnsokt = false,
  inloggad = false,
}: {
  jobb: Mojlighet;
  redanAnsokt?: boolean;
  inloggad?: boolean;
}) {
  const [gillad, setGillad] = useState(false);
  const [sparad, setSparad] = useState(false);
  const [intresserad, setIntresserad] = useState(redanAnsokt);
  const [burst, setBurst] = useState(0);
  const [synlig, setSynlig] = useState(0);
  const sistaTryck = useRef(0);
  const sektionRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const [, startTransition] = useTransition();

  function ansok() {
    if (intresserad) return;
    if (!inloggad) {
      router.push("/registrera");
      return;
    }
    setIntresserad(true); // optimistiskt
    startTransition(() => {
      ansokAction(jobb.id);
    });
  }

  const typ = TYPER[jobb.typ];
  const antalGillar = jobb.gillar + (gillad ? 1 : 0);
  const matchText = jobb.avstandKm <= 2 ? "📍 Nära dig" : "✨ Baserat på dina intressen";

  useEffect(() => {
    const el = sektionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio > 0.6) setSynlig((s) => s + 1);
      },
      { threshold: [0, 0.6, 1] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function poppaHjarta() {
    setBurst((b) => b + 1);
  }
  function gilla() {
    if (!gillad) setGillad(true);
    poppaHjarta();
  }
  function hanteraTryck() {
    const nu = Date.now();
    if (nu - sistaTryck.current < 300) gilla();
    sistaTryck.current = nu;
  }
  function dela() {
    const text = `${jobb.titel} hos ${jobb.foretag} på Knega`;
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "Knega", text }).catch(() => {});
    }
  }

  return (
    <section
      ref={sektionRef}
      onClick={hanteraTryck}
      className="relative flex h-[100svh] snap-start snap-always select-none flex-col justify-end overflow-hidden"
      style={{ backgroundImage: `linear-gradient(160deg, ${typ.fran}, ${typ.till})` }}
    >
      {/* Video fyller kortet om den finns – annars stor emoji */}
      {jobb.videoUrl ? (
        <video
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          src={jobb.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <div className="anim-float pointer-events-none absolute inset-x-0 top-[12%] flex justify-center">
          <span className="text-[8rem] drop-shadow-xl">{jobb.emoji}</span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      {/* Topp: match (med förklaring) + tittar nu */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between px-5 pt-5">
        <div className="flex flex-col items-start gap-1.5">
          <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-bold text-white backdrop-blur text-skugga-mjuk">
            ⚡ {jobb.match}% match
          </span>
          <span className="rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-white/90 backdrop-blur text-skugga-mjuk">
            {matchText}
          </span>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur text-skugga-mjuk">
          <span className="h-1.5 w-1.5 rounded-full bg-frisk" />
          {jobb.tittarNu} tittar nu
        </span>
      </div>

      {/* Dubbeltryck-hjärtan */}
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        {burst > 0 && (
          <span key={burst} className="anim-heart text-[8rem] drop-shadow-2xl">
            ❤️
          </span>
        )}
      </div>

      {/* Actionrad */}
      <div className="absolute bottom-36 right-3 z-30 flex flex-col items-center gap-5">
        <span className="bg-brand flex h-12 w-12 items-center justify-center rounded-full text-xl ring-2 ring-white/70">
          {jobb.emoji}
        </span>
        <RailKnapp
          aktiv={gillad}
          onClick={(e) => {
            e.stopPropagation();
            gilla();
          }}
          label={formatTal(antalGillar)}
          ariaLabel={gillad ? "Du gillar det här" : "Gilla"}
        >
          <Hjarta fylld={gillad} />
        </RailKnapp>
        <RailKnapp
          aktiv={sparad}
          onClick={(e) => {
            e.stopPropagation();
            setSparad((s) => !s);
          }}
          label={sparad ? "Sparad" : "Spara"}
          ariaLabel={sparad ? "Sparad" : "Spara"}
        >
          <Bokmarke fylld={sparad} />
        </RailKnapp>
        <RailKnapp
          onClick={(e) => {
            e.stopPropagation();
            dela();
          }}
          label="Dela"
          ariaLabel="Dela"
        >
          <Dela />
        </RailKnapp>
      </div>

      {/* Innehåll – spring in vid svep */}
      <div key={synlig} className="spring relative z-10 px-5 pb-28 pr-20 pt-10 text-white">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {/* Kategori-tagg */}
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-black/80 text-skugga-mjuk">
            {typ.emoji} {typ.etikett}
          </span>
          {jobb.taggar.slice(0, 2).map((tagg) => (
            <span
              key={tagg}
              className="rounded-full bg-black/25 px-3 py-1 text-xs font-medium backdrop-blur-sm text-skugga-mjuk"
            >
              {tagg}
            </span>
          ))}
        </div>

        <p className="text-sm font-semibold opacity-95 text-skugga">{jobb.foretag}</p>
        <h2 className="mt-1 text-[1.9rem] font-extrabold leading-tight text-skugga">{jobb.titel}</h2>

        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold opacity-95 text-skugga">
          <span>📍 {jobb.avstandKm === 0 ? jobb.ort : `${jobb.avstandKm} km bort`}</span>
          <span className="opacity-50">·</span>
          <span>💰 {jobb.ersattning}</span>
        </p>

        <p className="mt-2.5 max-w-sm text-[15px] leading-relaxed opacity-95 text-skugga-mjuk">
          {jobb.beskrivning}
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            ansok();
          }}
          disabled={intresserad}
          className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-7 py-4 text-base font-extrabold transition-all duration-200 ease-out active:scale-[0.97] ${
            intresserad
              ? "bg-frisk text-white"
              : "bg-white text-rose shadow-lg hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/30 hover:brightness-105"
          }`}
        >
          {intresserad ? (
            <span className="anim-bump">Intresse skickat ✓</span>
          ) : (
            "❤️ Jag är intresserad"
          )}
        </button>
      </div>
    </section>
  );
}

function RailKnapp({
  children,
  label,
  onClick,
  aktiv,
  ariaLabel,
}: {
  children: React.ReactNode;
  label: string;
  onClick: (e: React.MouseEvent) => void;
  aktiv?: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={aktiv}
      className="flex flex-col items-center gap-1 transition-transform duration-150 hover:scale-110 active:scale-90"
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full backdrop-blur transition ${
          aktiv ? "bg-white/90 text-rose" : "bg-black/35 text-white"
        } ${aktiv ? "anim-bump" : ""}`}
      >
        {children}
      </span>
      <span className="text-[11px] font-semibold text-white text-skugga">{label}</span>
    </button>
  );
}

function Hjarta({ fylld }: { fylld: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={fylld ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}
function Bokmarke({ fylld }: { fylld: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={fylld ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function Dela() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}
