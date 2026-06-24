import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { mojligheter as fro, type TypNyckel } from "@/data/mojligheter";

/*
  Riktig databas på Nodes inbyggda SQLite – noll externa beroenden.
  Sparar användare, sessioner, möjligheter och ansökningar på riktigt.

  Filens plats:
   - Vercel/serverless: /tmp (enda skrivbara stället)
   - Lokalt: ./.data/sommarmatch.db
  För en publik livesajt som ska minnas allt för alla besökare pekar man
  DATABASE_PATH mot en delad disk, eller byter datalagret mot Postgres.
*/

function dbSokvag() {
  if (process.env.DATABASE_PATH) return process.env.DATABASE_PATH;
  if (process.env.VERCEL) return "/tmp/sommarmatch.db";
  return "./.data/sommarmatch.db";
}

// Singleton som överlever hot-reload i utveckling.
const g = globalThis as unknown as { _smDb?: DatabaseSync };

function init(): DatabaseSync {
  const sokvag = dbSokvag();
  if (sokvag !== ":memory:" && sokvag.includes("/")) {
    const dir = dirname(sokvag);
    if (dir && !existsSync(dir)) mkdirSync(dir, { recursive: true });
  }
  const db = new DatabaseSync(sokvag);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      namn TEXT,
      ort TEXT,
      alder INTEGER,
      roll TEXT NOT NULL DEFAULT 'ungdom',
      foretag TEXT,
      losen TEXT NOT NULL,
      skapad INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      skapad INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS opportunities (
      id TEXT PRIMARY KEY,
      typ TEXT NOT NULL,
      foretag TEXT NOT NULL,
      titel TEXT NOT NULL,
      emoji TEXT NOT NULL,
      ort TEXT NOT NULL,
      avstand_km REAL NOT NULL DEFAULT 0,
      ersattning TEXT NOT NULL,
      beskrivning TEXT NOT NULL,
      taggar TEXT NOT NULL DEFAULT '[]',
      match INTEGER NOT NULL DEFAULT 85,
      gillar INTEGER NOT NULL DEFAULT 0,
      tittar_nu INTEGER NOT NULL DEFAULT 0,
      agare_id TEXT,
      skapad INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      opportunity_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Skickad',
      skapad INTEGER NOT NULL,
      UNIQUE(user_id, opportunity_id)
    );
  `);
  seed(db);
  return db;
}

function seed(db: DatabaseSync) {
  const antal = db.prepare("SELECT COUNT(*) c FROM opportunities").get() as { c: number };
  if (antal.c > 0) return;
  const stmt = db.prepare(
    `INSERT INTO opportunities
     (id, typ, foretag, titel, emoji, ort, avstand_km, ersattning, beskrivning, taggar, match, gillar, tittar_nu, agare_id, skapad)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  );
  const nu = Date.now();
  for (const m of fro) {
    stmt.run(
      m.id, m.typ, m.foretag, m.titel, m.emoji, m.ort, m.avstandKm, m.ersattning,
      m.beskrivning, JSON.stringify(m.taggar), m.match, m.gillar, m.tittarNu, null, nu,
    );
  }
}

