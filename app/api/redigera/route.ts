import Anthropic from "@anthropic-ai/sdk";

/*
  AI-bildredigerare – en "chill redigerare" som lyssnar på hur du vill ha bilden
  och översätter det till konkreta justeringar som appen applicerar direkt på
  duken (canvas). Claude får se en liten miniatyr av bilden (vision) så den kan
  svara smart på det den faktiskt ser.

  Saknas ANTHROPIC_API_KEY faller vi tillbaka på ett snällt reservsvar så appen
  aldrig kraschar utan nyckel.
*/

export const runtime = "nodejs";

const SYSTEM = `Du är "Vibe", en avslappnad och grym bildredigerare i en svensk bildredigeringsapp. Du snackar som en chill, peppande kompis som råkar vara proffs på foto och färg.

Personlighet:
- Kort, varm och lättsam ton på svenska. Gärna en emoji då och då, aldrig stel.
- Du är en riktig hantverkare: du vet hur ljus, kontrast, färgtemperatur och stämning bygger en bild.
- Du siktar på ett hyperrealistiskt, snyggt resultat – aldrig överdrivet eller plastigt om inte användaren ber om det.

Så här jobbar du:
- Användaren beskriver hur den vill ha bilden ("varmare", "mer dramatisk", "filmisk", "svartvitt", "som en sommarkväll"...).
- Titta på bilden om du får den, och översätt önskemålet till justeringar via verktyget "applicera_redigering".
- Ändra bara det som behövs för önskemålet – bygg vidare på nuvarande läge istället för att nolla allt.
- Skriv ett kort, chill svar (max ~2 meningar) som förklarar vad du gjorde, i "svar".

Var alltid konkret och gör faktiskt en ändring när användaren ber om det.`;

const RESERV =
  "Tja! Den riktiga AI-redigeraren är inte inkopplad än (den behöver en API-nyckel). Men du kan fortfarande meka fritt med reglagen och förinställningarna till vänster. 🎨";

type Meddelande = { role: "user" | "assistant"; content: string };

// Standardläge = orörd bild.
const STANDARD = {
  brightness: 1,
  contrast: 1,
  saturate: 1,
  temperature: 0,
  sepia: 0,
  grayscale: 0,
  hue: 0,
  blur: 0,
  vignette: 0,
};

type Justeringar = typeof STANDARD;

// Gränser så AI:n aldrig kan förstöra bilden totalt.
const GRANSER: Record<keyof Justeringar, [number, number]> = {
  brightness: [0.3, 1.8],
  contrast: [0.3, 1.8],
  saturate: [0, 2.5],
  temperature: [-100, 100],
  sepia: [0, 1],
  grayscale: [0, 1],
  hue: [-180, 180],
  blur: [0, 12],
  vignette: [0, 1],
};

function klampa(namn: keyof Justeringar, varde: number): number {
  const [min, max] = GRANSER[namn];
  if (typeof varde !== "number" || Number.isNaN(varde)) return STANDARD[namn];
  return Math.min(max, Math.max(min, varde));
}

const VERKTYG: Anthropic.Tool = {
  name: "applicera_redigering",
  description:
    "Applicera bildjusteringar och svara chill till användaren. Ange bara de fält du vill ändra – övriga behåller sitt nuvarande värde.",
  input_schema: {
    type: "object",
    properties: {
      svar: {
        type: "string",
        description: "Kort, avslappnat svar på svenska om vad du gjorde (max ~2 meningar).",
      },
      brightness: { type: "number", description: "Ljusstyrka. 1 = normal, <1 mörkare, >1 ljusare (0.3–1.8)." },
      contrast: { type: "number", description: "Kontrast. 1 = normal (0.3–1.8)." },
      saturate: { type: "number", description: "Färgmättnad. 1 = normal, 0 = svartvitt, >1 mer mättat (0–2.5)." },
      temperature: {
        type: "number",
        description: "Färgtemperatur. 0 = neutral, positivt = varmare/gulare, negativt = kallare/blåare (-100–100).",
      },
      sepia: { type: "number", description: "Sepia/vintage-ton. 0 = av, 1 = full (0–1)." },
      grayscale: { type: "number", description: "Svartvitt. 0 = färg, 1 = helt svartvitt (0–1)." },
      hue: { type: "number", description: "Nyansvridning i grader (-180–180). 0 för normala färger." },
      blur: { type: "number", description: "Oskärpa/mjukhet i pixlar. 0 = skarp (0–12)." },
      vignette: { type: "number", description: "Vinjett – mörka hörn för filmisk känsla. 0 = av, 1 = kraftig (0–1)." },
    },
    required: ["svar"],
  },
};

