import type { InputHTMLAttributes } from "react";

/*
  Falt = återanvändbart inmatningsfält (mörkt tema) med etikett och valfri ikon.
*/

type Props = InputHTMLAttributes<HTMLInputElement> & {
  etikett: string;
  ikon?: string;
};

export default function Falt({ etikett, ikon, ...rest }: Props) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-text">
        {etikett}
      </span>
      <span className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 transition focus-within:border-rose/60 focus-within:bg-white/[0.07] focus-within:ring-2 focus-within:ring-rose/25">
        {ikon && <span className="opacity-70">{ikon}</span>}
        <input
          {...rest}
          className="w-full bg-transparent text-text outline-none placeholder:text-mute"
        />
      </span>
    </label>
  );
}
