import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { CTA } from "./data";

export default function FooterCta() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0B5A58]">
      <Image
        src="/images/footer/fbg.png"
        alt=""
        fill
        sizes="(min-width: 1440px) 1340px, 100vw"
        className="object-cover object-right"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#0B5A58] via-[#0B5A58]/90 to-[#0B5A58]/0"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-6 px-6 py-8 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-[26px] lg:py-[34px]">
        <h2 className="text-[30px] font-extrabold leading-[1.1] text-white sm:text-[36px]">
          {CTA.title}
          <span className="block text-[#FFD315]">{CTA.highlight}</span>
        </h2>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-start lg:pr-[40px]">
          <Link
            href={CTA.primary.href}
            className="inline-flex items-center justify-between gap-5 rounded-full bg-[#FFD315] py-2 pl-5 pr-2 text-sm font-bold text-[#091822] transition-opacity hover:opacity-90"
          >
            {CTA.primary.label}
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </Link>
          <Link
            href={CTA.secondary.href}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/70 bg-black/20 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-black/30"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {CTA.secondary.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
