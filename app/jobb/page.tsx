import JobbFlode from "@/components/JobbFlode";
import { mojligheter } from "@/data/mojligheter";

/*
  Flöde (Hem) – det kuraterade "För dig"-flödet, hjärtat i appen.
  Blandar alla möjlighetstyper; kategorifiltrering finns under Utforska.
*/

export default function FlodeSida() {
  return (
    <main className="flex-1 bg-bg">
      <JobbFlode jobb={mojligheter} />
    </main>
  );
}
