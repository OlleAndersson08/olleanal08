# ResellPilot – AI-stöd för second-hand-flipping

`/resellpilot` är en fristående sektion i samma app, byggd för dig som köper och
säljer streetwear/kläder på Vinted, Plick eller Tradera och vill maximera
marginalen. Den har egna konton (skilda från Knega/SommarMatch) men delar
samma databas, AI-nyckel och bildlagring som resten av appen – så det finns
inget extra att koppla på.

## Vad du får

1. **Plagg-analys via bild** – ladda upp 1–4 bilder (etikett, sömmar,
   material, helhetsbild) så analyserar Claude skick, flaggar eventuella
   äkthetsvarningar (aldrig en garanti – bara ett stöd) och föreslår en
   säljande titel/beskrivning för Vinted.
2. **Prisresearch** – Claude söker på webben efter liknande sålda/listade
   plagg och ger ett rimligt sälj-pris-intervall med motivering och källor.
3. **Break-even & marginal-kalkylator** – ren räknare, ingen AI: inköpspris,
   Vinted-avgift, fraktkostnad och tidsuppskattning → netto-marginal i kr,
   % och ungefärlig timlön.
4. **Dashboard** – dina plagg i tre steg (Sourcat → Listad → Sålt), total
   marginal denna månad, snittmarginal och mest lönsamma märken.
5. **Sourcing-idéer** – en knapp som ber Claude titta på dina bäst säljande
   märken plus aktuella trender och föreslå vad du ska leta efter just nu.

## Vad som krävs

Samma tre miljövariabler som resten av appen (se `.env.example`):

- `DATABASE_URL` – saknas den används en lokal databas automatiskt (bra för
  test). ResellPilots tabeller (`rp_users`, `rp_items`, `rp_price_research`,
  …) skapas automatiskt första gången appen startar, oavsett databas.
- `ANTHROPIC_API_KEY` – krävs för bildanalys, prisresearch och sourcing-idéer.
  Saknas den visar sidorna ett tydligt felmeddelande istället för att krascha.
- `BLOB_READ_WRITE_TOKEN` – krävs för att ladda upp plaggbilder (samma
  Blob-store som videouppladdning använder, se `VIDEO.md`).

## Medvetna avgränsningar

ResellPilot skrapar aldrig Vinted eller andra plattformar och pollar inga
tredjepartssajter automatiskt. All data matas in manuellt eller via
bilduppladdning – Claudes eventuella websökning (prisresearch, sourcing) går
mot allmän prisinformation, inte mot inloggade konton eller privata sidor.
