import Anthropic from "@anthropic-ai/sdk";

/*
  All AI-funktionalitet för ResellPilot samlad på ett ställe.
  Modell: Claude Sonnet 5 (claude-sonnet-5) – bättre och billigare än
  claude-sonnet-4-6 som nämndes i ursprungsspecen, så vi kör den nyare.
  Saknas ANTHROPIC_API_KEY returnerar funktionerna null/reservtext istället
  för att krascha, samma mönster som AI-coachen i app/api/coach/route.ts.
*/

export const MODEL = "claude-sonnet-5";

function client(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  return apiKey ? new Anthropic({ apiKey }) : null;
}

/* ---------- 1. Plagg-analys via bild (Claude Vision) ---------- */

export type PlaggAnalys = {
  brand: string | null;
  model: string | null;
  condition: string;
  conditionReasoning: string;
  authenticityFlags: string[];
  authenticityDisclaimer: string;
  suggestedTitle: string;
  suggestedDescription: string;
};

const ANALYS_SCHEMA = {
  type: "object",
  properties: {
    brand: {
      anyOf: [{ type: "string" }, { type: "null" }],
      description: "Troligt märke om synligt/identifierbart, annars null.",
    },
    model: {
      anyOf: [{ type: "string" }, { type: "null" }],
      description: "Troslig modell/kollektion om identifierbar, annars null.",
    },
    condition: {
      type: "string",
      enum: ["Nyskick", "Mycket bra", "Bra", "Slitet"],
      description: "Bedömt skick.",
    },
    conditionReasoning: {
      type: "string",
      description: "Kort motivering (svenska) till skickbedömningen.",
    },
    authenticityFlags: {
      type: "array",
      items: { type: "string" },
      description:
        "Konkreta äkthetsvarningar (t.ex. fel loggo-typsnitt, fel material, misstänkta sömmar). Tom lista om inget avvikande upptäcks.",
    },
    authenticityDisclaimer: {
      type: "string",
      description:
        "Tydlig disclaimer på svenska om att detta INTE är en garanti för äkthet, bara ett stöd.",
    },
    suggestedTitle: {
      type: "string",
      description: "Säljande titel optimerad för sökning på Vinted (svenska).",
    },
    suggestedDescription: {
      type: "string",
      description: "Säljande, konkret beskrivning för en Vinted-annons (svenska).",
    },
  },
  required: [
    "brand",
    "model",
    "condition",
    "conditionReasoning",
    "authenticityFlags",
    "authenticityDisclaimer",
    "suggestedTitle",
    "suggestedDescription",
  ],
  additionalProperties: false,
};

export async function analyzeGarment(imageUrls: string[]): Promise<PlaggAnalys | null> {
  const c = client();
  if (!c || imageUrls.length === 0) return null;

  const content: Anthropic.ContentBlockParam[] = [
    ...imageUrls.slice(0, 4).map(
      (url): Anthropic.ContentBlockParam => ({
        type: "image",
        source: { type: "url", url },
      }),
    ),
    {
      type: "text",
      text: `Du är en expert på second-hand-flipping av streetwear/kläder (Vinted, Plick, Tradera).
Analysera bilderna av plagget (etikett, sömmar, material, helhetsbild om de finns) och:

1. Identifiera troligt märke och modell om det syns på etikett/loggor.
2. Bedöm skick: Nyskick, Mycket bra, Bra eller Slitet – med en kort motivering.
3. Flagga eventuella äkthetsvarningar (t.ex. fel loggo-typsnitt, fel material, misstänkta sömmar).
   Var återhållsam – flagga bara sådant du faktiskt kan se på bilderna. Skriv alltid en tydlig
   disclaimer om att detta INTE är en garanti för äkthet, bara ett stöd för säljaren.
4. Föreslå en säljande titel och beskrivning optimerad för Vinted-sökning.

Svara på svenska.`,
    },
  ];

  const response = await c.messages.create({
    model: MODEL,
    max_tokens: 2048,
    thinking: { type: "adaptive" },
    output_config: { effort: "medium", format: { type: "json_schema", schema: ANALYS_SCHEMA } },
    messages: [{ role: "user", content }],
  });

  if (response.stop_reason === "refusal") return null;
  const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
  if (!textBlock) return null;
  try {
    return JSON.parse(textBlock.text) as PlaggAnalys;
  } catch {
    return null;
  }
}

/* ---------- 2. Prisresearch (web_search) ---------- */

export type Kalla = { title: string; url: string };

