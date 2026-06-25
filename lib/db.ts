import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { Pool } from "pg";
import { mojligheter as fro, type TypNyckel } from "@/data/mojligheter";

/*
  Datalager med stöd för TVÅ databaser bakom ett gemensamt async-gränssnitt:

   - Postgres (via "pg") när DATABASE_URL är satt → permanent molndatabas,
     perfekt för livesajten på Vercel. Data minns allt för alla besökare.
   - Annars Nodes inbyggda SQLite (node:sqlite) → smidigt lokalt och i test.

  Samma SQL fungerar i båda (vi använder "?" som platshållare och översätter
  till $1, $2 ... för Postgres). Seedning är idempotent via ON CONFLICT.
*/

const harPostgres = !!(process.env.DATABASE_URL || process.env.POSTGRES_URL);

/* ---------- Lågnivå: en enhetlig async-fråge-funktion ---------- */

type Rad = Record<string, unknown>;

// Postgres-pool (återanvänds inom samma instans).
const g = globalThis as unknown as {
  _smPgPool?: Pool;
  _smSqlite?: DatabaseSync;
  _smInit?: Promise<void>;
};

function pgPool() {
  if (!g._smPgPool) {
    const url = (process.env.DATABASE_URL || process.env.POSTGRES_URL)!;
    const lokal = url.includes("localhost") || url.includes("127.0.0.1");
    g._smPgPool = new Pool({
      connectionString: url,
      ssl: lokal ? undefined : { rejectUnauthorized: false },
      max: 5,
    });
  }
  return g._smPgPool;
}

function sqliteDb() {
  if (!g._smSqlite) {
    const sokvag = process.env.DATABASE_PATH || (process.env.VERCEL ? "/tmp/sommarmatch.db" : "./.data/sommarmatch.db");
    if (sokvag !== ":memory:" && sokvag.includes("/")) {
      const dir = dirname(sokvag);
      if (dir && !existsSync(dir)) mkdirSync(dir, { recursive: true });
    }
    g._smSqlite = new DatabaseSync(sokvag);
  }
  return g._smSqlite;
}

// Översätt "?"-platshållare till "$1, $2 ..." för Postgres.
function tillPg(sql: string) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

async function run(sql: string, params: unknown[] = []): Promise<void> {
  if (harPostgres) {
    await pgPool().query(tillPg(sql), params);
  } else {
    sqliteDb().prepare(sql).run(...params);
  }
}
async function all(sql: string, params: unknown[] = []): Promise<Rad[]> {
  if (harPostgres) {
    const r = await pgPool().query(tillPg(sql), params);
    return r.rows as Rad[];
  }
  return sqliteDb().prepare(sql).all(...params) as Rad[];
}
async function get(sql: string, params: unknown[] = []): Promise<Rad | undefined> {
  const r = await all(sql, params);
  return r[0];
}

/* ---------- Init + seedning (idempotent) ---------- */

