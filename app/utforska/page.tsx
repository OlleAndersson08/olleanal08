import UtforskaKlient from "@/components/UtforskaKlient";
import { allaMojligheter } from "@/lib/db";

/*
  Utforska – serverdel: hämtar alla möjligheter från databasen.
*/

export const dynamic = "force-dynamic";

export default function Utforska() {
  return <UtforskaKlient mojligheter={allaMojligheter()} />;
}
