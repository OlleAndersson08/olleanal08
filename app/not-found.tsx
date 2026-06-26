import Link from "next/link";

export default function IckeFunnen() {
  return (
    <main className="relative flex min-h-[100svh] flex-1 flex-col items-center justify-center overflow-hidden bg-bg px-8 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="anim-float absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-rose/25 blur-[90px]" />
      </div>
      <div className="relative">
        <p className="text-brand-anim text-7xl font-extrabold">404</p>
        <h1 className="mt-4 text-2xl font-extrabold">Den här sidan finns inte</h1>
        <p className="mt-2 text-mute">Men det gör massor av jobb och gig. 🔥</p>
        <div className="mt-7 flex flex-col gap-3">
          <Link href="/jobb" className="bg-brand rounded-2xl px-6 py-4 font-bold text-white transition hover:brightness-110">
            Till jobbflödet →
          </Link>
          <Link href="/" className="glas rounded-2xl px-6 py-4 font-semibold transition hover:bg-white/10">
            Till startsidan
          </Link>
        </div>
      </div>
    </main>
  );
}
