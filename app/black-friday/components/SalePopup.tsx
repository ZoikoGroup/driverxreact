"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type MouseEvent } from "react";
import { FONT_DISPLAY, WDTH, fontVariables } from "./fonts";
import { ArrowRightIcon, SignalIcon } from "./icons";

const DATES = [
  { label: "Black Friday", value: "27 Nov 2026" },
  { label: "Cyber Monday", value: "30 Nov 2026" },
] as const;

export function SalePopup() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Opens on every full page load (first visit, reload, new tab).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const unlockScroll = () => {
      root.style.overflow = previousOverflow;
    };

    if (!dialog.open) dialog.showModal();
    root.style.overflow = "hidden";
    dialog.addEventListener("close", unlockScroll);

    return () => {
      dialog.removeEventListener("close", unlockScroll);
      unlockScroll();
      if (dialog.open) dialog.close();
    };
  }, []);

  const close = () => dialogRef.current?.close();

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) close();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="sale-popup-title"
      onClick={handleBackdropClick}
      className={`${fontVariables} m-auto max-h-[calc(100dvh-32px)] w-[min(721px,calc(100vw-32px))] max-w-none overflow-y-auto rounded-[20px] border border-white/10 bg-transparent p-0 font-[family-name:var(--font-public-sans)] text-[#edf2f5] shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop:bg-[#050d18]/75 backdrop:backdrop-blur-[2px]`}
    >
      <div className="grid min-h-[507px] bg-[linear-gradient(160deg,#17314a_0%,#0f2236_100%)] sm:grid-cols-[42%_minmax(0,1fr)]">
        <div className="relative min-h-[190px] sm:min-h-0">
          <Image
            src="/images/sale/pop.png"
            alt="Driver with a hand on the steering wheel at sunset"
            fill
            priority
            sizes="(min-width: 640px) 303px, 100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-[75px] h-[3px] bg-[repeating-linear-gradient(90deg,#fcd018_0,#fcd018_30px,transparent_30px,transparent_58px)] max-sm:hidden"
          />
          <div className="absolute bottom-[13px] left-[15px] border-[3px] border-[#fcd018] bg-[#0c1a2b]/90 px-[10px] py-[6px]">
            <p
              className={`${FONT_DISPLAY} text-[14px] font-black italic leading-[18px] text-white`}
            >
              Black Friday
            </p>
            <p className="text-[11px] font-bold leading-[14px] text-[#fcd018]">
              27 &amp; 30 Nov 2026
            </p>
          </div>
        </div>

        <div className="flex flex-col px-6 pb-6 pt-7 sm:pl-[34px] sm:pr-9">
          <p className="inline-flex w-fit items-center gap-[6px] rounded-full bg-[#fcd018] px-[10px] py-[4px] text-[11px] font-bold leading-[15px] text-[#0c1a2b]">
            <SignalIcon className="h-[11px] w-[11px]" />
            DriverX Mobile Black Friday
          </p>

          <h2
            id="sale-popup-title"
            className={`${FONT_DISPLAY} ${WDTH[112]} mt-[22px] text-[34px] font-black italic leading-[1.02] tracking-[-0.4px] text-[#edf2f5] sm:text-[38px] sm:leading-[38px]`}
          >
            Built for your busiest routes.
          </h2>

          <p className="mt-4 text-[13px] leading-[19px] text-[#a9bac6]">
            Black Friday driver-plan savings from DriverX Mobile. Your next
            shift deserves a stronger connection.
          </p>

          <div className="mt-5 flex items-center gap-[14px] rounded-[10px] border-2 border-[#fcd018] bg-white p-[10px]">
            <p
              className={`${FONT_DISPLAY} flex shrink-0 items-baseline gap-1 rounded-[8px] bg-[#1e5b55] px-[14px] py-[9px] font-black italic text-white`}
            >
              <span className="text-[30px] leading-[34px]">35%</span>
              <span className="text-[10px] leading-3 text-[#fcd018]">off</span>
            </p>
            <div className="min-w-0">
              <p className="text-[12.5px] font-bold leading-[16px] text-[#13263a]">
                Eligible driver-plan charges for the first 3 months
              </p>
              <p className="mt-[3px] text-[11px] leading-[14px] text-[#56677a]">
                Driver plans from $16/mo, then the regular monthly price applies
              </p>
            </div>
          </div>

          <dl className="mt-[22px] grid grid-cols-2 gap-2">
            {DATES.map((date) => (
              <div
                key={date.label}
                className="rounded-[8px] border border-white/10 bg-[#0c1a2b]/60 px-[10px] py-[8px]"
              >
                <dt className="text-[10.5px] leading-[14px] text-[#a9bac6]">
                  {date.label}
                </dt>
                <dd className="mt-[2px] text-[14px] font-bold leading-[18px] text-white">
                  {date.value}
                </dd>
              </div>
            ))}
          </dl>

          <Link
            href="/black-friday"
            onClick={close}
            className="mt-5 flex items-center justify-between rounded-full bg-[#fcd018] py-[6px] pl-5 pr-[6px] text-[13px] font-bold leading-[20px] text-[#0c1a2b] transition-[filter] duration-150 hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Explore driver plans
            <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#0c1a2b] text-[#fcd018]">
              <ArrowRightIcon className="h-[14px] w-[14px]" />
            </span>
          </Link>

          <p className="mt-auto pt-6 text-[10.5px] leading-[15px] text-[#7f90a3]">
            Proposed offer for internal review; not an authorised public offer.
            Eligible new lines and plans only. Plus taxes and fees.
            Activation-fee waiver not offered. Exact offer window.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={close}
        aria-label="Close offer"
        className="absolute right-3 top-3 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#0c1a2b] text-white outline-2 outline-offset-2 outline-[#fcd018] focus-visible:outline"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-[14px] w-[14px]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
    </dialog>
  );
}
