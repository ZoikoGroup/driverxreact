"use client";

import { useState } from "react";
import { FONT_DISPLAY, WDTH } from "./fonts";
import { PlanCard } from "./PlanCard";
import {
  BILLING_PERIODS,
  PLANS_BY_TAB,
  PLAN_TABS,
  type BillingPeriodId,
  type PlanTabId,
} from "./pricing-data";
import { Container } from "./shared";

export function Pricing() {
  const [tab, setTab] = useState<PlanTabId>("prepaid");
  const [billing, setBilling] = useState<BillingPeriodId>("monthly");
  const [showOffer, setShowOffer] = useState(true);

  const plans = PLANS_BY_TAB[tab];
  const gridColumns =
    plans.length === 3
      ? "xl:grid-cols-[repeat(3,minmax(0,285px))] xl:justify-center"
      : "xl:grid-cols-4";

  return (
    <section
      id="plans"
      aria-labelledby="plans-title"
      className="py-14 lg:py-[72px]"
    >
      <Container>
        <div className="flex flex-col gap-[19.8px]">
          <div className="flex flex-wrap items-center gap-x-[22px] gap-y-4 border-b border-white/10 pb-5">
            <h2
              id="plans-title"
              className={`${FONT_DISPLAY} ${WDTH[108]} text-[30px] font-extrabold leading-[38.64px] tracking-[-0.368px] text-[#edf2f5] sm:text-[36.8px]`}
            >
              Driver plans
            </h2>

            <div
              role="tablist"
              aria-label="Plan type"
              className="flex flex-wrap gap-2"
            >
              {PLAN_TABS.map((item) => {
                const selected = item.id === tab;
                return (
                  <button
                    key={item.id}
                    id={`tab-${item.id}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="plans-panel"
                    onClick={() => setTab(item.id)}
                    className={`rounded-full border px-[18px] py-[8.5px] text-[15px] font-bold leading-[23.31px] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fcd018] ${
                      selected
                        ? "border-[#fcd018] bg-[#fcd018] text-[#0c1a2b]"
                        : "border-white/[0.14] bg-[#12253a] text-[#edf2f5] hover:border-white/30"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-[15.99px] xl:ml-auto">
              <div
                role="group"
                aria-label="Billing period"
                className="flex rounded-full border border-white/[0.14] bg-[#12253a] p-1"
              >
                {BILLING_PERIODS.map((item) => {
                  const selected = item.id === billing;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setBilling(item.id)}
                      className={`rounded-full px-4 py-2 text-[14.7px] font-bold leading-[22.82px] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fcd018] ${
                        selected
                          ? "bg-white text-[#0c1a2b]"
                          : "text-[#a9bac6] hover:text-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-[10px] py-1">
                <button
                  type="button"
                  role="switch"
                  aria-checked={showOffer}
                  aria-label="Show proposed 35% offer"
                  onClick={() => setShowOffer((value) => !value)}
                  className={`flex h-6 w-[42px] shrink-0 items-center rounded-full border p-[2px] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fcd018] ${
                    showOffer
                      ? "justify-end border-[#338a83] bg-[#1e5b55]"
                      : "justify-start border-white/[0.14] bg-[#12253a]"
                  }`}
                >
                  <span
                    className={`block h-[18px] w-[18px] rounded-full transition-colors duration-150 ${
                      showOffer ? "bg-[#fcd018]" : "bg-[#56677a]"
                    }`}
                  />
                </button>
                <span className="text-[14.4px] font-semibold leading-[22.32px] text-[#a9bac6]">
                  Proposed offer
                </span>
              </div>
            </div>
          </div>

          <div
            id="plans-panel"
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
            className={`grid items-start gap-5 pt-[7.2px] sm:grid-cols-2 ${gridColumns}`}
          >
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} showOffer={showOffer} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
