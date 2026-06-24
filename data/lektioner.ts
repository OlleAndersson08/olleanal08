/*
  Lektioner – "Duolingo för anställningsbarhet".
  2-minuters mikro-lektioner som ger XP, bygger streak och låser upp
  badges som arbetsgivare litar på. Detta är den dagliga vanan.
*/

export type Lektion = {
  id: string;
  titel: string;
  emoji: string;
  minuter: number;
  xp: number;
  klar: boolean;
  last: boolean;
};

export const lektioner: Lektion[] = [
  { id: "l1", titel: "Skriv ett perfekt SMS till chefen", emoji: "💬", minuter: 2, xp: 20, klar: true, last: false },
  { id: "l2", titel: "Vad får du tjäna skattefritt?", emoji: "💰", minuter: 2, xp: 20, klar: true, last: false },
  { id: "l3", titel: "Svara på 'Berätta om dig själv'", emoji: "🎤", minuter: 3, xp: 30, klar: false, last: false },
  { id: "l4", titel: "Dina rättigheter som ung anställd", emoji: "⚖️", minuter: 3, xp: 30, klar: false, last: true },
  { id: "l5", titel: "Kroppsspråk på intervjun", emoji: "🧍", minuter: 2, xp: 20, klar: false, last: true },
  { id: "l6", titel: "Förhandla din första lön", emoji: "📈", minuter: 3, xp: 40, klar: false, last: true },
];

export type Badge = {
  id: string;
  titel: string;
  emoji: string;
  upplast: boolean;
};

export const badges: Badge[] = [
  { id: "b1", titel: "Snabb svarare", emoji: "⚡", upplast: true },
  { id: "b2", titel: "Pålitlig", emoji: "🤝", upplast: true },
  { id: "b3", titel: "Första giget klart", emoji: "💸", upplast: true },
  { id: "b4", titel: "Intervjuproffs", emoji: "🎤", upplast: false },
  { id: "b5", titel: "Teamspelare", emoji: "🫂", upplast: false },
  { id: "b6", titel: "Lagledare", emoji: "👑", upplast: false },
];
