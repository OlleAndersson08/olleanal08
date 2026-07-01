import Link from "next/link";
import Kalkylator from "@/components/rp/Kalkylator";

export default function KalkylatorSida() {
  return (
    <main className="px-5 pb-6 pt-7">
      <div className="flex items-center gap-3">
        <Link href="/resellpilot/dashboard" className="text-2xl text-slate-400 hover:text-slate-700" aria-label="Tillbaka">
          ←
        </Link>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Kalkylator</h1>
      </div>
      <p className="mt-3 text-sm text-slate-500">
        Räkna snabbt ut break-even och marginal innan du sätter ett pris.
      </p>
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <Kalkylator />
      </div>
    </main>
  );
}
