"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

/*
  Studio – en bildredigerare där du kan meka fritt med reglagen ELLER bara
  berätta för AI-redigeraren "Vibe" hur du vill ha bilden. Vibe (Claude) tittar
  på bilden och översätter önskemålet till riktiga justeringar som appliceras
  direkt på duken. Allt renderas på canvas så förhandsvisningen = det du laddar ner.
*/

type Justeringar = {
  brightness: number;
  contrast: number;
  saturate: number;
  temperature: number;
  sepia: number;
  grayscale: number;
  hue: number;
  blur: number;
  vignette: number;
};

const STANDARD: Justeringar = {
  brightness: 1,
  contrast: 1,
  saturate: 1,
  temperature: 0,
  sepia: 0,
  grayscale: 0,
  hue: 0,
  blur: 0,
  vignette: 0,
};

type Meddelande = { roll: "ai" | "jag"; text: string };

// Reglage-definitioner för den manuella panelen.
const REGLAGE: { nyckel: keyof Justeringar; namn: string; min: number; max: number; steg: number }[] = [
  { nyckel: "brightness", namn: "Ljus", min: 0.3, max: 1.8, steg: 0.01 },
  { nyckel: "contrast", namn: "Kontrast", min: 0.3, max: 1.8, steg: 0.01 },
  { nyckel: "saturate", namn: "Mättnad", min: 0, max: 2.5, steg: 0.01 },
  { nyckel: "temperature", namn: "Värme", min: -100, max: 100, steg: 1 },
  { nyckel: "sepia", namn: "Sepia", min: 0, max: 1, steg: 0.01 },
  { nyckel: "grayscale", namn: "Svartvitt", min: 0, max: 1, steg: 0.01 },
  { nyckel: "hue", namn: "Nyans", min: -180, max: 180, steg: 1 },
  { nyckel: "blur", namn: "Mjukhet", min: 0, max: 12, steg: 0.1 },
  { nyckel: "vignette", namn: "Vinjett", min: 0, max: 1, steg: 0.01 },
];

// Förinställningar – ett tryck för en färdig stämning.
const FORINSTALLNINGAR: { namn: string; emoji: string; j: Partial<Justeringar> }[] = [
  { namn: "Original", emoji: "↺", j: {} },
  { namn: "Varm", emoji: "☀️", j: { temperature: 55, saturate: 1.12, brightness: 1.03, contrast: 1.05 } },
  { namn: "Filmisk", emoji: "🎬", j: { contrast: 1.2, saturate: 0.9, temperature: 15, vignette: 0.5, brightness: 0.98 } },
  { namn: "Svartvitt", emoji: "🎞️", j: { grayscale: 1, contrast: 1.15, brightness: 1.02, vignette: 0.25 } },
  { namn: "Vintage", emoji: "📼", j: { sepia: 0.45, contrast: 0.95, saturate: 0.8, temperature: 25, vignette: 0.35 } },
  { namn: "Kall", emoji: "❄️", j: { temperature: -40, saturate: 1.05, brightness: 1.05, contrast: 1.06 } },
  { namn: "Vibrant", emoji: "🌈", j: { saturate: 1.6, contrast: 1.12, brightness: 1.03 } },
];

const CHIPS = [
  "Gör den varmare ☀️",
  "Mer filmisk och dramatisk 🎬",
  "Svartvitt med känsla",
  "Ljusare och fräschare",
  "Som en mysig sommarkväll",
];

