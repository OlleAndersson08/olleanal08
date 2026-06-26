/*
  Möjligheter – kärnan i 365-dagarsplattformen.
  En enda "typad" modell rymmer ALLA kategorier (jobb, gig, praktik, volontär ...)
  istället för en tabell per typ. Det är det som låter oss stödja allt utan kaos.
  Låtsasdata tills vi kopplar på en riktig databas.
*/

export type TypNyckel =
  | "sommar"
  | "extra"
  | "deltid"
  | "helg"
  | "praktik"
  | "ferie"
  | "sasong"
  | "volontar"
  | "forsta"
  | "student"
  | "trainee"
  | "gig"
  | "entreprenor"
  | "ai"
  | "lokal";

export type Typ = {
  nyckel: TypNyckel;
  etikett: string;
  emoji: string;
  fran: string; // gradient-start (färgkodar kategorin, Spotify-stil)
  till: string; // gradient-slut
};

export const TYPER: Record<TypNyckel, Typ> = {
  sommar: { nyckel: "sommar", etikett: "Sommarjobb", emoji: "☀️", fran: "#ff9d4d", till: "#ff5e62" },
  extra: { nyckel: "extra", etikett: "Extrajobb", emoji: "⚡", fran: "#4facfe", till: "#2d6cff" },
  deltid: { nyckel: "deltid", etikett: "Deltid", emoji: "🕐", fran: "#43e97b", till: "#16a34a" },
  helg: { nyckel: "helg", etikett: "Helgjobb", emoji: "📅", fran: "#fa709a", till: "#ff5e62" },
  praktik: { nyckel: "praktik", etikett: "Praktik", emoji: "🎓", fran: "#8b5cff", till: "#6a3df0" },
  ferie: { nyckel: "ferie", etikett: "Feriepraktik", emoji: "🏛️", fran: "#f6d365", till: "#fb8c5a" },
  sasong: { nyckel: "sasong", etikett: "Säsongsjobb", emoji: "🎿", fran: "#30cfd0", till: "#2d6cff" },
  volontar: { nyckel: "volontar", etikett: "Volontär", emoji: "❤️", fran: "#25d366", till: "#0ea5a0" },
  forsta: { nyckel: "forsta", etikett: "Första jobbet", emoji: "🌱", fran: "#ffb347", till: "#ff5e62" },
  student: { nyckel: "student", etikett: "Studentjobb", emoji: "📚", fran: "#a18cd1", till: "#6a3df0" },
  trainee: { nyckel: "trainee", etikett: "Trainee", emoji: "🚀", fran: "#f093fb", till: "#8b5cff" },
  gig: { nyckel: "gig", etikett: "Gig", emoji: "💸", fran: "#f7971e", till: "#ff5e62" },
  entreprenor: { nyckel: "entreprenor", etikett: "Entreprenör", emoji: "💡", fran: "#ff6a00", till: "#ee0979" },
  ai: { nyckel: "ai", etikett: "AI-möjlighet", emoji: "🤖", fran: "#00c6ff", till: "#7c5cff" },
  lokal: { nyckel: "lokal", etikett: "Lokalt", emoji: "📍", fran: "#f5576c", till: "#ff5e62" },
};

export type Mojlighet = {
  id: string;
  typ: TypNyckel;
  foretag: string;
  titel: string;
  emoji: string;
  ort: string;
  avstandKm: number;
  ersattning: string; // "130 kr/h", "Arvode", "Meritpoäng" ...
  beskrivning: string;
  taggar: string[];
  match: number;
  gillar: number;
  tittarNu: number;
  videoUrl?: string | null; // valfri video som spelas i flödet
};

