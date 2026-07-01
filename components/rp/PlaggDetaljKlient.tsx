"use client";

import { useActionState, useState, useTransition } from "react";
import type { RpPlagg, RpPrisresearch, RpStatus } from "@/lib/db";
import { rpUppdateraPlaggAction, rpKörPrisresearchAction } from "@/lib/rpActions";
import RpFalt from "@/components/rp/RpFalt";
import Kalkylator from "@/components/rp/Kalkylator";

const STATUSAR: { värde: RpStatus; etikett: string }[] = [
  { värde: "sourced", etikett: "Sourcat" },
  { värde: "listed", etikett: "Listad" },
  { värde: "sold", etikett: "Sålt" },
];

export default function PlaggDetaljKlient({
  item,
  prisresearch,
}: {
  item: RpPlagg;
  prisresearch: RpPrisresearch[];
}) {
  const [state, formAction, pending] = useActionState(rpUppdateraPlaggAction, undefined);
  const [researchPending, startTransition] = useTransition();
  const [researchFel, setResearchFel] = useState("");
  const senastaResearch = prisresearch[0];

  function körPrisresearch() {
    setResearchFel("");
    startTransition(async () => {
      const res = await rpKörPrisresearchAction(item.id);
      if (!res.ok) setResearchFel(res.error);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {item.images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          {item.images.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={url} src={url} alt={item.brand ?? "Plagg"} className="h-40 w-32 shrink-0 rounded-xl object-cover" />
          ))}
        </div>
      )}

      {item.suggestedTitle && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-slate-800">{item.suggestedTitle}</p>
          {item.suggestedDescription && <p className="mt-1 text-sm text-slate-500">{item.suggestedDescription}</p>}
        </div>
      )}

      {item.authenticityFlags.length > 0 && (
        <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-bold">⚠️ Äkthetsflaggor (inget bevis, bara ett stöd)</p>
          <ul className="mt-1 list-disc pl-4">
            {item.authenticityFlags.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Prisresearch */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-800">Prisresearch</p>
          <button
            type="button"
            onClick={körPrisresearch}
            disabled={researchPending}
            className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {researchPending ? "Söker ..." : senastaResearch ? "Uppdatera" : "Kör AI-research"}
          </button>
        </div>
        {researchFel && <p className="mt-2 text-sm text-amber-600">{researchFel}</p>}
        {senastaResearch && (
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-emerald-600">
              {senastaResearch.estimatedLow ?? "?"}–{senastaResearch.estimatedHigh ?? "?"} kr
            </p>
            <p className="mt-1 text-sm text-slate-600">{senastaResearch.reasoning}</p>
            {senastaResearch.sources.length > 0 && (
              <ul className="mt-2 flex flex-col gap-0.5 text-xs text-slate-400">
                {senastaResearch.sources.map((s) => (
                  <li key={s.url} className="truncate">
                    <a href={s.url} target="_blank" rel="noreferrer" className="hover:text-emerald-600 hover:underline">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      {/* Kalkylator */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-sm font-bold text-slate-800">Break-even & marginal</p>
        <Kalkylator
          initialPurchasePrice={item.purchasePrice ?? undefined}
          initialSellPrice={item.listPrice ?? item.soldPrice ?? undefined}
        />
      </section>

      {/* Redigera / status */}
      <form action={formAction} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <input type="hidden" name="id" value={item.id} />
        <p className="mb-3 text-sm font-bold text-slate-800">Detaljer & status</p>

        <div className="grid grid-cols-2 gap-3">
          <RpFalt etikett="Märke" name="brand" defaultValue={item.brand ?? ""} />
          <RpFalt etikett="Modell" name="model" defaultValue={item.model ?? ""} />
          <RpFalt etikett="Storlek" name="size" defaultValue={item.size ?? ""} />
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Skick</span>
            <select
              name="condition"
              defaultValue={item.condition ?? ""}
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

        <label className="mt-3 block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Status</span>
          <select
            name="status"
            defaultValue={item.status}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-emerald-500"
          >
            {STATUSAR.map((s) => (
              <option key={s.värde} value={s.värde}>
                {s.etikett}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <RpFalt etikett="Inköpspris" name="purchasePrice" inputMode="decimal" defaultValue={item.purchasePrice ?? ""} />
          <RpFalt etikett="Listpris" name="listPrice" inputMode="decimal" defaultValue={item.listPrice ?? ""} />
          <RpFalt etikett="Såldpris" name="soldPrice" inputMode="decimal" defaultValue={item.soldPrice ?? ""} />
        </div>

        {state?.error && <p className="mt-3 text-sm font-medium text-rose-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-4 w-full rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {pending ? "Sparar ..." : "Spara ändringar"}
        </button>
      </form>
    </div>
  );
}