export function db(): DatabaseSync {
  if (!g._smDb) g._smDb = init();
  return g._smDb;
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

function radTillMojlighet(r: Record<string, unknown>): DbMojlighet {
  return {
    id: r.id as string,
    typ: r.typ as TypNyckel,
    foretag: r.foretag as string,
    titel: r.titel as string,
    emoji: r.emoji as string,
    ort: r.ort as string,
    avstandKm: r.avstand_km as number,
    ersattning: r.ersattning as string,
    beskrivning: r.beskrivning as string,
    taggar: JSON.parse((r.taggar as string) || "[]"),
    match: r.match as number,
    gillar: r.gillar as number,
    tittarNu: r.tittar_nu as number,
  };
}

/* ---------- Användare ---------- */
export function skapaAnvandare(d: {
  email: string;
  losen: string;
  namn?: string;
  ort?: string;
  alder?: number;
  roll: string;
  foretag?: string;
}): string {
  const id = randomUUID();
  db()
    .prepare(
      `INSERT INTO users (id, email, namn, ort, alder, roll, foretag, losen, skapad)
       VALUES (?,?,?,?,?,?,?,?,?)`,
    )
    .run(id, d.email, d.namn ?? null, d.ort ?? null, d.alder ?? null, d.roll, d.foretag ?? null, d.losen, Date.now());
  return id;
}

export function anvandareViaEmail(email: string) {
  return db().prepare("SELECT * FROM users WHERE email = ?").get(email) as
    | (DbAnvandare & { losen: string })
    | undefined;
}

export function anvandareViaId(id: string): DbAnvandare | undefined {
  const r = db().prepare("SELECT id, email, namn, ort, alder, roll, foretag FROM users WHERE id = ?").get(id);
  return r as DbAnvandare | undefined;
}

/* ---------- Sessioner ---------- */
export function skapaSession(token: string, userId: string) {
  db().prepare("INSERT INTO sessions (token, user_id, skapad) VALUES (?,?,?)").run(token, userId, Date.now());
}
export function anvandareViaSession(token: string): DbAnvandare | undefined {
  const r = db()
    .prepare(
      `SELECT u.id, u.email, u.namn, u.ort, u.alder, u.roll, u.foretag
       FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?`,
    )
    .get(token);
  return r as DbAnvandare | undefined;
}
export function raderaSession(token: string) {
  db().prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

/* ---------- Möjligheter ---------- */
export function allaMojligheter(): DbMojlighet[] {
  return db().prepare("SELECT * FROM opportunities ORDER BY skapad DESC").all().map(radTillMojlighet);
}
export function mojligheterForAgare(agareId: string): DbMojlighet[] {
  return db()
    .prepare("SELECT * FROM opportunities WHERE agare_id = ? ORDER BY skapad DESC")
    .all(agareId)
    .map(radTillMojlighet);
}
export function skapaMojlighet(d: {
  typ: TypNyckel;
  foretag: string;
  titel: string;
  emoji: string;
  ort: string;
  ersattning: string;
  beskrivning: string;
  taggar: string[];
  agareId: string;
}): string {
  const id = randomUUID();
  db()
    .prepare(
      `INSERT INTO opportunities
       (id, typ, foretag, titel, emoji, ort, avstand_km, ersattning, beskrivning, taggar, match, gillar, tittar_nu, agare_id, skapad)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    )
    .run(
      id, d.typ, d.foretag, d.titel, d.emoji, d.ort, 0, d.ersattning, d.beskrivning,
      JSON.stringify(d.taggar), 85 + Math.floor(Math.random() * 12), 0, 1 + Math.floor(Math.random() * 9),
      d.agareId, Date.now(),
    );
  return id;
}

/* ---------- Ansökningar ---------- */
export function skapaAnsokan(userId: string, opportunityId: string) {
  try {
    db()
      .prepare("INSERT INTO applications (id, user_id, opportunity_id, status, skapad) VALUES (?,?,?,?,?)")
      .run(randomUUID(), userId, opportunityId, "Skickad", Date.now());
  } catch {
    // redan ansökt (UNIQUE) – strunta i det
  }
}

export type AnsokanRad = {
  id: string;
  status: string;
  foretag: string;
  titel: string;
  emoji: string;
  typ: TypNyckel;
};
export function ansokningarForAnvandare(userId: string): AnsokanRad[] {
  return db()
    .prepare(
      `SELECT a.id, a.status, o.foretag, o.titel, o.emoji, o.typ
       FROM applications a JOIN opportunities o ON o.id = a.opportunity_id
       WHERE a.user_id = ? ORDER BY a.skapad DESC`,
    )
    .all(userId) as AnsokanRad[];
}
export function ansoktIder(userId: string): string[] {
  return db()
    .prepare("SELECT opportunity_id FROM applications WHERE user_id = ?")
    .all(userId)
    .map((r) => r.opportunity_id as string);
}

export type SokandeRad = {
  namn: string | null;
  ort: string | null;
  alder: number | null;
  titel: string;
  status: string;
};
export function sokandeForAgare(agareId: string): SokandeRad[] {
  return db()
    .prepare(
      `SELECT u.namn, u.ort, u.alder, o.titel, a.status
       FROM applications a
       JOIN opportunities o ON o.id = a.opportunity_id
       JOIN users u ON u.id = a.user_id
       WHERE o.agare_id = ? ORDER BY a.skapad DESC`,
    )
    .all(agareId) as SokandeRad[];
}