export const mojligheter: Mojlighet[] = [
  {
    id: "cafe-solsken",
    typ: "sommar",
    foretag: "Café Solsken",
    titel: "Barista för sommaren",
    emoji: "☕",
    ort: "Stockholm",
    avstandKm: 2,
    ersattning: "130 kr/h",
    beskrivning:
      "Häng med oss i sommar! Vi lär dig allt om kaffe. Glada gäster, bra stämning och fika ingår så klart.",
    taggar: ["Ingen erfarenhet", "Flexibelt", "15+"],
    match: 96,
    gillar: 1284,
    tittarNu: 12,
  },
  {
    id: "ica-helg",
    typ: "helg",
    foretag: "ICA Maxi",
    titel: "Kassa & påfyllning",
    emoji: "🛒",
    ort: "Stockholm",
    avstandKm: 4,
    ersattning: "142 kr/h",
    beskrivning:
      "Extrajobb på helger. Perfekt vid sidan av skolan. Vi värdesätter att du är trevlig och pålitlig.",
    taggar: ["Helger", "16+", "Vid sidan av skolan"],
    match: 89,
    gillar: 842,
    tittarNu: 7,
  },
  {
    id: "flytthjalp-gig",
    typ: "gig",
    foretag: "Olle B.",
    titel: "Flytthjälp på lördag",
    emoji: "📦",
    ort: "Stockholm",
    avstandKm: 1,
    ersattning: "500 kr / 3h",
    beskrivning:
      "Behöver 2 starka personer som hjälper till att bära flyttkartonger och möbler. Betalt samma dag via Swish.",
    taggar: ["Tjäna idag", "Kontant", "Engångs"],
    match: 92,
    gillar: 318,
    tittarNu: 23,
  },
  {
    id: "techbolag-praktik",
    typ: "praktik",
    foretag: "Klarna",
    titel: "Sommarpraktik – produkt",
    emoji: "💳",
    ort: "Stockholm",
    avstandKm: 6,
    ersattning: "Betald praktik",
    beskrivning:
      "Få inblick i hur ett av Sveriges största techbolag bygger produkt. För dig som är nyfiken på framtiden.",
    taggar: ["Meriterande", "18+", "Betald"],
    match: 84,
    gillar: 2105,
    tittarNu: 41,
  },
  {
    id: "glassbar-forsta",
    typ: "forsta",
    foretag: "Sommarstad Glassbar",
    titel: "Glassförsäljare",
    emoji: "🍦",
    ort: "Stockholm",
    avstandKm: 1,
    ersattning: "125 kr/h",
    beskrivning:
      "Sveriges roligaste första jobb? Sälj glass i solen, träffa massor av folk och jobba i ett glatt team.",
    taggar: ["Första jobbet", "15+", "Sommar"],
    match: 93,
    gillar: 1493,
    tittarNu: 15,
  },
  {
    id: "rodakorset-volontar",
    typ: "volontar",
    foretag: "Röda Korset",
    titel: "Läxhjälpare",
    emoji: "📖",
    ort: "Stockholm",
    avstandKm: 3,
    ersattning: "Meritpoäng + intyg",
    beskrivning:
      "Hjälp yngre elever med läxor en kväll i veckan. Ser fantastiskt ut på CV:t och känns meningsfullt.",
    taggar: ["Volontär", "Meriterande", "Kväll"],
    match: 81,
    gillar: 567,
    tittarNu: 4,
  },
  {
    id: "innehallskapare-ai",
    typ: "ai",
    foretag: "Studio Norr",
    titel: "AI-innehållskapare",
    emoji: "🤖",
    ort: "Distans",
    avstandKm: 0,
    ersattning: "Per projekt",
    beskrivning:
      "Skapa korta videos och bilder med AI-verktyg åt lokala företag. Jobba hemifrån, helt flexibelt.",
    taggar: ["Distans", "Kreativt", "Flexibelt"],
    match: 88,
    gillar: 977,
    tittarNu: 33,
  },
  {
    id: "lager-extra",
    typ: "extra",
    foretag: "Boozt",
    titel: "Lagerpersonal kvällar",
    emoji: "📦",
    ort: "Stockholm",
    avstandKm: 8,
    ersattning: "148 kr/h",
    beskrivning:
      "Plocka och packa ordrar på kvällar. Bra extrainkomst, enkelt att lära sig, schyssta kollegor.",
    taggar: ["Extrajobb", "Kvällar", "16+"],
    match: 79,
    gillar: 421,
    tittarNu: 9,
  },
  {
    id: "skidanlaggning-sasong",
    typ: "sasong",
    foretag: "SkiStar Åre",
    titel: "Liftvärd vintersäsong",
    emoji: "🎿",
    ort: "Åre",
    avstandKm: 0,
    ersattning: "Lön + boende",
    beskrivning:
      "Jobba en hel säsong i fjällen. Boende ingår, åk skidor på rasterna, träffa folk från hela världen.",
    taggar: ["Säsong", "Boende ingår", "18+"],
    match: 76,
    gillar: 1822,
    tittarNu: 52,
  },
  {
    id: "barnvakt-lokal",
    typ: "lokal",
    foretag: "Familjen Lind",
    titel: "Barnvakt två kvällar/v",
    emoji: "🧸",
    ort: "Stockholm",
    avstandKm: 1,
    ersattning: "150 kr/h",
    beskrivning:
      "Vi söker en lugn och ansvarsfull person som kan passa våra barn (5 och 7 år) ett par kvällar i veckan.",
    taggar: ["Lokalt", "Kväll", "15+"],
    match: 90,
    gillar: 256,
    tittarNu: 6,
  },
  {
    id: "konsult-student",
    typ: "student",
    foretag: "Academic Work",
    titel: "Studentkonsult – ekonomi",
    emoji: "📊",
    ort: "Stockholm",
    avstandKm: 5,
    ersattning: "165 kr/h",
    beskrivning:
      "Jobba deltid vid sidan av studierna på ett välkänt bolag. Meriterande och flexibelt kring tentor.",
    taggar: ["Studentjobb", "Deltid", "Meriterande"],
    match: 83,
    gillar: 734,
    tittarNu: 18,
  },
  {
    id: "trainee-ung",
    typ: "trainee",
    foretag: "H&M Group",
    titel: "Ungt traineeprogram",
    emoji: "👗",
    ort: "Stockholm",
    avstandKm: 7,
    ersattning: "Lön + utbildning",
    beskrivning:
      "Ett år där du roterar mellan avdelningar och bygger en grund för din karriär. För dig som vill långt.",
    taggar: ["Trainee", "Karriär", "18+"],
    match: 80,
    gillar: 1340,
    tittarNu: 27,
  },
];
