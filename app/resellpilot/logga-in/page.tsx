"use client";

import { useActionState } from "react";
import Link from "next/link";
import RpFalt from "@/components/rp/RpFalt";
import { rpLoggaInAction } from "@/lib/rpActions";

export default function ResellPilotLoggaIn() {
  const [state, formAction, pending] = useActionState(rpLoggaInAction, undefined);

  return (
    <main className="flex min-h-[100svh] flex-col px-6 py-8">
      <Link href="/resellpilot" className="text-2xl text-slate-400 hover:text-slate-700" aria-label="Tillbaka">
        ←
      </Link>

      <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900">Logga in</h1>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <RpFalt etikett="E-post" name="email" type="email" required placeholder="du@exempel.se" />
        <RpFalt etikett="Lösenord" name="losen" type="password" required placeholder="Ditt lösenord" />

        {state?.error && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 w-full rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {pending ? "Loggar in ..." : "Logga in"}
        </button>
      </form>

      <p className="mt-auto pt-8 text-center text-sm text-slate-500">
        Nytt här?{" "}
        <Link href="/resellpilot/registrera" className="font-semibold text-slate-800 underline-offset-4 hover:underline">
          Skapa konto
        </Link>
      </p>
    </main>
  );
}
