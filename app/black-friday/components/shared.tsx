import Link from "next/link";
import type { ReactNode } from "react";
import { FONT_DISPLAY, WDTH } from "./fonts";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1248px] px-6 ${className}`}>
      {children}
    </div>
  );
}

export const SECTION_H2 = `${FONT_DISPLAY} ${WDTH[108]} text-[32px] font-extrabold leading-[1.1] tracking-[-0.432px] text-[#edf2f5] sm:text-[43.2px] sm:leading-[45.36px]`;

type SectionHeadProps = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
};

export function SectionHead({
  id,
  title,
  description,
  className = "",
}: SectionHeadProps) {
  return (
    <div className={`flex max-w-[680px] flex-col gap-[8.9px] ${className}`}>
      <h2 id={id} className={SECTION_H2}>
        {title}
      </h2>
      {description ? (
        <p className="max-w-[587.5px] text-base leading-[24.8px] text-[#a9bac6]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

const BUTTON_BASE =
  "inline-flex min-h-[46px] items-center justify-center rounded-full px-6 py-[13px] text-base font-bold leading-[19.2px] transition-[filter,background-color] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fcd018]";

const BUTTON_VARIANTS = {
  primary: "bg-[#fcd018] text-[#0c1a2b] hover:brightness-95",
  outline:
    "text-[#edf2f5] shadow-[inset_0_0_0_2px_rgba(255,255,255,0.28)] hover:bg-white/10",
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;

export function ButtonLink({
  href,
  variant = "primary",
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={`${BUTTON_BASE} ${BUTTON_VARIANTS[variant]}`}>
      {children}
    </Link>
  );
}
