"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/*
  AI-karriärcoach – pratar med en riktig Claude-modell via /api/coach.
  Svaret streamas in ord för ord. Finns ingen API-nyckel svarar servern
  med ett snällt reservmeddelande.
*/

type Meddelande = { roll: "ai" | "jag"; text: string };

const forslag = [
  "Får jag jobba om jag är 14?",
  "Vad säger jag när chefen ringer?",
  "Hur mycket får jag tjäna skattefritt?",
  "Jag är nervös inför min första intervju.",
];

export default function Coach() {
  const [meddelanden, setMeddelanden] = useState<Meddelande[]>([
    { roll: "ai", text: "Hej! Jag är din karriärcoach 🤖 Fråga mig vad som helst om jobb, lön eller intervjuer. Vad funderar du på?" },
  ]);
  const [text, setText] = useState("");
  const [skickar, setSkickar] = useState(false);
  const slutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    slutRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [meddelanden]);

  async function skicka(fraga: string) {
    const ren = fraga.trim();
    if (!ren || skickar) return;

    const nyaMeddelanden: Meddelande[] = [...meddelanden, { roll: "jag", text: ren }];
    setMeddelanden([...nyaMeddelanden, { roll: "ai", text: "" }]);
    setText("");
    setSkickar(true);

    // Bygg historiken för API:t (hoppa över första hälsningen).
    const payload = nyaMeddelanden.slice(1).map((m) => ({
      role: m.roll === "jag" ? "user" : "assistant",
      content: m.text,
    }));

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let svar = "";
      if (reader) {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          svar += decoder.decode(value, { stream: true });
          setMeddelanden((m) => {
            const kopia = [...m];
            kopia[kopia.length - 1] = { roll: "ai", text: svar };
            return kopia;
          });
        }
      }
      if (!svar) {
        setMeddelanden((m) => {
          const kopia = [...m];
          kopia[kopia.length - 1] = { roll: "ai", text: "Jag fick inget svar. Försök igen om en stund." };
          return kopia;
        });
      }
    } catch {
      setMeddelanden((m) => {
        const kopia = [...m];
        kopia[kopia.length - 1] = { roll: "ai", text: "Något gick fel. Försök igen om en stund." };
        return kopia;
      });
    } finally {
      setSkickar(false);
    }
  }

  const visaForslag = meddelanden.length <= 1 && !skickar;

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
            <span className="h-1.5 w-1.5 rounded-full bg-frisk" /> {skickar ? "Skriver ..." : "Online"}
          </p>
        </div>
      </header>

      {/* Meddelanden */}
      <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-5">
        {meddelanden.map((m, i) => (
          <div key={i} className={`flex ${m.roll === "jag" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                m.roll === "jag"
                  ? "bg-brand rounded-br-md text-white"
                  : "rounded-bl-md border border-white/10 bg-white/5 text-text"
              }`}
            >
              {m.text || <span className="opacity-50">…</span>}
            </div>
          </div>
        ))}
        <div ref={slutRef} />
      </div>

      {/* Förslag */}
      {visaForslag && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
          {forslag.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => skicka(f)}
              className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-mute transition hover:text-text"
            >
              {f}
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
          disabled={skickar}
          className="bg-brand flex h-12 w-12 items-center justify-center rounded-full text-white transition hover:brightness-110 active:scale-95 disabled:opacity-50"
          aria-label="Skicka"
        >
          ↑
        </button>
      </form>
    </main>
  );
}