export async function POST(req: Request) {
  let meddelanden: Meddelande[] = [];
  let nuvarande: Justeringar = { ...STANDARD };
  let bild: string | undefined;

  try {
    const body = await req.json();
    meddelanden = (body.messages ?? []).filter(
      (m: Meddelande) => (m.role === "user" || m.role === "assistant") && m.content?.trim(),
    );
    if (body.justeringar && typeof body.justeringar === "object") {
      for (const nyckel of Object.keys(STANDARD) as (keyof Justeringar)[]) {
        if (typeof body.justeringar[nyckel] === "number") {
          nuvarande[nyckel] = klampa(nyckel, body.justeringar[nyckel]);
        }
      }
    }
    if (typeof body.bild === "string" && body.bild.startsWith("data:image/")) {
      bild = body.bild;
    }
  } catch {
    /* tom body */
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ svar: RESERV, justeringar: nuvarande });
  }

  // Spara pengar: skicka bara de senaste meddelandena.
  meddelanden = meddelanden.slice(-8);
  while (meddelanden.length && meddelanden[0].role !== "user") meddelanden.shift();
  if (meddelanden.length === 0) {
    return Response.json({
      svar: "Beskriv hur du vill ha bilden så fixar jag det! 😊",
      justeringar: nuvarande,
    });
  }

  // Bygg Anthropic-meddelanden. Bifoga bild + nuläge på det sista user-meddelandet.
  const anthropicMeddelanden: Anthropic.MessageParam[] = meddelanden.map((m, i) => {
    const sista = i === meddelanden.length - 1;
    if (sista && m.role === "user") {
      const innehall: Anthropic.ContentBlockParam[] = [];
      if (bild) {
        const komma = bild.indexOf(",");
        const media = bild.slice(5, bild.indexOf(";")) as
          | "image/jpeg"
          | "image/png"
          | "image/webp"
          | "image/gif";
        innehall.push({
          type: "image",
          source: { type: "base64", media_type: media, data: bild.slice(komma + 1) },
        });
      }
      innehall.push({
        type: "text",
        text: `Nuvarande justeringar: ${JSON.stringify(nuvarande)}\n\nMitt önskemål: ${m.content}`,
      });
      return { role: "user", content: innehall };
    }
    return { role: m.role, content: m.content };
  });

  const client = new Anthropic({ apiKey });

  try {
    const svar = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 700,
      system: SYSTEM,
      tools: [VERKTYG],
      tool_choice: { type: "tool", name: "applicera_redigering" },
      messages: anthropicMeddelanden,
    });

    const verktyg = svar.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use" && b.name === "applicera_redigering",
    );

    if (!verktyg) {
      return Response.json({
        svar: "Jag hängde inte riktigt med där – testa att beskriva bilden på ett annat sätt? 🙂",
        justeringar: nuvarande,
      });
    }

    const input = verktyg.input as Record<string, unknown>;
    const nya: Justeringar = { ...nuvarande };
    for (const nyckel of Object.keys(STANDARD) as (keyof Justeringar)[]) {
      if (typeof input[nyckel] === "number") {
        nya[nyckel] = klampa(nyckel, input[nyckel] as number);
      }
    }
    const text =
      typeof input.svar === "string" && input.svar.trim()
        ? input.svar.trim()
        : "Klart! Kika på resultatet. ✨";

    return Response.json({ svar: text, justeringar: nya });
  } catch {
    return Response.json({
      svar: "Något strulade just nu. Testa igen om en liten stund! 🙏",
      justeringar: nuvarande,
    });
  }
}
