import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { rpNuvarandeAnvandare } from "@/lib/rpAuth";
import { rpPlaggViaId, rpPrisresearchForPlagg } from "@/lib/db";
import PlaggDetaljKlient from "@/components/rp/PlaggDetaljKlient";

export const dynamic = "force-dynamic";

export default async function PlaggDetalj({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const u = await rpNuvarandeAnvandare();
  if (!u) redirect("/resellpilot/logga-in");

  const item = await rpPlaggViaId(id, u.id);
  if (!item) notFound();

  const prisresearch = await rpPrisresearchForPlagg(id);

  return (
    <main className="px-5 pb-6 pt-7">
      <div className="flex items-center gap-3">
        <Link href="/resellpilot/dashboard" className="text-2xl text-slate-400 hover:text-slate-700" aria-label="Tillbaka">
          ←
        </Link>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
          {item.brand || "Plagg"} {item.model ? `· ${item.model}` : ""}
        </h1>
      </div>

      <div className="mt-5">
        <PlaggDetaljKlient item={item} prisresearch={prisresearch} />
      </div>
    </main>
  );
}
