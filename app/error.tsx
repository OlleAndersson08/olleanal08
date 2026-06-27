"use client";

/* Branded felskärm – istället för en vit kraschsida om något går fel. */
export default function Fel({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-[100svh] flex-1 flex-col items-center justify-center bg-bg px-8 text-center">
      <span className="text-5xl">😅</span>
      <h1 className="mt-4 text-2xl font-extrabold">Oj, något gick fel</h1>
      <p className="mt-2 text-mute">Ladda om så löser det sig oftast.</p>
      <button
        type="button"
        onClick={reset}
        className="bg-brand mt-6 rounded-2xl px-6 py-4 font-bold text-white transition hover:brightness-110"
      >
        Försök igen
      </button>
    </main>
  );
}
