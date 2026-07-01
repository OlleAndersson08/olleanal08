import Link from "next/link";
import { redirect } from "next/navigation";
import { rpNuvarandeAnvandare } from "@/lib/rpAuth";
import RpKnapp from "@/components/rp/RpKnapp";

export const dynamic = "force-dynamic";

export default async function ResellPilotStart() {
  const u = await rpNuvarandeAnvandare();
  if (u) redirect("/resellpilot/dashboard");

  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <span className="text-5xl">♻️</span>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">ResellPilot</h1>
      <p className="mt-2 max-w-xs text-slate-500">
        AI-drivet stöd för second-hand-flipping. Fota plagget, få skick, äkthetsflaggor och en
        säljande annonstext – på några sekunder.
      </p>
      <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
        <RpKnapp href="/resellpilot/registrera" className="w-full">
          Skapa konto
        </RpKnapp>
        <RpKnapp href="/resellpilot/logga-in" variant="sekundar" className="w-full">
          Logga in
        </RpKnapp>
      </div>
      <Link href="/" className="mt-8 text-sm font-semibold text-slate-400 hover:text-slate-600">
        ← Till startsidan
      </Link>
    </main>
  );
}
