/*
  Exempeljobb (låtsasdata).
  Det här låter oss bygga och testa jobbflödet INNAN vi har en riktig databas.
  Senare byter vi ut den här filen mot riktiga jobb från företagen.
*/

export type Jobb = {
  id: string;
  foretag: string;
  titel: string;
  emoji: string;
  ort: string;
  avstandKm: number;
  lon: string;
  beskrivning: string;
  taggar: string[];
  // Två färger som bildar bakgrundens toning (gradient) på kortet
  fran: string;
  till: string;
};

export const jobb: Jobb[] = [
  {
    id: "cafe-solsken",
    foretag: "Café Solsken",
    titel: "Barista för sommaren",
    emoji: "☕",
    ort: "Stockholm",
    avstandKm: 2,
    lon: "130 kr/h",
    beskrivning:
      "Häng med oss i sommar! Vi lär dig allt om kaffe. Glada gäster, bra stämning och fika ingår så klart.",
    taggar: ["Sommarjobb", "Ingen erfarenhet krävs", "Flexibelt"],
    fran: "#fcd34d",
    till: "#f97316",
  },
  {
    id: "ica-maxi",
    foretag: "ICA Maxi",
    titel: "Kassa & påfyllning",
    emoji: "🛒",
    ort: "Stockholm",
    avstandKm: 4,
    lon: "142 kr/h",
    beskrivning:
      "Extrajobb på helger och kvällar. Perfekt vid sidan av skolan. Vi värdesätter att du är trevlig och pålitlig.",
    taggar: ["Extrajobb", "Helger", "16+"],
    fran: "#fca5a5",
    till: "#ef4444",
  },
  {
    id: "sommarstad-glass",
    foretag: "Sommarstad Glassbar",
    titel: "Glassförsäljare",
    emoji: "🍦",
    ort: "Stockholm",
    avstandKm: 1,
    lon: "125 kr/h",
    beskrivning:
      "Sveriges roligaste sommarjobb? Sälj glass i solen, träffa massor av folk och jobba i ett glatt team.",
    taggar: ["Sommarjobb", "Första jobbet", "15+"],
    fran: "#a5b4fc",
    till: "#6366f1",
  },
  {
    id: "gront-tradgard",
    foretag: "Grönt & Skönt",
    titel: "Trädgårdshjälp",
    emoji: "🌱",
    ort: "Stockholm",
    avstandKm: 6,
    lon: "138 kr/h",
    beskrivning:
      "Gillar du att vara utomhus? Hjälp oss plantera, vattna och hålla parkerna fina under sommaren.",
    taggar: ["Sommarjobb", "Utomhus", "Dagtid"],
    fran: "#86efac",
    till: "#16a34a",
  },
  {
    id: "pizzeria-napoli",
    foretag: "Pizzeria Napoli",
    titel: "Servis & utkörning",
    emoji: "🍕",
    ort: "Stockholm",
    avstandKm: 3,
    lon: "135 kr/h + dricks",
    beskrivning:
      "Vi söker en pigg person till sommaren. Ta emot beställningar, servera och kör ut pizzor i kvarteret.",
    taggar: ["Sommarjobb", "Kvällar", "Dricks"],
    fran: "#fdba74",
    till: "#ea580c",
  },
];
