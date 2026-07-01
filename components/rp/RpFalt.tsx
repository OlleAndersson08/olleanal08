import type { InputHTMLAttributes } from "react";

/*
  RpFalt = inmatningsfält för ResellPilot (ljust tema), motsvarar
  components/Falt.tsx men med ljus bakgrund och emerald-accent.
*/

type Props = InputHTMLAttributes<HTMLInputElement> & {
  etikett: string;
};

export default function RpFalt({ etikett, ...rest }: Props) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{etikett}</span>
      <input
        {...rest}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
      />
    </label>
  );
}
