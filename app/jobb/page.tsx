import JobbFlode from "@/components/JobbFlode";
import { allaMojligheter, ansoktIder } from "@/lib/db";
import { nuvarandeAnvandare } from "@/lib/auth";

/*
  Flöde (Hem) – det kuraterade "För dig"-flödet, nu från riktig databas.
  Läser inloggad användare för att veta vilka man redan ansökt till.
*/

export const dynamic = "force-dynamic";

export default async function FlodeSida() {
  const u = await nuvarandeAnvandare();
  const mojligheter = allaMojligheter();
  const ansokta = u ? ansoktIder(u.id) : [];

  return (
    <main className="flex-1 bg-bg">
      <JobbFlode jobb={mojligheter} ansokta={ansokta} inloggad={!!u} />
    </main>
  );
}
