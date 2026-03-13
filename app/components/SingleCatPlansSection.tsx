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

// ── CheckIcon ─────────────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg className="w-5 h-5 text-[#1a7a6a] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
    <circle cx="10" cy="10" r="10" className="fill-[#e6f4f1]" />
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z"
      clipRule="evenodd"
      className="fill-[#1a7a6a]"
    />
  </svg>
);

// ── Plan Card ─────────────────────────────────────────────────────────────────

const PlanCard = ({
  plan,
  onBuy,
  onEnquire,
}: {
  plan: Plan;
  onBuy: (plan: Plan) => void;
  onEnquire: (plan: Plan) => void;
}) => {
  const mid = Math.ceil(plan.features.length / 2);
  const leftFeatures = plan.features.slice(0, mid);
  const rightFeatures = plan.features.slice(mid);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden w-full">
      <div className="flex flex-col md:flex-row">
        {/* Left: name + features */}
        <div className="flex flex-col w-full md:w-3/4">
          <div className="flex flex-col sm:flex-row sm:items-center pt-5 pb-4 gap-2 sm:gap-5">
            <div className="self-start flex-shrink-0 dark:bg-[#37C4A0] bg-[#1a4a3f] dark:text-gray-800 text-white text-base sm:text-[1.2rem] font-bold py-2.5 whitespace-nowrap mx-4 px-5 rounded-full sm:mx-0 sm:pl-5 sm:pr-8 sm:px-0 sm:rounded-none sm:rounded-r-full">
              {plan.name}
            </div>
            {plan.short_description && (
              <p className="text-gray-800 dark:text-gray-300 text-sm sm:text-[1.2rem] font-semibold leading-snug px-4 sm:px-0 sm:pr-4">
                {plan.short_description}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 px-4 sm:px-5 pb-6">
            <div className="space-y-2.5">
              {leftFeatures.map((f) => (
                <div key={f.id} className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-[1rem] leading-snug">{f.title}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2.5">
              {rightFeatures.map((f) => (
                <div key={f.id} className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-[1rem] leading-snug">{f.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px md:h-auto md:w-px bg-gray-200 mx-4 md:mx-0 md:my-5 flex-shrink-0" />

        {/* Right: price + CTA */}
        <div className="flex flex-row items-center justify-center gap-3 px-5 py-5 md:py-0 md:w-1/4 flex-wrap">
          {plan.final_price > 0 && (
            <div className="flex items-baseline whitespace-nowrap">
              <span className="text-3xl font-extrabold dark:text-gray-300 text-gray-900 tracking-tight">
                ${plan.final_price % 1 === 0 ? plan.final_price.toFixed(0) : plan.final_price}
              </span>
              <span className="text-gray-400 dark:text-gray-300 text-sm font-medium ml-1">/mo</span>
            </div>
          )}

          <button
            onClick={() => (plan.final_price === 0 ? onEnquire(plan) : onBuy(plan))}
            className={`font-semibold py-2.5 px-5 rounded-full transition-colors duration-200 text-sm whitespace-nowrap ${
              plan.final_price === 0
                ? "bg-white dark:bg-gray-600 border-2 border-[#1a8a76] text-[#1a8a76] dark:text-white hover:bg-[#f0faf8]"
                : "bg-[#1a8a76] dark:bg-[#37C4A0] hover:bg-[#157a68] dark:text-gray-900 text-white"
            }`}
          >
            {plan.final_price === 0 ? "Enquire Plan" : "Buy Plan"}
          </button>

          {plan.is_popular && (
            <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-3 py-1 rounded-full whitespace-nowrap">
              Most Popular
            </span>
          )}
        </div>
      </div>
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
    <section className="bg-[#f5f7f6] dark:bg-gray-800 min-h-screen py-16 px-4 overflow-x-hidden w-full">
      <div className="max-w-6xl xl:max-w-6xl lg:max-w-4xl mx-auto w-full overflow-hidden">

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
            <div className="w-10 h-10 border-4 border-[#1a8a76] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-16 text-red-500 font-medium">{error}</div>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {sortedPlans.length === 0 ? (
              <p className="text-center text-gray-400 py-16">
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
      </div>

      {/* Modals */}
      {buyPlan && <BuyPlanModal plan={buyPlan} onClose={() => setBuyPlan(null)} />}
      {enquiryPlan && <EnquiryModal plan={enquiryPlan} onClose={() => setEnquiryPlan(null)} />}
    </section>
  );
}