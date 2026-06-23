import type { InputHTMLAttributes } from "react";

/*
  Falt = ett återanvändbart inmatningsfält med etikett och valfri ikon.
  Används i registrering, inloggning och senare i formulär.
*/

type Props = InputHTMLAttributes<HTMLInputElement> & {
  etikett: string;
  ikon?: string;
};

export default function Falt({ etikett, ikon, ...rest }: Props) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-bleck">
        {etikett}
      </span>
      <span className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3.5 transition focus-within:border-sol focus-within:ring-2 focus-within:ring-sol/30">
        {ikon && <span className="text-dis">{ikon}</span>}
        <input
          {...rest}
          className="w-full bg-transparent text-bleck outline-none placeholder:text-dis"
        />
      </span>
    </label>
  );
}
