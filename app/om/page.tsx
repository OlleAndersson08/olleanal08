import Link from "next/link";

/*
  Om oss – grundarens story + förtroende-signaler.
  Texten är skriven för Olle men ändra fritt så att den känns som din.
*/

export const metadata = {
  title: "Om SommarMatch – byggt av unga, för unga",
};

const trygghet = [
  { emoji: "🆓", titel: "Gratis för unga", text: "Det kostar aldrig något att söka jobb hos oss." },
  { emoji: "✅", titel: "Riktiga arbetsgivare", text: "Vi jobbar för att varje företag ska vara på riktigt." },
  { emoji: "🔒", titel: "Tryggt & GDPR", text: "Vi värnar om dina uppgifter – extra noga för minderåriga." },
  { emoji: "🇸🇪", titel: "Byggt i Sverige", text: "För svenska ungdomar 15–25 och lokala arbetsgivare." },
];

export default function Om() {
  return (
    <main className="relative flex-1 overflow-x-hidden bg-bg">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="anim-float absolute -top-24 -right-20 h-72 w-72 rounded-full bg-rose/25 blur-[90px]" />
        <div className="anim-float absolute top-72 -left-20 h-72 w-72 rounded-full bg-violet/20 blur-[90px]" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative mx-auto max-w-md px-6 pb-16 pt-6">
        <Link href="/" className="inline-block text-2xl text-mute transition-all duration-200 hover:-translate-x-0.5 hover:text-text" aria-label="Tillbaka">
          ←
        </Link>

        {/* Hero */}
        <div className="anim-up mt-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-mute">
            ✨ Vår story
          </span>
          <h1 className="mt-5 text-[2.4rem] font-extrabold leading-[1.05] tracking-tight">
            Byggt av en 17-åring som var trött på att söka jobb som det är{" "}
            <span className="text-brand-anim">1995</span>.
          </h1>
        </div>

        {/* Story */}
        <div className="anim-up mt-7 space-y-4 text-[15px] leading-relaxed text-mute" style={{ animationDelay: "0.1s" }}>
          <p>
            Hej! Jag heter Olle och är 17 år. När jag skulle söka mitt första jobb möttes jag av
            krångliga sajter byggda för vuxna, CV-mallar jag inte fattade och annonser där ingen
            svarade. Det kändes som ett prov man inte pluggat till.
          </p>
          <p>
            Samtidigt hörde jag lokala caféer och butiker säga att de inte hittade unga att anställa.
            Båda sidorna ville samma sak — men hittade inte varandra. Så jag bestämde mig för att
            bygga bron själv.
          </p>
          <p className="font-semibold text-text">
            SommarMatch gör att unga hittar jobb genom att svepa – lika enkelt som att scrolla på
            mobilen – och att företag kan lägga upp en tjänst på två minuter, gärna med en kort video.
          </p>
        </div>

        {/* Trygghet */}
        <div className="anim-up mt-9 grid grid-cols-2 gap-3" style={{ animationDelay: "0.16s" }}>
          {trygghet.map((t) => (
            <div key={t.titel} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="text-2xl">{t.emoji}</span>
              <p className="mt-2 font-bold">{t.titel}</p>
              <p className="mt-1 text-sm text-mute">{t.text}</p>
            </div>
          ))}
        </div>

        {/* För företag */}
        <div className="anim-up mt-9 rounded-3xl border border-white/10 p-6 bg-brand-soft" style={{ animationDelay: "0.22s" }}>
          <h2 className="text-xl font-extrabold">Vill ditt företag vara med från start?</h2>
          <p className="mt-2 text-sm text-mute">
            Vi letar efter de första arbetsgivarna som vill lägga upp jobb gratis och nå unga i sitt
            område. Hör av dig eller kom igång direkt.
          </p>
          <Link
            href="/foretag"
            className="bg-brand mt-4 inline-flex w-full items-center justify-center rounded-2xl px-6 py-4 font-bold text-white shadow-xl shadow-rose/25 transition hover:brightness-110 active:scale-[0.98]"
          >
            Lägg upp en möjlighet gratis →
          </Link>
        </div>

        {/* Kontakt */}
        <div className="anim-up mt-8 text-center text-sm text-mute" style={{ animationDelay: "0.28s" }}>
          <p>Frågor, idéer eller vill du samarbeta?</p>
          <a href="mailto:olle.henry.andersson@icloud.com" className="mt-1 inline-block font-semibold text-text underline-offset-4 hover:underline">
            olle.henry.andersson@icloud.com
          </a>
        </div>
      </div>
    </main>
  );
}
