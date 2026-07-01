"use client";

import { useMemo, useState } from "react";

/*
  Break-even & marginal-kalkylator. Ren logik, ingen AI:
  netto-marginal = säljpris - Vinted-avgift - fraktkostnad - inköpspris.
*/

type Props = {
  initialPurchasePrice?: number;
  initialSellPrice?: number;
};

export default function Kalkylator({ initialPurchasePrice, initialSellPrice }: Props) {
  const [inköpspris, setInköpspris] = useState(initialPurchasePrice?.toString() ?? "");
  const [säljpris, setSäljpris] = useState(initialSellPrice?.toString() ?? "");
  const [avgiftProcent, setAvgiftProcent] = useState("5");
  const [frakt, setFrakt] = useState("59");
  const [tidMinuter, setTidMinuter] = useState("20");

  const resultat = useMemo(() => {
    const inköp = parseFloat(inköpspris) || 0;
    const sälj = parseFloat(säljpris) || 0;
    const avgift = parseFloat(avgiftProcent) || 0;
    const fraktKr = parseFloat(frakt) || 0;
    const minuter = parseFloat(tidMinuter) || 0;

    const avgiftKr = sälj * (avgift / 100);
    const nettoMarginalKr = sälj - avgiftKr - fraktKr - inköp;
    const nettoMarginalProcent = sälj > 0 ? (nettoMarginalKr / sälj) * 100 : 0;
    const timlön = minuter > 0 ? nettoMarginalKr / (minuter / 60) : 0;

    return { avgiftKr, nettoMarginalKr, nettoMarginalProcent, timlön };
  }, [inköpspris, säljpris, avgiftProcent, frakt, tidMinuter]);

  const fältKlass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Inköpspris (kr)</span>
          <input
            inputMode="decimal"
            value={inköpspris}
            onChange={(e) => setInköpspris(e.target.value)}
            placeholder="150"
            className={fältKlass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Säljpris (kr)</span>
          <input
            inputMode="decimal"
            value={säljpris}
            onChange={(e) => setSäljpris(e.target.value)}
            placeholder="350"
            className={fältKlass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Vinted-avgift (%)</span>
          <input
            inputMode="decimal"
            value={avgiftProcent}
            onChange={(e) => setAvgiftProcent(e.target.value)}
            className={fältKlass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Fraktkostnad (kr)</span>
          <input
            inputMode="decimal"
            value={frakt}
            onChange={(e) => setFrakt(e.target.value)}
            className={fältKlass}
          />
        </label>
        <label className="col-span-2 block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">
            Tidsuppskattning (minuter, foto/annons/frakt)
          </span>
          <input
            inputMode="decimal"
            value={tidMinuter}
            onChange={(e) => setTidMinuter(e.target.value)}
            className={fältKlass}
          />
        </label>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold text-emerald-900">Netto-marginal</span>
          <span
            className={`text-2xl font-extrabold ${resultat.nettoMarginalKr >= 0 ? "text-emerald-700" : "text-rose-600"}`}
          >
            {resultat.nettoMarginalKr.toFixed(0)} kr
          </span>
        </div>
        <div className="mt-1 flex items-baseline justify-between text-sm text-emerald-800">
          <span>Marginal</span>
          <span className="font-bold">{resultat.nettoMarginalProcent.toFixed(1)} %</span>
        </div>
        <div className="mt-1 flex items-baseline justify-between text-sm text-emerald-800">
          <span>Vinted-avgift</span>
          <span>{resultat.avgiftKr.toFixed(0)} kr</span>
        </div>
        <div className="mt-3 border-t border-emerald-200 pt-3 text-sm text-emerald-800">
          <div className="flex items-baseline justify-between">
            <span>Ungefärlig timlön</span>
            <span className="font-bold">{resultat.timlön.toFixed(0)} kr/tim</span>
          </div>
        </div>
      </div>
    </div>
  );
}
