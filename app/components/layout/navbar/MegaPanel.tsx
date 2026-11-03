import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  X,
} from "lucide-react";
import type { Dropdown } from "./data";

type Props = {
  item: Dropdown;
  id: string;
  onClose: () => void;
};

export default function MegaPanel({ item, id, onClose }: Props) {
  const HeaderIcon = item.headerIcon;

  return (
    <div
      id={id}
      role="region"
      aria-label={`${item.label} menu`}
      className="mx-auto w-full max-w-[1296px] rounded-3xl bg-white shadow-[0_24px_60px_rgba(16,38,59,0.18)]"
    >
      <div className="grid grid-cols-[1fr_300px] gap-6 px-8 pb-6 pt-6">
        <div>
          <div className="flex items-start gap-4 border-b border-[#E3E9EC] pb-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF5F3] text-[#2A736D]">
              <HeaderIcon className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#2A736D]">
                {item.eyebrow}
              </p>
              <h2 className="text-[27px] font-bold leading-tight text-[#10263B]">
                {item.title}
              </h2>
              <p className="mt-1 text-[15px] text-[#4B6070]">{item.subtitle}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-6">
            {item.groups.map((g) => (
              <div key={g.heading}>
                <p className="flex items-center gap-2 text-sm font-bold text-[#10263B]">
                  <span
                    className="block h-2.5 w-2.5 rounded-full bg-[#FCD018]"
                    aria-hidden="true"
                  />
                  {g.heading}
                </p>
                <ul className="mt-4 flex flex-col gap-4">
                  {g.links.map((l) => {
                    const Icon = l.icon;
                    return (
                      <li key={l.title}>
                        <Link
                          href={l.href}
                          onClick={onClose}
                          className="group flex items-start gap-3 rounded-lg p-1 transition-colors hover:bg-[#F3F8F7]"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EAF5F3] text-[#2A736D]">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <span className="flex-1">
                            <span className="block text-sm font-bold text-[#10263B]">
                              {l.title}
                            </span>
                            <span className="mt-0.5 block text-[13px] leading-snug text-[#4B6070]">
                              {l.text}
                            </span>
                          </span>
                          <ChevronRight
                            className="mt-2 h-4 w-4 shrink-0 text-[#2A736D]"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#E3E9EC] pt-4 text-[13px] text-[#4B6070]">
            <ShieldCheck
              className="h-4 w-4 text-[#2A736D]"
              aria-hidden="true"
            />
            <span>{item.note}</span>
            <Link
              href={item.noteLink.href}
              onClick={onClose}
              className="inline-flex items-center gap-1 font-bold text-[#2A736D] hover:underline"
            >
              {item.noteLink.label}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="relative flex flex-col overflow-hidden rounded-2xl bg-[#1E5A55] p-5 text-white">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="absolute -right-0 top-0 hidden"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="text-sm font-bold text-[#FCD018]">
            {item.card.eyebrow}
          </p>
          <h3 className="mt-3 text-[26px] font-extrabold leading-[1.1]">
            {item.card.title}
          </h3>
          <span
            className="mt-3 block h-[3px] w-12 bg-[#FCD018]"
            aria-hidden="true"
          />
          <p className="mt-3 text-sm leading-snug text-white/85">
            {item.card.text}
          </p>

          <div className="relative mt-4 h-[130px] overflow-hidden rounded-xl">
            <Image
              src={item.card.image}
              alt={item.card.imageAlt}
              fill
              sizes="260px"
              className="object-cover"
            />
          </div>

          <Link
            href={item.card.href}
            onClick={onClose}
            className="relative z-10 mt-4 flex items-center justify-between rounded-full bg-[#FCD018] py-2 pl-5 pr-2 text-sm font-bold text-[#10263B] transition-opacity hover:opacity-90"
          >
            {item.card.cta}
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </Link>

          <span
            className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rotate-45 bg-[#FCD018]/90"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
