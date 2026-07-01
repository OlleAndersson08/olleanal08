"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  rpAnvandareViaEmail,
  rpSkapaAnvandare,
  rpSkapaPlagg,
  rpUppdateraPlagg,
  rpSparaPrisresearch,
  rpPlaggViaId,
  rpPlaggForAnvandare,
  type RpStatus,
} from "@/lib/db";
import {
  hashaLosen,
  verifieraLosen,
  rpStartaSession,
  rpAvslutaSession,
  rpNuvarandeAnvandare,
} from "@/lib/rpAuth";
import { priceResearch, analyzeGarment, sourcingIdeas, type PlaggAnalys, type SourcingResultat } from "@/lib/rpAnthropic";

export type RpFormState = { error?: string } | undefined;

/* ---------- Auth ---------- */

export async function rpRegistreraAction(
  _prev: RpFormState,
  formData: FormData,
): Promise<RpFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const losen = String(formData.get("losen") ?? "");

  if (!email || !email.includes("@")) return { error: "Fyll i en giltig e-post." };
  if (losen.length < 6) return { error: "Lösenordet måste vara minst 6 tecken." };
  if (await rpAnvandareViaEmail(email)) return { error: "Det finns redan ett konto med den e-posten." };

  const id = await rpSkapaAnvandare(email, hashaLosen(losen));
  await rpStartaSession(id);
  redirect("/resellpilot/dashboard");
}

export async function rpLoggaInAction(
  _prev: RpFormState,
  formData: FormData,
): Promise<RpFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const losen = String(formData.get("losen") ?? "");
  const u = await rpAnvandareViaEmail(email);
  if (!u || !verifieraLosen(losen, u.losen)) return { error: "Fel e-post eller lösenord." };
  await rpStartaSession(u.id);
  redirect("/resellpilot/dashboard");
}

export async function rpLoggaUtAction() {
  await rpAvslutaSession();
  redirect("/resellpilot");
}

/* ---------- Plagg ---------- */

export async function rpSparaPlaggAction(
  _prev: RpFormState,
  formData: FormData,
): Promise<RpFormState> {
  const u = await rpNuvarandeAnvandare();
  if (!u) return { error: "Du måste logga in först." };

  const images = String(formData.get("images") ?? "[]");
  let imagesArr: string[] = [];
  try {
    imagesArr = JSON.parse(images);
  } catch {
    /* tom lista */
  }
  if (imagesArr.length === 0) return { error: "Ladda upp minst en bild." };

  const purchasePrice = formData.get("purchasePrice");

  await rpSkapaPlagg({
    userId: u.id,
    images: imagesArr,
    brand: String(formData.get("brand") ?? "").trim() || null,
    model: String(formData.get("model") ?? "").trim() || null,
    size: String(formData.get("size") ?? "").trim() || null,
    condition: String(formData.get("condition") ?? "").trim() || null,
    conditionNotes: String(formData.get("conditionReasoning") ?? "").trim() || null,
    authenticityFlags: JSON.parse(String(formData.get("authenticityFlags") ?? "[]")),
    suggestedTitle: String(formData.get("suggestedTitle") ?? "").trim() || null,
    suggestedDescription: String(formData.get("suggestedDescription") ?? "").trim() || null,
    purchasePrice: purchasePrice ? Number(purchasePrice) : null,
  });

  revalidatePath("/resellpilot/dashboard");
  redirect("/resellpilot/dashboard");
}

export async function rpUppdateraPlaggAction(
  _prev: RpFormState,
  formData: FormData,
): Promise<RpFormState> {
  const u = await rpNuvarandeAnvandare();
  if (!u) return { error: "Du måste logga in först." };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Okänt plagg." };

  const num = (v: FormDataEntryValue | null) => (v ? Number(v) : null);

  await rpUppdateraPlagg(id, u.id, {
    brand: String(formData.get("brand") ?? "").trim() || null,
    model: String(formData.get("model") ?? "").trim() || null,
    size: String(formData.get("size") ?? "").trim() || null,
    condition: String(formData.get("condition") ?? "").trim() || null,
    status: (String(formData.get("status") ?? "") as RpStatus) || undefined,
    purchasePrice: num(formData.get("purchasePrice")),
    listPrice: num(formData.get("listPrice")),
    soldPrice: num(formData.get("soldPrice")),
  });

  revalidatePath(`/resellpilot/plagg/${id}`);
  revalidatePath("/resellpilot/dashboard");
  return undefined;
}

export async function rpKörPrisresearchAction(itemId: string) {
  const u = await rpNuvarandeAnvandare();
  if (!u) return { ok: false as const, error: "Du måste logga in först." };

  const item = await rpPlaggViaId(itemId, u.id);
  if (!item) return { ok: false as const, error: "Plagget hittades inte." };

  const resultat = await priceResearch({
    brand: item.brand ?? "okänt märke",
    model: item.model ?? "",
    size: item.size ?? "",
    condition: item.condition ?? "",
  });
  if (!resultat) {
    return {
      ok: false as const,
      error: "AI-prisresearch är inte tillgänglig just nu (saknar API-nyckel eller fel uppstod).",
    };
  }

  await rpSparaPrisresearch({
    itemId,
    estimatedLow: resultat.estimatedLow,
    estimatedHigh: resultat.estimatedHigh,
    reasoning: resultat.reasoning,
    sources: resultat.sources,
  });

  revalidatePath(`/resellpilot/plagg/${itemId}`);
  return { ok: true as const };
}

/* ---------- AI: bildanalys och sourcing (anropas direkt från klienten) ---------- */

export async function rpAnalyseraPlaggAction(
  imageUrls: string[],
): Promise<{ ok: true; analys: PlaggAnalys } | { ok: false; error: string }> {
  const u = await rpNuvarandeAnvandare();
  if (!u) return { ok: false, error: "Du måste logga in först." };

  const analys = await analyzeGarment(imageUrls);
  if (!analys) {
    return {
      ok: false,
      error: "AI-analysen är inte tillgänglig just nu (saknar API-nyckel eller fel uppstod).",
    };
  }
  return { ok: true, analys };
}

export async function rpHämtaSourcingAction(): Promise<
  { ok: true; resultat: SourcingResultat } | { ok: false; error: string }
> {
  const u = await rpNuvarandeAnvandare();
  if (!u) return { ok: false, error: "Du måste logga in först." };

  const plagg = await rpPlaggForAnvandare(u.id);
  const sålda = plagg.filter((p) => p.status === "sold" && p.soldPrice != null && p.purchasePrice != null);

  const marginalPerMärke = new Map<string, number[]>();
  const marginalPerModell = new Map<string, number[]>();
  for (const p of sålda) {
    const marginal = (p.soldPrice as number) - (p.purchasePrice as number);
    if (p.brand) marginalPerMärke.set(p.brand, [...(marginalPerMärke.get(p.brand) ?? []), marginal]);
    if (p.model) marginalPerModell.set(p.model, [...(marginalPerModell.get(p.model) ?? []), marginal]);
  }
  const toppLista = (m: Map<string, number[]>) =>
    [...m.entries()]
      .map(([namn, marginaler]) => [namn, marginaler.reduce((a, b) => a + b, 0) / marginaler.length] as const)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([namn]) => namn);

  const resultat = await sourcingIdeas({
    bästaMärken: toppLista(marginalPerMärke),
    bästaKategorier: toppLista(marginalPerModell),
  });
  if (!resultat) {
    return {
      ok: false,
      error: "Sourcing-idéer är inte tillgängliga just nu (saknar API-nyckel eller fel uppstod).",
    };
  }
  return { ok: true, resultat };
}
