import { cookies } from "next/headers";
import { scryptSync, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import {
  rpAnvandareViaEmail,
  rpAnvandareViaSession,
  rpSkapaSession,
  rpRaderaSession,
  type RpAnvandare,
} from "@/lib/db";

/*
  Egen inloggning för ResellPilot – separat cookie/session från Knega/SommarMatch,
  eftersom det är en fristående sektion med egna konton. Samma mönster (scrypt +
  httpOnly-cookie) som lib/auth.ts, men aldrig delad state.
*/

const COOKIE = "rp_session";
const TRETTIO_DAGAR = 60 * 60 * 24 * 30;

export function hashaLosen(losen: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(losen, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifieraLosen(losen: string, lagrat: string): boolean {
  const [salt, hash] = lagrat.split(":");
  if (!salt || !hash) return false;
  const test = scryptSync(losen, salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(test, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function rpStartaSession(userId: string) {
  const token = randomUUID() + randomUUID();
  await rpSkapaSession(token, userId);
  const c = await cookies();
  c.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TRETTIO_DAGAR,
  });
}

export async function rpAvslutaSession() {
  const c = await cookies();
  const token = c.get(COOKIE)?.value;
  if (token) await rpRaderaSession(token);
  c.delete(COOKIE);
}

export async function rpNuvarandeAnvandare(): Promise<RpAnvandare | null> {
  const c = await cookies();
  const token = c.get(COOKIE)?.value;
  if (!token) return null;
  return (await rpAnvandareViaSession(token)) ?? null;
}

export { rpAnvandareViaEmail };
