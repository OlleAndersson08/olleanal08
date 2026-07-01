import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primar" | "sekundar" | "spok";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
};

const bas =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100";

const stilar: Record<Variant, string> = {
  primar: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700",
  sekundar: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
  spok: "text-slate-500 hover:text-slate-800",
};

export default function RpKnapp({
  children,
  href,
  onClick,
  variant = "primar",
  type = "button",
  className = "",
  disabled = false,
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
    <button type={type} onClick={onClick} disabled={disabled} className={klasser}>
      {children}
    </button>
  );
}