export default function Studio() {
  const [justeringar, setJusteringar] = useState<Justeringar>({ ...STANDARD });
  const [harBild, setHarBild] = useState(false);
  const [meddelanden, setMeddelanden] = useState<Meddelande[]>([
    {
      roll: "ai",
      text: "Tja! Jag är Vibe 🎨 din chilla redigerare. Släpp in en bild så fixar jag stämningen – berätta bara hur du vill ha den. ”Varmare”, ”filmisk”, ”som en sommarkväll”... jag fattar.",
    },
  ]);
  const [text, setText] = useState("");
  const [skickar, setSkickar] = useState(false);
  const [drar, setDrar] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const slutRef = useRef<HTMLDivElement>(null);

  // Rita om bilden på duken varje gång en justering ändras.
  const rita = useCallback((j: Justeringar) => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Behåll kvalitet men tak för prestanda/minne.
    const maxSida = 1800;
    const skala = Math.min(1, maxSida / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.round(img.naturalWidth * skala);
    const h = Math.round(img.naturalHeight * skala);
    canvas.width = w;
    canvas.height = h;

    ctx.clearRect(0, 0, w, h);
    ctx.filter = `brightness(${j.brightness}) contrast(${j.contrast}) saturate(${j.saturate}) sepia(${j.sepia}) grayscale(${j.grayscale}) hue-rotate(${j.hue}deg) blur(${j.blur}px)`;
    ctx.drawImage(img, 0, 0, w, h);
    ctx.filter = "none";

    // Färgtemperatur – varm (orange) eller kall (blå) ton med soft-light.
    if (j.temperature !== 0) {
      const styrka = Math.min(Math.abs(j.temperature) / 100, 1) * 0.5;
      ctx.globalCompositeOperation = "soft-light";
      ctx.fillStyle =
        j.temperature > 0 ? `rgba(255, 165, 70, ${styrka})` : `rgba(70, 150, 255, ${styrka})`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
    }

    // Vinjett – mjukt mörka hörn för filmisk känsla.
    if (j.vignette > 0) {
      const cx = w / 2;
      const cy = h / 2;
      const yttre = Math.hypot(cx, cy);
      const grad = ctx.createRadialGradient(cx, cy, yttre * 0.55, cx, cy, yttre);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, `rgba(0,0,0,${j.vignette * 0.85})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  }, []);

  useEffect(() => {
    if (harBild) rita(justeringar);
  }, [justeringar, harBild, rita]);

  useEffect(() => {
    slutRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [meddelanden]);

  function laddaBild(fil: File | undefined) {
    if (!fil || !fil.type.startsWith("image/")) return;
    const lasare = new FileReader();
    lasare.onload = () => {
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setHarBild(true);
        setJusteringar({ ...STANDARD });
      };
      img.src = String(lasare.result);
    };
    lasare.readAsDataURL(fil);
  }

  function satt(nyckel: keyof Justeringar, varde: number) {
    setJusteringar((j) => ({ ...j, [nyckel]: varde }));
  }

  function forinstallning(j: Partial<Justeringar>) {
    setJusteringar({ ...STANDARD, ...j });
  }

  function laddaNer() {
    const canvas = canvasRef.current;
    if (!canvas || !harBild) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `studio-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  // Liten miniatyr av originalbilden som AI:n får titta på (håller kostnaden nere).
  function skapaMiniatyr(): string | undefined {
    const img = imgRef.current;
    if (!img) return undefined;
    const mini = document.createElement("canvas");
    const skala = Math.min(1, 420 / Math.max(img.naturalWidth, img.naturalHeight));
    mini.width = Math.max(1, Math.round(img.naturalWidth * skala));
    mini.height = Math.max(1, Math.round(img.naturalHeight * skala));
    const ctx = mini.getContext("2d");
    if (!ctx) return undefined;
    ctx.drawImage(img, 0, 0, mini.width, mini.height);
    return mini.toDataURL("image/jpeg", 0.7);
  }

  async function skicka(fraga: string) {
    const ren = fraga.trim();
    if (!ren || skickar) return;

    const nya: Meddelande[] = [...meddelanden, { roll: "jag", text: ren }];
    setMeddelanden([...nya, { roll: "ai", text: "" }]);
    setText("");
    setSkickar(true);

    const payload = nya.slice(1).map((m) => ({
      role: m.roll === "jag" ? "user" : "assistant",
      content: m.text,
    }));

    try {
      const res = await fetch("/api/redigera", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: payload,
          justeringar,
          bild: harBild ? skapaMiniatyr() : undefined,
        }),
      });
      const data = await res.json();
      if (data.justeringar && harBild) {
        setJusteringar({ ...STANDARD, ...data.justeringar });
      }
      setMeddelanden((m) => {
        const kopia = [...m];
        kopia[kopia.length - 1] = {
          roll: "ai",
          text: data.svar || "Klart! ✨",
        };
        return kopia;
      });
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

  const visaChips = meddelanden.length <= 1 && !skickar;

  return (
    <main className="flex h-[100svh] flex-col bg-bg">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-white/10 px-5 py-3.5">
        <Link
          href="/vax"
          className="text-2xl text-mute transition hover:-translate-x-0.5 hover:text-text"
          aria-label="Tillbaka"
        >
          ←
        </Link>
        <span className="bg-brand flex h-9 w-9 items-center justify-center rounded-full text-lg">🎨</span>
        <div className="flex-1">
          <p className="font-bold leading-tight">Studio</p>
          <p className="flex items-center gap-1 text-[11px] text-frisk">
            <span className="h-1.5 w-1.5 rounded-full bg-frisk" /> Vibe · {skickar ? "redigerar ..." : "online"}
          </p>
        </div>
        <button
          onClick={laddaNer}
          disabled={!harBild}
          className="bg-brand rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 active:scale-95 disabled:opacity-40"
        >
          Ladda ner
        </button>
      </header>

      {/* Arbetsyta: reglage · duk · chatt */}
      <div className="flex flex-1 flex-col overflow-y-auto lg:grid lg:grid-cols-[290px_1fr_360px] lg:overflow-hidden">
        {/* Reglage-panel */}
        <aside className="order-3 border-t border-white/10 p-4 lg:order-1 lg:overflow-y-auto lg:border-r lg:border-t-0">
          <p className="text-xs font-bold uppercase tracking-wide text-mute">Förinställningar</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {FORINSTALLNINGAR.map((f) => (
              <button
                key={f.namn}
                onClick={() => forinstallning(f.j)}
                disabled={!harBild}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-text transition hover:border-rose/40 hover:bg-white/10 disabled:opacity-40"
              >
                <span>{f.emoji}</span>
                <span>{f.namn}</span>
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-mute">Finjustera</p>
            <button
              onClick={() => setJusteringar({ ...STANDARD })}
              disabled={!harBild}
              className="text-xs font-semibold text-mute transition hover:text-text disabled:opacity-40"
            >
              Nollställ
            </button>
          </div>
          <div className="mt-3 space-y-3.5">
            {REGLAGE.map((r) => (
              <label key={r.nyckel} className="block">
                <span className="flex items-center justify-between text-xs text-mute">
                  <span>{r.namn}</span>
                  <span className="tabular-nums text-text/70">{justeringar[r.nyckel].toFixed(r.steg < 1 ? 2 : 0)}</span>
                </span>
                <input
                  type="range"
                  min={r.min}
                  max={r.max}
                  step={r.steg}
                  value={justeringar[r.nyckel]}
                  disabled={!harBild}
                  onChange={(e) => satt(r.nyckel, Number(e.target.value))}
                  className="mt-1.5 w-full accent-rose disabled:opacity-40"
                />
              </label>
            ))}
          </div>
        </aside>

        {/* Duk / förhandsvisning */}
        <section className="order-1 flex min-h-[42svh] flex-col items-center justify-center bg-black/40 p-4 lg:order-2 lg:min-h-0">
          {harBild ? (
            <canvas
              ref={canvasRef}
              className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
            />
          ) : (
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDrar(true);
              }}
              onDragLeave={() => setDrar(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrar(false);
                laddaBild(e.dataTransfer.files?.[0]);
              }}
              className={`flex h-full max-h-[70vh] w-full max-w-md cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition ${
                drar ? "border-rose bg-rose/10" : "border-white/15 bg-white/5 hover:border-white/30"
              }`}
            >
              <span className="text-5xl">🖼️</span>
              <p className="font-semibold">Släpp en bild här</p>
              <p className="text-sm text-mute">eller tryck för att välja en fil</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => laddaBild(e.target.files?.[0])}
              />
            </label>
          )}
          {harBild && (
            <label className="mt-3 cursor-pointer text-xs font-semibold text-mute transition hover:text-text">
              Byt bild
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => laddaBild(e.target.files?.[0])}
              />
            </label>
          )}
        </section>

        {/* Chatt med Vibe */}
        <section className="order-2 flex min-h-[38svh] flex-col border-t border-white/10 lg:order-3 lg:min-h-0 lg:border-l lg:border-t-0">
          <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {meddelanden.map((m, i) => (
              <div key={i} className={`flex ${m.roll === "jag" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
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

          {visaChips && (
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
              {CHIPS.map((c) => (
                <button
                  key={c}
                  onClick={() => skicka(c)}
                  className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-mute transition hover:text-text"
                >
                  {c}
                </button>
              ))}
            </div>
          )}

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
              placeholder={harBild ? "Beskriv hur du vill ha bilden ..." : "Ladda in en bild först ..."}
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
        </section>
      </div>
    </main>
  );
}
