"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";

/*
  Videouppladdning för en annons.
  - Ladda upp en fil (eller spela in direkt på mobilen) → Vercel Blob.
  - Visar framsteg och en förhandsvisning av videon.
  - Funkar inte filuppladdning (ingen Blob-store kopplad) → klistra in en
    videolänk istället. Den vägen funkar alltid.
  Värdet skrivs till ett dolt fält "video_url" som följer med formuläret.
*/

type Status = "idle" | "laddar" | "klar";

export default function VideoUppladdning() {
  const [status, setStatus] = useState<Status>("idle");
  const [url, setUrl] = useState("");
  const [procent, setProcent] = useState(0);
  const [visaLank, setVisaLank] = useState(false);
  const [fel, setFel] = useState("");

  async function hanteraFil(e: React.ChangeEvent<HTMLInputElement>) {
    const fil = e.target.files?.[0];
    if (!fil) return;
    setStatus("laddar");
    setProcent(0);
    setFel("");
    try {
      const blob = await upload(fil.name, fil, {
        access: "public",
        handleUploadUrl: "/api/blob-upload",
        onUploadProgress: (p) => setProcent(Math.round(p.percentage)),
      });
      setUrl(blob.url);
      setStatus("klar");
    } catch {
      setStatus("idle");
      setVisaLank(true);
      setFel(
        "Filuppladdning är inte påslagen än. Slå på den i Vercel (Storage → Create → Blob), eller klistra in en videolänk nedan.",
      );
    }
  }

  function rensa() {
    setUrl("");
    setStatus("idle");
    setProcent(0);
  }

  return (
    <div>
      {/* Dolt fält som skickas med formuläret */}
      <input type="hidden" name="video_url" value={url} />

      {/* Förhandsvisning när en video finns */}
      {url ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
          <video src={url} className="h-52 w-full object-cover" muted loop autoPlay playsInline controls />
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm font-semibold text-frisk">🎬 Video klar ✓</span>
            <button type="button" onClick={rensa} className="text-sm text-mute underline-offset-2 hover:text-text hover:underline">
              Ta bort
            </button>
          </div>
        </div>
      ) : (
        <label
          className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 bg-white/5 py-10 text-center transition ${
            status === "laddar" ? "" : "cursor-pointer hover:bg-white/[0.07]"
          }`}
        >
          <span className="text-3xl">{status === "laddar" ? "⏳" : "🎥"}</span>
          {status === "laddar" ? (
            <>
              <p className="font-semibold">Laddar upp ... {procent}%</p>
              <div className="mt-1 h-2 w-40 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${procent}%` }} />
              </div>
            </>
          ) : (
            <>
              <p className="font-semibold">Lägg till video</p>
              <p className="text-sm text-mute">Ladda upp en fil eller spela in på mobilen</p>
            </>
          )}
          <input
            type="file"
            accept="video/*"
            className="hidden"
            disabled={status === "laddar"}
            onChange={hanteraFil}
          />
        </label>
      )}

      {/* Felmeddelande */}
      {fel && <p className="mt-2 text-sm text-mute">{fel}</p>}

      {/* Klistra in länk (alltid tillgängligt som reserv) */}
      {!url && (
        <>
          {!visaLank ? (
            <button
              type="button"
              onClick={() => setVisaLank(true)}
              className="mt-3 text-sm font-semibold text-mute underline-offset-2 hover:text-text hover:underline"
            >
              Har du redan en videolänk? Klistra in den →
            </button>
          ) : (
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://länk-till-din-video.mp4"
              className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-text outline-none placeholder:text-mute focus:border-rose/60"
            />
          )}
        </>
      )}
    </div>
  );
}
