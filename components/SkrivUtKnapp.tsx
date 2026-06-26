"use client";

/* Öppnar webbläsarens utskriftsdialog. */
export default function SkrivUtKnapp() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-bold text-white hover:bg-zinc-700"
    >
      🖨 Skriv ut
    </button>
  );
}
