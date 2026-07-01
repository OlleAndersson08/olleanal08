"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";

/*
  Bilduppladdning för plagg-analys – 1 till 4 bilder (etikett, sömmar,
  material, helhetsbild). Skriver URL-listan till ett dolt fält "images"
  (JSON) och rapporterar tillbaka via onChange så sidan vet när det finns
  bilder att analysera.
*/

const MAX_BILDER = 4;

type Props = {
  onChange?: (urls: string[]) => void;
};

export default function BildUppladdning({ onChange }: Props) {
  const [bilder, setBilder] = useState<string[]>([]);
  const [laddarUpp, setLaddarUpp] = useState(false);
  const [fel, setFel] = useState("");

  function uppdatera(nya: string[]) {
    setBilder(nya);
    onChange?.(nya);
  }

  async function hanteraFiler(e: React.ChangeEvent<HTMLInputElement>) {
    const filer = Array.from(e.target.files ?? []).slice(0, MAX_BILDER - bilder.length);
    if (filer.length === 0) return;
    setLaddarUpp(true);
    setFel("");
    try {
      const nya: string[] = [];
      for (const fil of filer) {
        const blob = await upload(fil.name, fil, {
          access: "public",
          handleUploadUrl: "/api/resellpilot/blob-upload",
        });
        nya.push(blob.url);
      }
      uppdatera([...bilder, ...nya]);
    } catch {
      setFel(
        "Bilduppladdning är inte påslagen än. Slå på den i Vercel (Storage → Create → Blob) för att kunna ladda upp bilder.",
      );
    } finally {
      setLaddarUpp(false);
      e.target.value = "";
    }
  }

  function taBort(url: string) {
    uppdatera(bilder.filter((b) => b !== url));
  }

  return (
    <div>
      <input type="hidden" name="images" value={JSON.stringify(bilder)} />

      <div className="grid grid-cols-4 gap-2">
        {bilder.map((url) => (
          // eslint-disable-next-line @next/next/no-img-element
          <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200">
            <img src={url} alt="Plagg" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => taBort(url)}
              className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}

        {bilder.length < MAX_BILDER && (
          <label
            className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-center transition ${
              laddarUpp ? "" : "cursor-pointer hover:bg-slate-100"
            }`}
          >
            <span className="text-2xl">{laddarUpp ? "⏳" : "➕"}</span>
            <span className="text-[10px] font-semibold text-slate-500">
              {laddarUpp ? "Laddar upp..." : "Lägg till"}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              className="hidden"
              disabled={laddarUpp}
              onChange={hanteraFiler}
            />
          </label>
        )}
      </div>

      <p className="mt-2 text-xs text-slate-400">
        1–4 bilder: etikett, sömmar, material, helhetsbild. {bilder.length}/{MAX_BILDER} uppladdade.
      </p>
      {fel && <p className="mt-2 text-sm text-amber-600">{fel}</p>}
    </div>
  );
}
