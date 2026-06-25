import Anthropic from "@anthropic-ai/sdk";

/*
  AI-karriärcoach – streamar svar från Claude.
  Saknas ANTHROPIC_API_KEY faller vi tillbaka på ett snällt meddelande,
  så appen aldrig kraschar utan nyckel.
*/

export const runtime = "nodejs";

const SYSTEM = `Du är SommarMatchs AI-karriärcoach. Du hjälper unga i Sverige (15–25 år) med jobb, extrajobb, gig, första jobbet, praktik, intervjuer, lön och arbetsrätt.

Svara kort, konkret och uppmuntrande – på svenska. Anpassa råden efter svenska regler (åldersgränser för arbete, skattefri inkomst och intyg för lön utan skatteavdrag, arbetstider för minderåriga). Målgruppen är ofta minderårig: var trygg och respektfull, ge aldrig olämpliga råd, och hänvisa till förälder, skola eller facket när det passar.

Svara direkt med ditt slutsvar, utan att skriva ut ditt resonemang. Håll svaren korta och kärnfulla – gärna under 80 ord. Avsluta gärna med en kort, peppande mening.`;

const RESERV =
  "Hej! Den riktiga AI-coachen är inte påkopplad än (den behöver en API-nyckel). Tills dess: kolla lektionerna under Väx – de svarar på det mesta om ditt första jobb. 🌱";

type Meddelande = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  let meddelanden: Meddelande[] = [];
  try {
    const body = await req.json();
    meddelanden = (body.messages ?? []).filter(
      (m: Meddelande) => (m.role === "user" || m.role === "assistant") && m.content?.trim(),
    );
  } catch {
    /* tom body */
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(RESERV, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  // Spara pengar: skicka bara de senaste meddelandena (mindre att betala för).
  meddelanden = meddelanden.slice(-8);
  // Säkerställ att samtalet börjar med ett user-meddelande.
  while (meddelanden.length && meddelanden[0].role !== "user") meddelanden.shift();
  if (meddelanden.length === 0) {
    return new Response("Skriv en fråga så hjälper jag dig! 😊", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const client = new Anthropic({ apiKey });
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const claude = client.messages.stream({
          // Billigaste Claude-modellen – mycket bra för en chattcoach.
          model: "claude-haiku-4-5",
          // Korta svar = lägre kostnad (coachen ska ändå svara kärnfullt).
          max_tokens: 512,
          system: SYSTEM,
          messages: meddelanden,
        });

        for await (const event of claude) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        const slut = await claude.finalMessage();
        if (slut.stop_reason === "refusal") {
          controller.enqueue(
            encoder.encode(
              "Jag kan tyvärr inte svara på just det. Fråga gärna om något annat kring jobb! 🙂",
            ),
          );
        }
      } catch {
        controller.enqueue(encoder.encode("Något gick fel just nu. Försök igen om en liten stund."));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
