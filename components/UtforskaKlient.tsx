"use client";

import { useMemo, useState } from "react";
import Meny from "@/components/Meny";
import { TYPER, type Mojlighet, type TypNyckel } from "@/data/mojligheter";

/*
  Utforska (klientdel) – sök + filtrera bland alla kategorier.
  Får möjligheterna från databasen via servern.
*/

export default function UtforskaKlient({ mojligheter }: { mojligheter: Mojlighet[] }) {
  const [vald, setVald] = useState<TypNyckel | "alla">("alla");
  const [sok, setSok] = useState("");

  const typerLista = Object.values(TYPER);

  const traffar = useMemo(() => {
    return mojligheter.filter((m) => {
      const matchKategori = vald === "alla" || m.typ === vald;
      const text = (m.titel + " " + m.foretag + " " + m.ort).toLowerCase();
      const matchSok = sok.trim() === "" || text.includes(sok.toLowerCase());
      return matchKategori && matchSok;
    });
  }, [vald, sok, mojligheter]);

  return (
    <main className="relative flex-1 bg-bg">
      <div className="mx-auto min-h-[100svh] max-w-md px-5 pb-28 pt-7">
        <h1 className="text-2xl font-extrabold tracking-tight">Utforska</h1>
        <p className="mt-1 text-sm text-mute">Hitta din väg att tjäna pengar och bygga framtiden.</p>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <span className="opacity-70">🔍</span>
          <input
            value={sok}
            onChange={(e) => setSok(e.target.value)}
            placeholder="Sök jobb, gig, företag, ort ..."
            className="w-full bg-transparent text-text outline-none placeholder:text-mute"
          />
        </div>

        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
          <Chip aktiv={vald === "alla"} onClick={() => setVald("alla")}>
            ✨ Allt
          </Chip>
          {typerLista.map((t) => (
            <Chip key={t.nyckel} aktiv={vald === t.nyckel} onClick={() => setVald(t.nyckel)}>
              {t.emoji} {t.etikett}
            </Chip>
          ))}
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-mute">
          {traffar.length} möjligheter
        </p>
        <div className="mt-2 flex flex-col gap-3">
          {traffar.map((m) => {
            const typ = TYPER[m.typ];
            return (
              <div key={m.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/[0.08]">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl"
                  style={{ backgroundImage: `linear-gradient(150deg, ${typ.fran}, ${typ.till})` }}
                >
                  {m.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{m.titel}</p>
                  <p className="truncate text-sm text-mute">
                    {m.foretag} · {m.avstandKm === 0 ? m.ort : `${m.avstandKm} km`}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-mute">
                      {typ.emoji} {typ.etikett}
                    </span>
                    <span className="text-[11px] font-bold text-brand">{m.ersattning}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {traffar.length === 0 && (
            <p className="mt-8 text-center text-mute">Inga träffar – testa en annan kategori. 🔍</p>
          )}
        </div>
      </div>

      <Meny />
    </main>
  );
}

function Chip({ children, aktiv, onClick }: { children: React.ReactNode; aktiv: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
        aktiv ? "bg-brand border-transparent text-white" : "border-white/10 bg-white/5 text-mute hover:text-text"
      }`}
    >
      {children}
    </button>
  );
}
