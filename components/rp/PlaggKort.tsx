import Link from "next/link";
import type { RpPlagg } from "@/lib/db";

function marginal(item: RpPlagg): number | null {
  const sälj = item.soldPrice ?? item.listPrice;
  if (sälj == null || item.purchasePrice == null) return null;
  return sälj - item.purchasePrice;
}

export default function PlaggKort({ item }: { item: RpPlagg }) {
  const m = marginal(item);

  return (
    <Link
      href={`/resellpilot/plagg/${item.id}`}
      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        {item.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.images[0]} alt={item.brand ?? "Plagg"} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xl">👕</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-slate-900">{item.brand || "Okänt märke"}</p>
        <p className="truncate text-xs text-slate-500">
          {item.model || "—"} {item.size ? `· Stl ${item.size}` : ""}
        </p>
        <div className="mt-1 flex items-center gap-2 text-xs">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-600">
            {item.purchasePrice != null ? `Köpt ${item.purchasePrice} kr` : "Inköpspris saknas"}
          </span>
          {item.listPrice != null && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-600">
              List {item.listPrice} kr
            </span>
          )}
        </div>
      </div>
      {m != null && (
        <span className={`shrink-0 text-sm font-bold ${m >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
          {m >= 0 ? "+" : ""}
          {m.toFixed(0)} kr
        </span>
      )}
    </Link>
  );
}
