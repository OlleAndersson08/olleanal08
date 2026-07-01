"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { rpHämtaSourcingAction } from "@/lib/rpActions";
import type { Kalla } from "@/lib/rpAnthropic";

export default function Sourcing() {
  const [text, setText] = useState("");
  const [sources, setSources] = useState<Kalla[]>([]);
  const [fel, setFel] = useState("");
  const [pending, startTransition] = useTransition();

  function hämta() {
    setFel("");
    startTransition(async () => {
      const res = await rpHämtaSourcingAction();
      if (res.ok) {
        setText(res.resultat.text);
        setSources(res.resultat.sources);
      } else {
        setFel(res.error);
      }
    });
  }

  return (
    <main className="px-5 pb-6 pt-7">
      <div className="flex items-center gap-3">
        <Link href="/resellpilot/dashboard" className="text-2xl text-slate-400 hover:text-slate-700" aria-label="Tillbaka">
          ←
        </Link>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Sourcing-idéer</h1>
      </div>

      <p className="mt-3 text-sm text-slate-500">
        Claude tittar på dina bäst säljande märken och aktuella trender och ger konkreta förslag på
        vad du ska leta efter just nu.
      </p>

      <button
        type="button"
        onClick={hämta}
        disabled={pending}
        className="mt-5 w-full rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? "Söker efter idéer ..." : "💡 Vad ska jag leta efter just nu?"}
      </button>

      {fel && <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">{fel}</p>}

      {text && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="whitespace-pre-wrap text-sm text-slate-700">{text}</p>
          {sources.length > 0 && (
            <div className="mt-4 border-t border-slate-100 pt-3">
              <p className="text-xs font-bold text-slate-500">Källor</p>
              <ul className="mt-1 flex flex-col gap-0.5 text-xs text-slate-400">
                {sources.map((s) => (
                  <li key={s.url} className="truncate">
                    <a href={s.url} target="_blank" rel="noreferrer" className="hover:text-emerald-600 hover:underline">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
