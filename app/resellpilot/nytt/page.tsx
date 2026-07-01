"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import BildUppladdning from "@/components/rp/BildUppladdning";
import RpFalt from "@/components/rp/RpFalt";
import { rpAnalyseraPlaggAction, rpSparaPlaggAction } from "@/lib/rpActions";
import type { PlaggAnalys } from "@/lib/rpAnthropic";

export default function NyttPlagg() {
  const [images, setImages] = useState<string[]>([]);
  const [analys, setAnalys] = useState<PlaggAnalys | null>(null);
  const [analyserar, setAnalyserar] = useState(false);
  const [analysFel, setAnalysFel] = useState("");
  const [pending, startTransition] = useTransition();
  const [state, formAction, sparaPending] = useActionState(rpSparaPlaggAction, undefined);

  function analysera() {
    setAnalysFel("");
    setAnalyserar(true);
    startTransition(async () => {
      const res = await rpAnalyseraPlaggAction(images);
      setAnalyserar(false);
      if (res.ok) setAnalys(res.analys);
      else setAnalysFel(res.error);
    });
  }

  return (
    <main className="px-5 pb-6 pt-7">
      <div className="flex items-center gap-3">
        <Link href="/resellpilot/dashboard" className="text-2xl text-slate-400 hover:text-slate-700" aria-label="Tillbaka">
          ←
        </Link>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Nytt plagg</h1>
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-700">1. Ladda upp bilder</p>
      <div className="mt-2">
        <BildUppladdning onChange={setImages} />
      </div>

      {images.length > 0 && !analys && (
        <button
          type="button"
          onClick={analysera}
          disabled={analyserar || pending}
          className="mt-4 w-full rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {analyserar || pending ? "Analyserar med AI ..." : "✨ Analysera med AI"}
        </button>
      )}
      {analysFel && (
        <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">{analysFel}</p>
      )}

      {analys && (
        <form action={formAction} className="mt-6 flex flex-col gap-4">
          <input type="hidden" name="images" value={JSON.stringify(images)} />
          <input type="hidden" name="conditionReasoning" value={analys.conditionReasoning} />
          <input type="hidden" name="authenticityFlags" value={JSON.stringify(analys.authenticityFlags)} />

          <p className="text-sm font-semibold text-slate-700">2. Granska AI-analysen</p>

          {analys.authenticityFlags.length > 0 && (
            <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
              <p className="font-bold">⚠️ Äkthetsflaggor</p>
              <ul className="mt-1 list-disc pl-4">
                {analys.authenticityFlags.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="rounded-xl bg-slate-100 p-3 text-xs text-slate-500">{analys.authenticityDisclaimer}</p>

          <div className="grid grid-cols-2 gap-3">
            <RpFalt etikett="Märke" name="brand" defaultValue={analys.brand ?? ""} />
            <RpFalt etikett="Modell" name="model" defaultValue={analys.model ?? ""} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <RpFalt etikett="Storlek" name="size" placeholder="M / 42 / ..." />
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Skick</span>
              <select
                name="condition"
                defaultValue={analys.condition}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-emerald-500"
              >
                {["Nyskick", "Mycket bra", "Bra", "Slitet"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
            <span className="font-semibold text-slate-800">Skickmotivering: </span>
            {analys.conditionReasoning}
          </p>

          <RpFalt etikett="Säljande titel (Vinted)" name="suggestedTitle" defaultValue={analys.suggestedTitle} />
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Beskrivning (Vinted)</span>
            <textarea
              name="suggestedDescription"
              defaultValue={analys.suggestedDescription}
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-emerald-500"
            />
          </label>

          <RpFalt etikett="Inköpspris (kr)" name="purchasePrice" inputMode="decimal" placeholder="150" />

          {state?.error && (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={sparaPending}
            className="mt-2 w-full rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {sparaPending ? "Sparar ..." : "Spara plagg-post"}
          </button>
        </form>
      )}
    </main>
  );
}
