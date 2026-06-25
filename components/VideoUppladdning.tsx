"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";

/*
  Videouppladdning för en annons.
  - Försöker ladda upp filen till Vercel Blob (riktig fil-uppladdning).
  - Funkar inte det (ingen Blob-store kopplad) → visar ett fält där man
    klistrar in en videolänk istället.
  Värdet skrivs till ett dolt fält "video_url" som följer med formuläret.
*/

type Status = "idle" | "laddar" | "klar" | "lank";

export default function VideoUppladdning() {
  const [status, setStatus] = useState<Status>("idle");
  const [url, setUrl] = useState("");
  const [fel, setFel] = useState("");

  async function hanteraFil(e: React.ChangeEvent<HTMLInputElement>) {
    const fil = e.target.files?.[0];
    if (!fil) return;
    setStatus("laddar");
    setFel("");
    try {
      const blob = await upload(fil.name, fil, {
        access: "public",
        handleUploadUrl: "/api/blob-upload",
      });
      setUrl(blob.url);
      setStatus("klar");
    } catch {
      // Blob inte konfigurerat – erbjud länk-inklistring istället.
      setFel("Filuppladdning är inte påslagen än. Klistra in en videolänk istället.");
      setStatus("lank");
    }
  }

  return (
    <div>
      {/* Dolt fält som skickas med formuläret */}
      <input type="hidden" name="video_url" value={url} />

      {status === "klar" ? (
        <div className="flex items-center justify-between rounded-2xl border border-frisk/30 bg-frisk/10 px-4 py-4">
          <span className="font-semibold text-frisk">🎬 Video uppladdad ✓</span>
          <button
            type="button"
            onClick={() => {
              setUrl("");
              setStatus("idle");
            }}
            className="text-sm text-mute underline-offset-2 hover:text-text hover:underline"
          >
            Ta bort
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 bg-white/5 py-10 text-center transition hover:bg-white/[0.07]">
          <span className="text-3xl">{status === "laddar" ? "⏳" : "🎥"}</span>
          <p className="font-semibold">
            {status === "laddar" ? "Laddar upp ..." : "Lägg till video"}
          </p>
          <p className="text-sm text-mute">Visa hur det är att jobba hos er</p>
          <input
            type="file"
            accept="video/*"
            className="hidden"
            disabled={status === "laddar"}
            onChange={hanteraFil}
          />
        </label>
      )}

      {/* Reserv: klistra in länk */}
      {status === "lank" && (
        <div className="mt-3">
          {fel && <p className="mb-2 text-sm text-mute">{fel}</p>}
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://länk-till-din-video.mp4"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-text outline-none placeholder:text-mute focus:border-rose/60"
          />
        </div>
      )}
    </div>
  );
}
