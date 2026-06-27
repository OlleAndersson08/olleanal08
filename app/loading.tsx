/* Visas medan en sida laddar – istället för en tom skärm. */
export default function Laddar() {
  return (
    <main className="flex min-h-[100svh] flex-1 items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <span className="bg-brand-anim flex h-12 w-12 items-center justify-center rounded-2xl text-2xl">
          ☀
        </span>
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/15 border-t-rose" />
      </div>
    </main>
  );
}