export type PrisresearchResultat = {
  estimatedLow: number | null;
  estimatedHigh: number | null;
  reasoning: string;
  sources: Kalla[];
};

function extraheraJson(text: string): Record<string, unknown> | null {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  const rå = fenced ? fenced[1] : text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  try {
    return JSON.parse(rå);
  } catch {
    return null;
  }
}

function extraheraKallor(content: Anthropic.ContentBlock[]): Kalla[] {
  const kallor: Kalla[] = [];
  const sedda = new Set<string>();
  for (const block of content) {
    if (block.type !== "web_search_tool_result") continue;
    const resultat = block.content;
    if (!Array.isArray(resultat)) continue;
    for (const r of resultat) {
      if (r.type === "web_search_result" && !sedda.has(r.url)) {
        sedda.add(r.url);
        kallor.push({ title: r.title, url: r.url });
      }
    }
  }
  return kallor.slice(0, 6);
}

export async function priceResearch(input: {
  brand: string;
  model: string;
  size: string;
  condition: string;
  vintedInfo?: string;
}): Promise<PrisresearchResultat | null> {
  const c = client();
  if (!c) return null;

  const prompt = `Du hjälper en second-hand-reseller uppskatta ett rimligt SÄLJPRIS för ett plagg på
Vinted/Plick/Tradera i Sverige.

Märke: ${input.brand}
Modell: ${input.model || "okänd"}
Storlek: ${input.size || "okänd"}
Skick: ${input.condition || "okänt"}
${input.vintedInfo ? `Extra info från säljaren: ${input.vintedInfo}` : ""}

Sök efter liknande sålda/listade plagg (märke, modell, skick, säsong, efterfrågan) och uppskatta ett
rimligt sälj-pris-intervall i SEK. Var kortfattad.

Avsluta ditt svar med ENDAST ett JSON-block enligt exakt detta format och inget mer text efter det:
\`\`\`json
{"estimatedLow": <tal i kr>, "estimatedHigh": <tal i kr>, "reasoning": "<kort motivering på svenska>"}
\`\`\``;

  const response = await c.messages.create({
    model: MODEL,
    max_tokens: 2048,
    thinking: { type: "adaptive" },
    output_config: { effort: "medium" },
    tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 5 }],
    messages: [{ role: "user", content: prompt }],
  });

  if (response.stop_reason === "refusal") return null;
  const textBlocks = response.content.filter((b): b is Anthropic.TextBlock => b.type === "text");
  const sista = textBlocks[textBlocks.length - 1]?.text ?? "";
  const json = extraheraJson(sista);
  const sources = extraheraKallor(response.content);

  return {
    estimatedLow: typeof json?.estimatedLow === "number" ? json.estimatedLow : null,
    estimatedHigh: typeof json?.estimatedHigh === "number" ? json.estimatedHigh : null,
    reasoning: typeof json?.reasoning === "string" ? json.reasoning : sista,
    sources,
  };
}

/* ---------- 3. Sourcing-idéer (web_search) ---------- */

export type SourcingResultat = { text: string; sources: Kalla[] };

export async function sourcingIdeas(context: {
  bästaMärken: string[];
  bästaKategorier: string[];
}): Promise<SourcingResultat | null> {
  const c = client();
  if (!c) return null;

  const prompt = `Du hjälper en second-hand-reseller av streetwear/kläder på Vinted/Plick/Tradera hitta
vad de ska leta efter just nu vid sourcing (loppis, second hand-butiker, återvinning).

Deras tidigare försäljningar visar bäst marginal på:
- Märken: ${context.bästaMärken.length ? context.bästaMärken.join(", ") : "inga loggade ännu"}
- Kategorier: ${context.bästaKategorier.length ? context.bästaKategorier.join(", ") : "inga loggade ännu"}

Sök efter aktuella trender för kommande säsong och ge 4-6 konkreta, handfasta
sourcing-rekommendationer (specifika märken/modeller/kategorier att leta efter, varför de är
lönsamma just nu). Svara kort och konkret på svenska, punktlista.`;

  const response = await c.messages.create({
    model: MODEL,
    max_tokens: 2048,
    thinking: { type: "adaptive" },
    output_config: { effort: "medium" },
    tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 5 }],
    messages: [{ role: "user", content: prompt }],
  });

  if (response.stop_reason === "refusal") return null;
  const textBlocks = response.content.filter((b): b is Anthropic.TextBlock => b.type === "text");
  const text = textBlocks.map((b) => b.text).join("\n\n");
  return { text, sources: extraheraKallor(response.content) };
}
