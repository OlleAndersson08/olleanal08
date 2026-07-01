"use client";

import { useActionState } from "react";
import Link from "next/link";
import RpFalt from "@/components/rp/RpFalt";
import { rpRegistreraAction } from "@/lib/rpActions";

export default function ResellPilotRegistrera() {
  const [state, formAction, pending] = useActionState(rpRegistreraAction, undefined);

  return (
    <main className="flex min-h-[100svh] flex-col px-6 py-8">
      <Link href="/resellpilot" className="text-2xl text-slate-400 hover:text-slate-700" aria-label="Tillbaka">
        ←
      </Link>

      <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900">Skapa konto</h1>
      <p className="mt-1 text-slate-500">Ett konto räcker – bara du använder det.</p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <RpFalt etikett="E-post" name="email" type="email" required placeholder="du@exempel.se" />
        <RpFalt etikett="Lösenord" name="losen" type="password" required minLength={6} placeholder="Minst 6 tecken" />

        {state?.error && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 w-full rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {pending ? "Skapar konto ..." : "Skapa konto"}
        </button>
      </form>

      <p className="mt-auto pt-8 text-center text-sm text-slate-500">
        Har du redan ett konto?{" "}
        <Link href="/resellpilot/logga-in" className="font-semibold text-slate-800 underline-offset-4 hover:underline">
          Logga in
        </Link>
      </p>
    </main>
  );
}
