"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { fontVariables } from "../../black-friday/components/fonts";
import styles from "./BlackFridayPopup.module.css";

// Campaign window (local time). Popup stops appearing once the sale is over.
const SALE_START = new Date("2026-11-27T00:00:00");
const SALE_END = new Date("2026-12-01T00:00:00");
const OPEN_DELAY_MS = 700;

const PLANS = [
  { name: "Starter 5", price: 16 },
  { name: "Cruise 15", price: 38 },
  { name: "Power 25", price: 57 },
  { name: "Unlimited", price: 70 },
] as const;

const TICKER = [
  "Black Friday · 27 Nov",
  "35% off driver plans",
  "Cyber Monday · 30 Nov",
  "First 3 months",
  "Plans from $16/mo",
];

type Countdown = { days: number; hours: number; minutes: number; seconds: number };

function getCountdown(now: number): Countdown | null {
  const diff = SALE_START.getTime() - now;
  if (diff <= 0) return null;
  const total = Math.floor(diff / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function BlackFridayPopup() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [now, setNow] = useState<number | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Open shortly after the home page loads (every visit), while the campaign runs.
  useEffect(() => {
    if (Date.now() >= SALE_END.getTime()) return;
    setNow(Date.now());
    const t = window.setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  // Live countdown tick.
  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [open]);

  const close = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 280);
  }, []);

  // Scroll lock, Escape to close, initial focus.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!open || now === null) return null;

  const countdown = getCountdown(now);

  return (
    <div
      className={`${fontVariables} ${styles.overlay} ${closing ? styles.overlayOut : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bf-popup-title"
        className={`${styles.card} ${closing ? styles.cardOut : ""}`}
      >
        {/* Scrolling promo ticker */}
        <div className={styles.ticker} aria-hidden>
          <div className={styles.tickerTrack}>
            {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((item, i) => (
              <span key={i} className={styles.tickerItem}>
                {item}
                <span className={styles.tickerStar}>✦</span>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.body}>
          {/* Visual side */}
          <div className={styles.visual}>
            <Image
              src="/images/sale/pop.png"
              alt="Driver with a hand on the steering wheel at sunset"
              fill
              priority
              sizes="(min-width: 720px) 320px, 100vw"
              className={styles.visualImg}
            />
            <div className={styles.visualShade} aria-hidden />
            <div className={styles.road} aria-hidden />

            <div className={styles.sticker} aria-hidden>
              <svg viewBox="0 0 120 120" className={styles.stickerRing}>
                <defs>
                  <path
                    id="bf-ring"
                    d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"
                  />
                </defs>
                <text>
                  <textPath href="#bf-ring">
                    BLACK FRIDAY • CYBER MONDAY • DRIVERX •
                  </textPath>
                </text>
              </svg>
              <div className={styles.stickerCore}>
                <span className={styles.stickerPct}>35%</span>
                <span className={styles.stickerOff}>OFF</span>
              </div>
            </div>

            <div className={styles.dateTag}>
              <span className={styles.dateTagTitle}>Black Friday</span>
              <span className={styles.dateTagDates}>27 &amp; 30 Nov 2026</span>
            </div>
          </div>

          {/* Content side */}
          <div className={styles.content}>
            <span className={styles.eyebrow}>
              <span className={styles.liveDot} />
              DriverX Mobile Black Friday
            </span>

            <h2 id="bf-popup-title" className={styles.title}>
              Built for your <br />
              <span className={styles.titleAccent}>busiest routes.</span>
            </h2>

            <p className={styles.lede}>
              <strong className={styles.bigOff}>35% off</strong> eligible
              driver-plan charges for the first 3 months. Your next shift
              deserves a stronger connection.
            </p>

            {/* Countdown */}
            <div className={styles.countdownWrap}>
              <span className={styles.countdownLabel}>
                {countdown ? "Deals go live in" : "The sale is live now"}
              </span>
              {countdown ? (
                <div className={styles.countdown} role="timer" aria-live="off">
                  {(
                    [
                      ["Days", countdown.days],
                      ["Hrs", countdown.hours],
                      ["Min", countdown.minutes],
                      ["Sec", countdown.seconds],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label} className={styles.unit}>
                      <span className={styles.unitValue}>{pad(value)}</span>
                      <span className={styles.unitLabel}>{label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.liveBanner}>
                  Ends Cyber Monday · 30 Nov 2026
                </div>
              )}
            </div>

            {/* Plans */}
            <ul className={styles.plans}>
              {PLANS.map((plan) => (
                <li key={plan.name} className={styles.plan}>
                  <span className={styles.planName}>{plan.name}</span>
                  <span className={styles.planPrice}>
                    ${plan.price}
                    <small>/mo</small>
                  </span>
                </li>
              ))}
            </ul>

            <Link href="/black-friday" onClick={close} className={styles.cta}>
              <span>Grab the Black Friday deal</span>
              <span className={styles.ctaArrow} aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </Link>

            <button type="button" onClick={close} className={styles.later}>
              Maybe later
            </button>

            <p className={styles.fine}>
              Eligible new lines and plans only. Regular monthly price applies
              after 3 months. Plus taxes and fees. Activation-fee waiver not
              offered.
            </p>
          </div>
        </div>

        <button
          ref={closeBtnRef}
          type="button"
          onClick={close}
          aria-label="Close offer"
          className={styles.close}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
