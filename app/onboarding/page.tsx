"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/*
  Onboarding – under 60 sek, känns som en quiz inte ett formulär.
  Vi frågar om mål och vibe (inte meriter) så att en 15-åring känner
  "den här sidan förstår mig bättre än LinkedIn". Konto först senare.
*/

const mal = [
  { id: "pengar", emoji: "💰", text: "Tjäna pengar nu" },
  { id: "sommar", emoji: "☀️", text: "Hitta sommarjobb" },
  { id: "extra", emoji: "⚡", text: "Extrajobb vid skolan" },
  { id: "framtid", emoji: "🚀", text: "Bygga min framtid" },
];

const vibes = [
  { id: "service", emoji: "☕", text: "Service" },
  { id: "mat", emoji: "🍕", text: "Mat" },
  { id: "barn", emoji: "🧒", text: "Barn" },
  { id: "teknik", emoji: "💻", text: "Teknik" },
  { id: "kreativt", emoji: "🎨", text: "Kreativt" },
  { id: "utomhus", emoji: "🌿", text: "Utomhus" },
  { id: "fysiskt", emoji: "💪", text: "Fysiskt" },
  { id: "bil", emoji: "🚗", text: "Köra/leverera" },
  { id: "djur", emoji: "🐕", text: "Djur" },
];

export default function Onboarding() {
  const router = useRouter();
  const [steg, setSteg] = useState(0);
  const [valdaMal, setValdaMal] = useState<string[]>([]);
  const [valdaVibes, setValdaVibes] = useState<string[]>([]);
  const totalSteg = 4;

  function vaxla(lista: string[], set: (v: string[]) => void, id: string) {
    set(lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id]);
  }

  return (
    <main className="relative flex h-[100svh] flex-1 flex-col overflow-hidden bg-bg">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="anim-float absolute -top-24 -right-20 h-72 w-72 rounded-full bg-rose/25 blur-[90px]" />
        <div className="anim-float absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-violet/20 blur-[90px]" style={{ animationDelay: "2s" }} />
      </div>

      {/* Progress */}
      <div className="relative flex gap-1.5 px-5 pt-5">
        {Array.from({ length: totalSteg }).map((_, i) => (
          <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
            <span
              className="block h-full rounded-full bg-brand transition-all duration-300"
              style={{ width: i <= steg ? "100%" : "0%" }}
            />
          </span>
        ))}
      </div>

      <div className="relative flex flex-1 flex-col px-6 pt-8">
        {/* Steg 0: mål */}
        {steg === 0 && (
          <div className="anim-up flex flex-1 flex-col">
            <h1 className="text-[1.9rem] font-extrabold leading-tight">Vad är du ute efter?</h1>
            <p className="mt-1 text-mute">Välj en eller flera. Vi fixar resten.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {mal.map((m) => {
                const vald = valdaMal.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => vaxla(valdaMal, setValdaMal, m.id)}
                    className={`flex flex-col items-start gap-2 rounded-3xl border p-5 text-left transition active:scale-95 ${
                      vald ? "border-transparent bg-brand text-white" : "border-white/10 bg-white/5 hover:bg-white/[0.08]"
                    }`}
                  >
                    <span className="text-3xl">{m.emoji}</span>
                    <span className="font-bold leading-tight">{m.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Steg 1: vibe */}
        {steg === 1 && (
          <div className="anim-up flex flex-1 flex-col">
            <h1 className="text-[1.9rem] font-extrabold leading-tight">Vad gillar du?</h1>
            <p className="mt-1 text-mute">Inga meriter. Bara det du tycker är kul.</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {vibes.map((v) => {
                const vald = valdaVibes.includes(v.id);
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => vaxla(valdaVibes, setValdaVibes, v.id)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition active:scale-95 ${
                      vald ? "border-transparent bg-brand text-white" : "border-white/10 bg-white/5 hover:bg-white/[0.08]"
                    }`}
                  >
                    <span className="text-2xl">{v.emoji}</span>
                    <span className="text-xs font-semibold">{v.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Steg 2: plats + ålder */}
        {steg === 2 && (
          <div className="anim-up flex flex-1 flex-col">
            <h1 className="text-[1.9rem] font-extrabold leading-tight">Sista grejen 📍</h1>
            <p className="mt-1 text-mute">Så vi bara visar möjligheter du faktiskt kan ta.</p>
            <div className="mt-6 flex flex-col gap-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Var bor du?</span>
                <input
                  placeholder="Stockholm"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-text outline-none placeholder:text-mute focus:border-rose/50"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Hur gammal är du?</span>
                <input
                  type="number"
                  placeholder="16"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-text outline-none placeholder:text-mute focus:border-rose/50"
                />
              </label>
            </div>
          </div>
        )}

        {/* Steg 3: belöning */}
        {steg === 3 && (
          <div className="anim-scale flex flex-1 flex-col items-center justify-center text-center">
            <span className="anim-float text-6xl">🎯</span>
            <h1 className="mt-5 text-[1.9rem] font-extrabold leading-tight">
              Vi hittade <span className="text-brand">37 möjligheter</span> nära dig!
            </h1>
            <p className="mt-2 max-w-xs text-mute">
              Baserat på din vibe. Börja svepa – matchningen blir bättre för varje sekund.
            </p>
          </div>
        )}

        {/* Knappar */}
        <div className="relative pb-8 pt-4">
          <button
            type="button"
            onClick={() => (steg < totalSteg - 1 ? setSteg(steg + 1) : router.push("/jobb"))}
            className="bg-brand w-full rounded-2xl px-7 py-4 text-lg font-bold text-white shadow-xl shadow-rose/25 transition hover:brightness-110 active:scale-[0.98]"
          >
            {steg < totalSteg - 1 ? "Fortsätt" : "Visa mina möjligheter →"}
          </button>
          {steg < totalSteg - 1 && (
            <button
              type="button"
              onClick={() => router.push("/jobb")}
              className="mt-3 w-full text-center text-sm font-semibold text-mute transition hover:text-text"
            >
              Hoppa över
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
