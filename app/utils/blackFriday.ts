/**
 * Black Friday / Cyber Monday campaign settings — single source of truth
 * for the checkout discount and the home-page popup.
 *
 * Dates are local time. The discount applies from SALE_START until SALE_END.
 */
export const BLACK_FRIDAY = {
  label: "Black Friday",
  percent: 35,
  start: new Date("2026-11-20T00:00:00"),
  end: new Date("2026-12-01T00:00:00"),
} as const;

export function isBlackFridayActive(now: Date = new Date()): boolean {
  const t = now.getTime();
  return t >= BLACK_FRIDAY.start.getTime() && t < BLACK_FRIDAY.end.getTime();
}

/** Black Friday discount (in dollars, rounded to cents) on a plan subtotal. */
export function blackFridayDiscountOn(planSubtotal: number): number {
  return Math.round(planSubtotal * BLACK_FRIDAY.percent) / 100;
}
