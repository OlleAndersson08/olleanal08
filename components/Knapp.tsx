import Link from "next/link";
import type { ReactNode } from "react";

/*
  Knapp = vår återanvändbara knapp.
  Vi bygger den EN gång här och använder den på hela sajten.
  - variant "sol": stor gul/orange huvudknapp
  - variant "mork": mörk knapp
  - variant "ghost": genomskinlig knapp med kant
  Om man skickar in "href" blir det en länk, annars en vanlig knapp.
*/

type Variant = "sol" | "mork" | "ghost";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  type?: "button" | "submit";
  className?: string;
};

const bas =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-semibold transition active:scale-[0.97] disabled:opacity-50";

const stilar: Record<Variant, string> = {
  sol: "bg-sol-gradient text-white shadow-lg shadow-orange-500/30 hover:brightness-105",
  mork: "bg-natt text-white hover:bg-natt-mjuk",
  ghost: "border border-black/10 bg-white/70 text-bleck hover:bg-white",
};

export default function Knapp({
  children,
  href,
  onClick,
  variant = "sol",
  type = "button",
  className = "",
}: Props) {
  const klasser = `${bas} ${stilar[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={klasser}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={klasser}>
      {children}
    </button>
  );
}
