"use client";
import { useState, useEffect } from "react";
import { BuyPlanModal } from "./BuyPlanModal";
import { EnquiryModal } from "./EnquiryModal";
import type { Plan } from "./BuyPlanModal";

// ── Types ──────────────────────────────────────────────────────────────────────

interface SingleCatPlansSectionProps {
  /** Category slug, e.g. "prepaid-plans" */
  cat: string;
  heading?: string;
  subHeading?: string;
}

// ── Feature Icon ──────────────────────────────────────────────────────────────

/** Renders a small cyan outline icon representative of each feature row */
const DataIcon = () => (
  <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="2" width="16" height="6" rx="1" stroke="#1d6c5c" strokeWidth="1.8" />
    <rect x="4" y="9" width="16" height="8" rx="1" stroke="#1d6c5c" strokeWidth="1.8" />
    <rect x="4" y="18" width="16" height="3" rx="1" stroke="#1d6c5c" strokeWidth="1.8" />
  </svg>
);
const HotspotIcon = () => (
  <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="6" width="20" height="13" rx="2" stroke="#1d6c5c" strokeWidth="1.8" />
  </svg>
);
const PhoneIcon = () => (
  <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="2" width="16" height="20" rx="2" stroke="#1d6c5c" strokeWidth="1.8" />
  </svg>
);
const GlobeIcon = () => (
  <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#1d6c5c" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="9" stroke="#1d6c5c" strokeWidth="1.8" />
  </svg>
);

const featureIcons = [DataIcon, HotspotIcon, PhoneIcon, GlobeIcon];

// ── Plan Card (Figma vertical style) ──────────────────────────────────────────

const PlanCard = ({
  plan,
  onBuy,
  onEnquire,
}: {
  plan: Plan;
  onBuy: (plan: Plan) => void;
  onEnquire: (plan: Plan) => void;
}) => {
  return (
    <div className="flex-1 min-w-[220px] flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-[#c8e3de] shadow-[0px_6px_18px_-12px_rgba(16,38,59,0.35)] overflow-hidden">
      {/* Card header */}
      <div className="px-5 pt-5 pb-0 flex flex-col">
        {/* Plan name */}
        <p className="text-[#0f2133] dark:text-white text-2xl font-extrabold leading-7 tracking-tight">
          {plan.name}
        </p>
        {/* Subtitle */}
        {plan.short_description && (
          <p className="mt-0.5 text-[#4a6a7a] dark:text-gray-400 text-base font-normal leading-7">
            {plan.short_description}
          </p>
        )}
        {/* Price */}
        <div className="mt-2.5 flex items-baseline gap-1">
          {plan.final_price > 0 ? (
            <>
              <span className="text-[#0f2133] dark:text-white text-5xl font-extrabold leading-[48px]">
                ${plan.final_price % 1 === 0 ? plan.final_price.toFixed(0) : plan.final_price}
              </span>
              <span className="text-[#4a6a7a] dark:text-gray-400 text-xl font-normal leading-8">/mo</span>
            </>
          ) : (
            <span className="text-[#1d6c5c] text-2xl font-extrabold leading-9">Contact for pricing</span>
          )}
        </div>
        {/* Fees link */}
        <div className="mt-1 mb-3">
          <span className="text-[#1d6c5c] text-base font-normal underline leading-6 cursor-pointer">
            Fees &amp; renewal details
          </span>
        </div>
      </div>

      {/* Features list */}
      <div className="px-5 pt-3 pb-4 border-t border-[#c8e3de] flex flex-col flex-1">
        {plan.features.slice(0, 4).map((f, idx) => {
          const Icon = featureIcons[idx] ?? GlobeIcon;
          return (
            <div
              key={f.id}
              className={`flex items-start gap-3 py-2.5 ${
                idx < Math.min(plan.features.length, 4) - 1 ? "border-b border-[#e5eeec]" : ""
              }`}
            >
              <Icon />
              <span className="text-[#0f2133] dark:text-gray-200 text-base font-normal leading-5">
                {f.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="px-5 pt-5 pb-4 mt-auto flex flex-col gap-2">
        <button
          onClick={() => (plan.final_price === 0 ? onEnquire(plan) : onBuy(plan))}
          className="w-full min-h-12 py-2 bg-[#1d6c5c] hover:bg-[#155a4c] dark:bg-[#37C4A0] dark:text-gray-900 text-white text-xl font-bold leading-8 rounded-[10px] transition-colors duration-200 text-center"
        >
          {plan.final_price === 0 ? "Enquire Plan" : `Choose ${plan.name.replace("DriverX", "").trim()}`}
        </button>
        {/* Plan details links */}
        <div className="flex items-center justify-center gap-3.5 pt-1">
          <span className="text-[#1d6c5c] text-base font-normal underline leading-6 cursor-pointer">Plan details</span>
          <span className="text-[#aac8d3] text-base font-normal leading-6">|</span>
          <span className="text-[#1d6c5c] text-base font-normal underline leading-6 cursor-pointer">Broadband label</span>
        </div>
      </div>

      {/* Popular badge */}
      {plan.is_popular && (
        <div className="px-5 pb-3">
          <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

export default function SingleCatPlansSection({
  cat,
  heading,
  subHeading,
}: SingleCatPlansSectionProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enquiryPlan, setEnquiryPlan] = useState<Plan | null>(null);
  const [buyPlan, setBuyPlan] = useState<Plan | null>(null);

  useEffect(() => {
    if (!cat) return;
    setLoading(true);
    setError(null);

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/plans/v1/category/${cat}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch plans");
        return res.json();
      })
      .then((data: Plan[]) => {
        setPlans(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [cat]);

  const sortedPlans = plans
    .filter((p) => p.is_active)
    .sort((a, b) => {
      // Push $0 / enquire plans to the bottom
      if (a.final_price === 0 && b.final_price !== 0) return 1;
      if (a.final_price !== 0 && b.final_price === 0) return -1;
      return a.final_price - b.final_price;
    });

  return (
    <>
      {/* Optional heading block */}
      {(heading || subHeading) && (
        <div className="text-center mb-10">
          {heading && (
            <h2 className="text-2xl sm:text-3xl font-extrabold dark:text-white text-gray-900 mb-2">
              {heading}
            </h2>
          )}
          {subHeading && (
            <p className="text-gray-500 text-sm sm:text-base dark:text-gray-400">{subHeading}</p>
          )}
        </div>
      )}

      {/* States */}
      {loading && (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 border-4 border-[#1d6c5c] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-center py-16 text-red-500 font-medium">{error}</div>
      )}

      {!loading && !error && (
        <div className="flex gap-5 flex-wrap md:flex-nowrap">
          {sortedPlans.length === 0 ? (
            <p className="text-center text-gray-400 py-16 w-full">
              No plans available in this category.
            </p>
          ) : (
            sortedPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onBuy={setBuyPlan}
                onEnquire={setEnquiryPlan}
              />
            ))
          )}
        </div>
      )}

      {/* Modals */}
      {buyPlan && <BuyPlanModal plan={buyPlan} onClose={() => setBuyPlan(null)} />}
      {enquiryPlan && <EnquiryModal plan={enquiryPlan} onClose={() => setEnquiryPlan(null)} />}
    </>
  );
}