async function init() {
  if (!harPostgres) {
    sqliteDb().exec("PRAGMA journal_mode = WAL;");
  }
  // Samma DDL fungerar i båda (TEXT/INTEGER/REAL finns i Postgres och SQLite).
  await run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, namn TEXT, ort TEXT,
    alder INTEGER, roll TEXT NOT NULL DEFAULT 'ungdom', foretag TEXT,
    losen TEXT NOT NULL, skapad BIGINT NOT NULL)`);
  await run(`CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY, user_id TEXT NOT NULL, skapad BIGINT NOT NULL)`);
  await run(`CREATE TABLE IF NOT EXISTS opportunities (
    id TEXT PRIMARY KEY, typ TEXT NOT NULL, foretag TEXT NOT NULL, titel TEXT NOT NULL,
    emoji TEXT NOT NULL, ort TEXT NOT NULL, avstand_km REAL NOT NULL DEFAULT 0,
    ersattning TEXT NOT NULL, beskrivning TEXT NOT NULL, taggar TEXT NOT NULL DEFAULT '[]',
    match INTEGER NOT NULL DEFAULT 85, gillar INTEGER NOT NULL DEFAULT 0,
    tittar_nu INTEGER NOT NULL DEFAULT 0, agare_id TEXT, skapad BIGINT NOT NULL)`);
  await run(`CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY, user_id TEXT NOT NULL, opportunity_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Skickad', skapad BIGINT NOT NULL,
    UNIQUE(user_id, opportunity_id))`);

  // Seed exempelmöjligheter (idempotent – körs säkert även parallellt).
  for (const m of fro) {
    await run(
      `INSERT INTO opportunities
       (id, typ, foretag, titel, emoji, ort, avstand_km, ersattning, beskrivning, taggar, match, gillar, tittar_nu, agare_id, skapad)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING`,
      [m.id, m.typ, m.foretag, m.titel, m.emoji, m.ort, m.avstandKm, m.ersattning,
       m.beskrivning, JSON.stringify(m.taggar), m.match, m.gillar, m.tittarNu, null, Date.now()],
    );
  }
}

function redo(): Promise<void> {
  if (!g._smInit) g._smInit = init();
  return g._smInit;
}

/* ---------- Typer ---------- */
export type DbAnvandare = {
  id: string;
  email: string;
  namn: string | null;
  ort: string | null;
  alder: number | null;
  roll: string;
  foretag: string | null;
};

export type DbMojlighet = {
  id: string;
  typ: TypNyckel;
  foretag: string;
  titel: string;
  emoji: string;
  ort: string;
  avstandKm: number;
  ersattning: string;
  beskrivning: string;
  taggar: string[];
  match: number;
  gillar: number;
  tittarNu: number;
};

function radTillMojlighet(r: Rad): DbMojlighet {
  return {
    id: r.id as string,
    typ: r.typ as TypNyckel,
    foretag: r.foretag as string,
    titel: r.titel as string,
    emoji: r.emoji as string,
    ort: r.ort as string,
    avstandKm: Number(r.avstand_km),
    ersattning: r.ersattning as string,
    beskrivning: r.beskrivning as string,
    taggar: JSON.parse((r.taggar as string) || "[]"),
    match: Number(r.match),
    gillar: Number(r.gillar),
    tittarNu: Number(r.tittar_nu),
  };
}

/* ---------- Användare ---------- */
export async function skapaAnvandare(d: {
  email: string; losen: string; namn?: string; ort?: string; alder?: number; roll: string; foretag?: string;
}): Promise<string> {
  await redo();
  const id = randomUUID();
  await run(
    `INSERT INTO users (id, email, namn, ort, alder, roll, foretag, losen, skapad) VALUES (?,?,?,?,?,?,?,?,?)`,
    [id, d.email, d.namn ?? null, d.ort ?? null, d.alder ?? null, d.roll, d.foretag ?? null, d.losen, Date.now()],
  );
  return id;
}

export async function anvandareViaEmail(email: string) {
  await redo();
  return (await get("SELECT * FROM users WHERE email = ?", [email])) as
    | (DbAnvandare & { losen: string })
    | undefined;
}

export async function anvandareViaId(id: string): Promise<DbAnvandare | undefined> {
  await redo();
  return (await get("SELECT id, email, namn, ort, alder, roll, foretag FROM users WHERE id = ?", [id])) as
    | DbAnvandare
    | undefined;
}

/* ---------- Sessioner ---------- */
export async function skapaSession(token: string, userId: string) {
  await redo();
  await run("INSERT INTO sessions (token, user_id, skapad) VALUES (?,?,?)", [token, userId, Date.now()]);
}
export async function anvandareViaSession(token: string): Promise<DbAnvandare | undefined> {
  await redo();
  return (await get(
    `SELECT u.id, u.email, u.namn, u.ort, u.alder, u.roll, u.foretag
     FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?`,
    [token],
  )) as DbAnvandare | undefined;
}
export async function raderaSession(token: string) {
  await redo();
  await run("DELETE FROM sessions WHERE token = ?", [token]);
}

/* ---------- Möjligheter ---------- */
export async function allaMojligheter(): Promise<DbMojlighet[]> {
  await redo();
  return (await all("SELECT * FROM opportunities ORDER BY skapad DESC")).map(radTillMojlighet);
}
export async function mojligheterForAgare(agareId: string): Promise<DbMojlighet[]> {
  await redo();
  return (await all("SELECT * FROM opportunities WHERE agare_id = ? ORDER BY skapad DESC", [agareId])).map(
    radTillMojlighet,
  );
}
export async function skapaMojlighet(d: {
  typ: TypNyckel; foretag: string; titel: string; emoji: string; ort: string; ersattning: string; beskrivning: string; taggar: string[]; agareId: string;
}): Promise<string> {
  await redo();
  const id = randomUUID();
  await run(
    `INSERT INTO opportunities
     (id, typ, foretag, titel, emoji, ort, avstand_km, ersattning, beskrivning, taggar, match, gillar, tittar_nu, agare_id, skapad)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [id, d.typ, d.foretag, d.titel, d.emoji, d.ort, 0, d.ersattning, d.beskrivning, JSON.stringify(d.taggar),
     85 + Math.floor(Math.random() * 12), 0, 1 + Math.floor(Math.random() * 9), d.agareId, Date.now()],
  );
  return id;
}

/* ---------- Ansökningar ---------- */
export async function skapaAnsokan(userId: string, opportunityId: string) {
  await redo();
  await run(
    `INSERT INTO applications (id, user_id, opportunity_id, status, skapad)
     VALUES (?,?,?,?,?) ON CONFLICT(user_id, opportunity_id) DO NOTHING`,
    [randomUUID(), userId, opportunityId, "Skickad", Date.now()],
  );
}

export type AnsokanRad = { id: string; status: string; foretag: string; titel: string; emoji: string; typ: TypNyckel };
export async function ansokningarForAnvandare(userId: string): Promise<AnsokanRad[]> {
  await redo();
  return (await all(
    `SELECT a.id, a.status, o.foretag, o.titel, o.emoji, o.typ
     FROM applications a JOIN opportunities o ON o.id = a.opportunity_id
     WHERE a.user_id = ? ORDER BY a.skapad DESC`,
    [userId],
  )) as AnsokanRad[];
}
export async function ansoktIder(userId: string): Promise<string[]> {
  await redo();
  return (await all("SELECT opportunity_id FROM applications WHERE user_id = ?", [userId])).map(
    (r) => r.opportunity_id as string,
  );
}

export type SokandeRad = { namn: string | null; ort: string | null; alder: number | null; titel: string; status: string };
export async function sokandeForAgare(agareId: string): Promise<SokandeRad[]> {
  await redo();
  return (await all(
    `SELECT u.namn, u.ort, u.alder, o.titel, a.status
     FROM applications a
     JOIN opportunities o ON o.id = a.opportunity_id
     JOIN users u ON u.id = a.user_id
     WHERE o.agare_id = ? ORDER BY a.skapad DESC`,
    [agareId],
  )) as SokandeRad[];
}
