"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  anvandareViaEmail,
  skapaAnvandare,
  skapaMojlighet,
  skapaAnsokan,
} from "@/lib/db";
import { hashaLosen, verifieraLosen, startaSession, avslutaSession, nuvarandeAnvandare } from "@/lib/auth";
import type { TypNyckel } from "@/data/mojligheter";

export type FormState = { error?: string } | undefined;

/* ---------- Registrering ---------- */
export async function registreraAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const losen = String(formData.get("losen") ?? "");
  const roll = String(formData.get("roll") ?? "ungdom");
  const ort = String(formData.get("ort") ?? "").trim();
  const foretag = String(formData.get("foretag") ?? "").trim();

  if (!email || !email.includes("@")) return { error: "Fyll i en giltig e-post." };
  if (losen.length < 6) return { error: "Lösenordet måste vara minst 6 tecken." };
  if (anvandareViaEmail(email)) return { error: "Det finns redan ett konto med den e-posten." };

  const id = skapaAnvandare({
    email,
    losen: hashaLosen(losen),
    roll: roll === "foretag" ? "foretag" : "ungdom",
    ort: ort || undefined,
    foretag: foretag || undefined,
    namn: foretag || undefined,
  });
  await startaSession(id);
  redirect(roll === "foretag" ? "/foretag" : "/onboarding");
}

/* ---------- Inloggning ---------- */
export async function loggaInAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const losen = String(formData.get("losen") ?? "");
  const u = anvandareViaEmail(email);
  if (!u || !verifieraLosen(losen, u.losen)) return { error: "Fel e-post eller lösenord." };
  await startaSession(u.id);
  redirect(u.roll === "foretag" ? "/foretag" : "/jobb");
}

/* ---------- Utloggning ---------- */
export async function loggaUtAction() {
  await avslutaSession();
  redirect("/");
}

/* ---------- Ansök (från flödet) ---------- */
export async function ansokAction(opportunityId: string): Promise<{ ok: boolean; needsAuth?: boolean }> {
  const u = await nuvarandeAnvandare();
  if (!u) return { ok: false, needsAuth: true };
  skapaAnsokan(u.id, opportunityId);
  revalidatePath("/profil");
  return { ok: true };
}

/* ---------- Skapa möjlighet (företag) ---------- */
export async function skapaMojlighetAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const u = await nuvarandeAnvandare();
  if (!u) return { error: "Du måste logga in som företag först." };

  const titel = String(formData.get("titel") ?? "").trim();
  const beskrivning = String(formData.get("beskrivning") ?? "").trim();
  const ersattning = String(formData.get("ersattning") ?? "").trim();
  const ort = String(formData.get("ort") ?? "").trim();
  const typ = String(formData.get("typ") ?? "extra") as TypNyckel;
  if (!titel || !beskrivning) return { error: "Fyll i titel och beskrivning." };

  skapaMojlighet({
    typ,
    foretag: u.foretag ?? "Företag",
    titel,
    emoji: "💼",
    ort: ort || u.ort || "Sverige",
    ersattning: ersattning || "Enligt överenskommelse",
    beskrivning,
    taggar: ["Ny", "Lokalt"],
    agareId: u.id,
  });
  revalidatePath("/jobb");
  revalidatePath("/utforska");
  redirect("/foretag");
}
