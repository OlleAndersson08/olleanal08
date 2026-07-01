import { redirect } from "next/navigation";
import Link from "next/link";
import { rpNuvarandeAnvandare } from "@/lib/rpAuth";
import { rpPlaggForAnvandare, type RpPlagg, type RpStatus } from "@/lib/db";
import { rpLoggaUtAction } from "@/lib/rpActions";
import PlaggKort from "@/components/rp/PlaggKort";
import RpKnapp from "@/components/rp/RpKnapp";

export const dynamic = "force-dynamic";

const KOLUMNER: { status: RpStatus; titel: string; emoji: string }[] = [
  { status: "sourced", titel: "Sourcat", emoji: "🛍️" },
  { status: "listed", titel: "Listad", emoji: "📄" },
  { status: "sold", titel: "Sålt", emoji: "✅" },
];

function marginal(item: RpPlagg): number | null {
  if (item.soldPrice == null || item.purchasePrice == null) return null;
  return item.soldPrice - item.purchasePrice;
}

export default async function ResellPilotDashboard() {
  const u = await rpNuvarandeAnvandare();
  if (!u) redirect("/resellpilot/logga-in");

  const plagg = await rpPlaggForAnvandare(u.id);

  const nu = new Date();
  const sålda = plagg.filter((p) => p.status === "sold" && p.soldDate != null);
  const säljningarDenhaMånaden = sålda.filter((p) => {
    const d = new Date(p.soldDate as number);
    return d.getMonth() === nu.getMonth() && d.getFullYear() === nu.getFullYear();
  });
  const totalMarginalDenhaMånaden = säljningarDenhaMånaden.reduce((sum, p) => sum + (marginal(p) ?? 0), 0);

  const marginalPerMärke = new Map<string, number[]>();
  for (const p of sålda) {
    const m = marginal(p);
    if (m == null || !p.brand) continue;
    marginalPerMärke.set(p.brand, [...(marginalPerMärke.get(p.brand) ?? []), m]);
  }
  const bästaMärken = [...marginalPerMärke.entries()]
    .map(([namn, ms]) => ({ namn, snitt: ms.reduce((a, b) => a + b, 0) / ms.length, antal: ms.length }))
    .sort((a, b) => b.snitt - a.snitt)
    .slice(0, 3);

  const snittMarginal = sålda.length
    ? sålda.reduce((sum, p) => sum + (marginal(p) ?? 0), 0) / sålda.length
    : 0;

  return (
    <main className="px-5 pb-6 pt-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Din översikt</h1>
          <p className="text-xs text-slate-500">{u.email}</p>
        </div>
        <form action={rpLoggaUtAction}>
          <button type="submit" className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800">
            Logga ut
          </button>
        </form>
      </div>

      {/* Statistik */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm">
          <p className="text-lg font-extrabold text-emerald-600">{totalMarginalDenhaMånaden.toFixed(0)} kr</p>
          <p className="mt-0.5 text-[11px] font-medium text-slate-500">Marginal denna månad</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm">
          <p className="text-lg font-extrabold text-emerald-600">{snittMarginal.toFixed(0)} kr</p>
          <p className="mt-0.5 text-[11px] font-medium text-slate-500">Snittmarginal/plagg</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm">
          <p className="text-lg font-extrabold text-emerald-600">{plagg.length}</p>
          <p className="mt-0.5 text-[11px] font-medium text-slate-500">Plagg totalt</p>
        </div>
      </div>

      {bästaMärken.length > 0 && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-slate-800">Mest lönsamma märken</p>
          <div className="mt-2 flex flex-col gap-1.5">
            {bästaMärken.map((m) => (
              <div key={m.namn} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">
                  {m.namn} <span className="text-slate-400">({m.antal} sålda)</span>
                </span>
                <span className="font-bold text-emerald-600">+{m.snitt.toFixed(0)} kr snitt</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5">
        <RpKnapp href="/resellpilot/nytt" className="w-full">
          📷 Nytt plagg
        </RpKnapp>
      </div>

      {/* Kanban */}
      <div className="mt-7 flex flex-col gap-6">
        {KOLUMNER.map((k) => {
          const items = plagg.filter((p) => p.status === k.status);
          return (
            <section key={k.status}>
              <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                <span>{k.emoji}</span> {k.titel}{" "}
                <span className="font-normal text-slate-400">({items.length})</span>
              </h2>
              {items.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">
                  Inget här än.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {items.map((item) => (
                    <PlaggKort key={item.id} item={item} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {plagg.length === 0 && (
        <p className="mt-6 text-center text-sm text-slate-400">
          Inga plagg loggade än. <Link href="/resellpilot/nytt" className="font-semibold text-emerald-600">Lägg till ditt första →</Link>
        </p>
      )}
    </main>
  );
}
