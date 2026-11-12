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
  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#1d6c5c]" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="2" width="16" height="6" rx="1" stroke="#1d6c5c" strokeWidth="1.8" />
    <rect x="4" y="9" width="16" height="8" rx="1" stroke="#1d6c5c" strokeWidth="1.8" />
    <rect x="4" y="18" width="16" height="3" rx="1" stroke="#1d6c5c" strokeWidth="1.8" />
  </svg>
);
const HotspotIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#1d6c5c]" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="6" width="20" height="13" rx="2" stroke="#1d6c5c" strokeWidth="1.8" />
  </svg>
);
const PhoneIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#1d6c5c]" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="2" width="16" height="20" rx="2" stroke="#1d6c5c" strokeWidth="1.8" />
  </svg>
);
const GlobeIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#1d6c5c]" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#1d6c5c" strokeWidth="1.8" />
    <path d="M3.6 9h16.8M3.6 15h16.8" stroke="#1d6c5c" strokeWidth="1.8" />
  </svg>
);

const featureIcons = [DataIcon, HotspotIcon, PhoneIcon, GlobeIcon];

// ── Plan Card (Uniform Figma style across all tabs) ─────────────────────────────

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
    <div className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] lg:max-w-[305px] min-h-[580px] flex flex-col justify-between bg-white dark:bg-gray-800 rounded-2xl border border-[#c8e3de] p-5 shadow-[0px_6px_18px_-12px_rgba(16,38,59,0.35)] hover:shadow-md transition-shadow duration-200">
      {/* Card header */}
      <div className="flex flex-col">
        {/* Plan name */}
        <p className="text-[#0f2133] dark:text-white text-2xl font-extrabold leading-7 tracking-tight min-h-[32px]">
          {plan.name}
        </p>
        {/* Subtitle */}
        <p className="mt-1 text-[#4a6a7a] dark:text-gray-400 text-sm font-normal leading-5 min-h-[40px] flex items-center">
          {plan.short_description || "High-speed reliable connectivity for drivers."}
        </p>
        {/* Price */}
        <div className="pt-2 flex items-baseline gap-1 h-12">
          {plan.final_price > 0 ? (
            <>
              <span className="text-[#0f2133] dark:text-white text-5xl font-extrabold leading-[48px]">
                ${plan.final_price % 1 === 0 ? plan.final_price.toFixed(0) : plan.final_price}
              </span>
              <span className="text-[#4a6a7a] dark:text-gray-400 text-base font-normal leading-7">/mo</span>
            </>
          ) : (
            <span className="text-[#1d6c5c] text-2xl font-extrabold leading-9">Contact for pricing</span>
          )}
        </div>
        {/* Fees link */}
        <div className="pt-1 pb-1 h-7 flex items-center">
          <span className="text-[#1d6c5c] text-sm font-normal underline leading-6 cursor-pointer hover:text-[#155a4c]">
            Fees &amp; renewal details
          </span>
        </div>
      </div>

      {/* Features list */}
      <div className="pt-3 pb-4 border-t border-[#c8e3de] flex flex-col flex-1">
        {plan.features.slice(0, 4).map((f, idx) => {
          const Icon = featureIcons[idx] ?? GlobeIcon;
          return (
            <div
              key={f.id}
              className={`flex items-start gap-3 py-2.5 min-h-[44px] ${
                idx < Math.min(plan.features.length, 4) - 1 ? "border-b border-[#e5eeec] dark:border-gray-700" : ""
              }`}
            >
              <Icon />
              <span className="text-[#0f2133] dark:text-gray-200 text-sm font-normal leading-5">
                {f.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={() => (plan.final_price === 0 ? onEnquire(plan) : onBuy(plan))}
          className="w-full min-h-12 py-2 bg-[#1d6c5c] hover:bg-[#155a4c] dark:bg-[#37C4A0] dark:text-gray-900 text-white text-xl font-bold leading-8 rounded-[10px] transition-colors duration-200 text-center cursor-pointer shadow-sm"
        >
          {plan.final_price === 0 ? "Enquire Plan" : `Choose ${plan.name.replace("DriverX", "").trim()}`}
        </button>
        {/* Plan details links */}
        <div className="flex items-center justify-center gap-3.5 pt-1">
          <span className="text-[#1d6c5c] text-sm font-normal underline leading-6 cursor-pointer hover:text-[#155a4c]">
            Plan details
          </span>
          <span className="text-[#aac8d3] text-sm font-normal leading-6">|</span>
          <span className="text-[#1d6c5c] text-sm font-normal underline leading-6 cursor-pointer hover:text-[#155a4c]">
            Broadband label
          </span>
        </div>
      </div>

      {/* Popular badge */}
      {plan.is_popular && (
        <div className="pt-2 text-center">
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

  // Sort plans by price ascending; for postpaid, exclude the $0/Enterprise plan as it has a dedicated band below
  const sortedPlans = plans
    .filter((p) => p.is_active)
    .filter((p) => cat !== "postpaid-plans" || (p.final_price > 0 && !p.name.toLowerCase().includes("enterprise")))
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
            <h2 className="text-[#0f2133] dark:text-white text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight mb-2">
              {heading}
            </h2>
          )}
          {subHeading && (
            <p className="text-[#4a6a7a] dark:text-gray-400 text-sm sm:text-base font-normal mt-1 leading-6">{subHeading}</p>
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
        <div className="flex gap-5 flex-wrap justify-center items-stretch">
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