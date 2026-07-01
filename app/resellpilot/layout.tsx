import type { ReactNode } from "react";
import RpMeny from "@/components/rp/RpMeny";
import { rpNuvarandeAnvandare } from "@/lib/rpAuth";

export const metadata = {
  title: "ResellPilot – AI för din second-hand-flipping",
  description:
    "Analysera plagg, hitta rätt pris och maximera marginalen när du köper och säljer streetwear på Vinted, Plick och Tradera.",
};

export default async function ResellPilotLayout({ children }: { children: ReactNode }) {
  const u = await rpNuvarandeAnvandare();

  return (
    <div className="min-h-[100svh] bg-slate-50 text-slate-900">
      <div className="mx-auto min-h-[100svh] max-w-md bg-slate-50 pb-24">{children}</div>
      {u && <RpMeny />}
    </div>
  );
}
