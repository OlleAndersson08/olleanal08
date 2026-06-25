import { cookies } from "next/headers";
import { scryptSync, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import {
  anvandareViaEmail,
  anvandareViaSession,
  skapaSession,
  raderaSession,
  type DbAnvandare,
} from "@/lib/db";

/*
  Inloggning utan externa bibliotek:
   - Lösenord hashas med scrypt (salt + hash), aldrig i klartext.
   - Sessioner = en slumptoken i en httpOnly-cookie, kopplad i databasen.
*/

const COOKIE = "sm_session";
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

export async function startaSession(userId: string) {
  const token = randomUUID() + randomUUID();
  await skapaSession(token, userId);
  const c = await cookies();
  c.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TRETTIO_DAGAR,
  });
}

export async function avslutaSession() {
  const c = await cookies();
  const token = c.get(COOKIE)?.value;
  if (token) await raderaSession(token);
  c.delete(COOKIE);
}

export async function nuvarandeAnvandare(): Promise<DbAnvandare | null> {
  const c = await cookies();
  const token = c.get(COOKIE)?.value;
  if (!token) return null;
  return (await anvandareViaSession(token)) ?? null;
}

export { anvandareViaEmail };
