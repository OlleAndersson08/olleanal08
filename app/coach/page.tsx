"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/*
  AI-karriärcoach (demo).
  Färdiga svar på de vanligaste frågorna unga har. Riktig AI kopplas på
  senare – men flödet och känslan är på plats.
*/

type Meddelande = { roll: "ai" | "jag"; text: string };

const svar: { fraga: string; svar: string }[] = [
  {
    fraga: "Får jag jobba om jag är 14?",
    svar: "Ja, fast med regler! Från 13 får du ta lättare jobb (t.ex. dela ut reklam, enklare butiksjobb) med förälders godkännande. Från 15 (och avslutad grundskoleår) får du mer. Vill du att jag visar gig som passar din ålder?",
  },
  {
    fraga: "Vad säger jag när chefen ringer?",
    svar: "Håll det enkelt: ”Hej, det är [namn]! Vad kul att ni hör av er.” Le när du pratar – det hörs. Ha papper och penna redo för tid och plats. Avsluta med ”Tack, vi ses då!” Vill du öva ett samtal med mig?",
  },
  {
    fraga: "Hur mycket får jag tjäna skattefritt?",
    svar: "2024/2025 ligger gränsen runt 24 000 kr på ett år. Tjänar du under det behöver du oftast inte betala skatt – men fyll i en blankett (intyg för utbetalning av lön utan skatteavdrag) hos arbetsgivaren. Vill du ha en lektion om det?",
  },
  {
    fraga: "Jag är nervös inför min första intervju.",
    svar: "Helt normalt! Tre saker: 1) Kom 5 min innan. 2) Ha ett svar redo på ”berätta om dig själv” (30 sek). 3) Ställ EN egen fråga, t.ex. ”hur ser en vanlig dag ut?”. Det visar intresse. Vill du köra en snabb intervjuträning?",
  },
];

const fallback =
  "Bra fråga! Den riktiga AI-coachen som svarar på allt är på väg. Tills dess: kolla lektionerna under Väx – de täcker det mesta om ditt första jobb. 🌱";

export default function Coach() {
  const [meddelanden, setMeddelanden] = useState<Meddelande[]>([
    { roll: "ai", text: "Hej! Jag är din karriärcoach 🤖 Fråga mig vad som helst om jobb, lön eller intervjuer. Vad funderar du på?" },
  ]);
  const [text, setText] = useState("");
  const slutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    slutRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [meddelanden]);

  function skicka(fraga: string) {
    const ren = fraga.trim();
    if (!ren) return;
    setMeddelanden((m) => [...m, { roll: "jag", text: ren }]);
    setText("");
    const traff = svar.find((s) => s.fraga === ren);
    setTimeout(() => {
      setMeddelanden((m) => [...m, { roll: "ai", text: traff ? traff.svar : fallback }]);
    }, 600);
  }

  const oanvanda = svar.filter((s) => !meddelanden.some((m) => m.text === s.fraga));

  return (
    <main className="flex h-[100svh] flex-1 flex-col bg-bg">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <Link
          href="/vax"
          className="inline-block text-2xl text-mute transition-all duration-200 hover:-translate-x-0.5 hover:text-text"
          aria-label="Tillbaka"
        >
          ←
        </Link>
        <span className="bg-brand flex h-9 w-9 items-center justify-center rounded-full text-lg">🤖</span>
        <div>
          <p className="font-bold leading-tight">Karriärcoach</p>
          <p className="flex items-center gap-1 text-[11px] text-frisk">
            <span className="h-1.5 w-1.5 rounded-full bg-frisk" /> Online
          </p>
        </div>
      </header>

      {/* Meddelanden */}
      <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-5">
        {meddelanden.map((m, i) => (
          <div key={i} className={`flex ${m.roll === "jag" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                m.roll === "jag"
                  ? "bg-brand rounded-br-md text-white"
                  : "rounded-bl-md border border-white/10 bg-white/5 text-text"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={slutRef} />
      </div>

      {/* Förslag */}
      {oanvanda.length > 0 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
          {oanvanda.map((s) => (
            <button
              key={s.fraga}
              type="button"
              onClick={() => skicka(s.fraga)}
              className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-mute transition hover:text-text"
            >
              {s.fraga}
            </button>
          ))}
        </div>
      )}

      {/* Inmatning */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          skicka(text);
        }}
        className="flex items-center gap-2 border-t border-white/10 px-4 py-3"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Skriv en fråga ..."
          className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-text outline-none placeholder:text-mute focus:border-rose/50"
        />
        <button
          type="submit"
          className="bg-brand flex h-12 w-12 items-center justify-center rounded-full text-white transition hover:brightness-110 active:scale-95"
          aria-label="Skicka"
        >
          ↑
        </button>
      </form>
    </main>
  );
}
