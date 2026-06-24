/*
  Gig – små uppdrag du kan göra IDAG och få betalt direkt.
  Det här är den icke-episodiska kroken: en anledning att öppna appen
  varje dag även när man inte söker ett "riktigt" jobb.
*/

export type Gig = {
  id: string;
  titel: string;
  emoji: string;
  vem: string;
  avstandKm: number;
  ersattning: string;
  tid: string;
  nar: string;
};

export const gigs: Gig[] = [
  { id: "g1", titel: "Bära flyttkartonger", emoji: "📦", vem: "Olle B.", avstandKm: 1, ersattning: "500 kr", tid: "~3h", nar: "Idag 15:00" },
  { id: "g2", titel: "Rasta hund", emoji: "🐕", vem: "Familjen Ek", avstandKm: 0.4, ersattning: "120 kr", tid: "~45 min", nar: "Idag 17:00" },
  { id: "g3", titel: "Montera IKEA-möbler", emoji: "🔧", vem: "Sara M.", avstandKm: 2, ersattning: "350 kr", tid: "~2h", nar: "Imorgon" },
  { id: "g4", titel: "Dela ut flygblad", emoji: "📄", vem: "Café Solsken", avstandKm: 1.5, ersattning: "300 kr", tid: "~2h", nar: "Lördag" },
  { id: "g5", titel: "Hjälp med trädgård", emoji: "🌿", vem: "Bengt L.", avstandKm: 3, ersattning: "400 kr", tid: "~2,5h", nar: "Söndag" },
  { id: "g6", titel: "Filma event med mobil", emoji: "🎥", vem: "Studio Norr", avstandKm: 4, ersattning: "600 kr", tid: "~3h", nar: "Fredag" },
];
