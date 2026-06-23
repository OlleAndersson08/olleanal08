import Link from "next/link";
import type { ReactNode } from "react";

/*
  Knapp = vår återanvändbara knapp (mörkt tema 2.0).
  - "sol": solnedgångs-gradient med ljussvep + glöd (huvud-CTA)
  - "glas": genomskinlig glasknapp
  - "spok": ren textknapp med kant
  Skickar man in "href" blir det en länk, annars en vanlig knapp.
*/

type Variant = "sol" | "glas" | "spok";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  type?: "button" | "submit";
  className?: string;
  glow?: boolean;
};

const bas =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-7 py-4 text-base font-bold transition active:scale-[0.97]";

const stilar: Record<Variant, string> = {
  sol: "bg-brand text-white shadow-xl shadow-rose/25 hover:brightness-110",
  glas: "glas text-text hover:bg-white/10",
  spok: "border border-white/15 text-text hover:bg-white/5",
};

export default function Knapp({
  children,
  href,
  onClick,
  variant = "sol",
  type = "button",
  className = "",
  glow = false,
}: Props) {
  const klasser = `${bas} ${stilar[variant]} ${glow ? "anim-glow" : ""} ${className}`;

  const innehall = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {/* Ljussvep som glider över vid hover (bara på sol-varianten) */}
      {variant === "sol" && (
        <span className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-2xl">
          <span className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/30 blur-md transition group-hover:[animation:shine_0.9s_ease]" />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={klasser}>
        {innehall}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={klasser}>
      {innehall}
    </button>
  );
}
