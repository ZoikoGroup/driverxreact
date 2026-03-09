"use client";
import { useState, useEffect } from "react";

interface Feature {
  id: number;
  title: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Plan {
  id: number;
  name: string;
  bqPlanID: string;
  slug: string;
  short_description: string;
  price: string;
  sale_price: string | null;
  price_24: string | null;
  final_price: number;
  duration_days: number;
  is_popular: boolean;
  is_active: boolean;
  category: Category;
  features: Feature[];
}

const CATEGORY_TABS = [
  { label: "Prepaid Plans", slug: "prepaid-plans" },
  { label: "Postpaid Plans", slug: "postpaid-plans" },
  { label: "Data-Only Plans", slug: "data-only-plans" },
  { label: "Business Plans", slug: "business-plans" },
];

const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-[#1a7a6a] flex-shrink-0 mt-0.5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <circle cx="10" cy="10" r="10" className="fill-[#e6f4f1]" />
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z"
      clipRule="evenodd"
      className="fill-[#1a7a6a]"
    />
  </svg>
);

const PlanCard = ({ plan }: { plan: Plan }) => {
  const mid = Math.ceil(plan.features.length / 2);
  const leftFeatures = plan.features.slice(0, mid);
  const rightFeatures = plan.features.slice(mid);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Left: Plan Info */}
        <div className="flex-1 p-6">
          <div className="inline-block bg-[#1a4a3f] text-white text-sm font-bold px-4 py-2 rounded-lg mb-3">
            {plan.name}
          </div>
          {plan.short_description && (
            <p className="text-gray-600 text-sm font-medium mb-4">
              {plan.short_description}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            <div className="space-y-2">
              {leftFeatures.map((f) => (
                <div key={f.id} className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-gray-700 text-sm">{f.title}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {rightFeatures.map((f) => (
                <div key={f.id} className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-gray-700 text-sm">{f.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-gray-200 my-6" />

        {/* Right: Price + CTA */}
        <div className="md:w-48 flex flex-col items-center justify-center p-6 gap-4">
          {plan.final_price > 0 ? (
            <div className="text-center">
              <span className="text-4xl font-extrabold text-gray-900">
                ${plan.final_price % 1 === 0 ? plan.final_price.toFixed(0) : plan.final_price}
              </span>
              <span className="text-gray-500 text-sm font-medium"> /mo</span>
            </div>
          ) : (
            <div className="text-center">
              <span className="text-lg font-bold text-gray-700">Custom</span>
            </div>
          )}
          <button className="w-full bg-[#1a8a76] hover:bg-[#157a68] text-white font-semibold py-2.5 px-6 rounded-full transition-colors duration-200 text-sm">
            Buy plan
          </button>
          {plan.is_popular && (
            <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-3 py-1 rounded-full">
              Most Popular
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function PlansSection() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("prepaid-plans");

  useEffect(() => {
    fetch("https://api.driverxmobile.com/api/plans/v1/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch plans");
        return res.json();
      })
      .then((data) => {
        setPlans(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredPlans = plans.filter(
    (p) => p.category?.slug === activeTab && p.is_active
  );

  // Only show tabs that have plans
  const availableTabs = CATEGORY_TABS.filter((tab) =>
    plans.some((p) => p.category?.slug === tab.slug && p.is_active)
  );

  return (
    <section className="bg-[#f5f7f6] min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Choose a Plan that's right for you
          </h2>
          <p className="text-gray-500 text-base">
            Choose plan that works best for you, feel free to contact us
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white border border-gray-200 rounded-full p-1 flex flex-wrap gap-1 shadow-sm">
            {availableTabs.map((tab) => (
              <button
                key={tab.slug}
                onClick={() => setActiveTab(tab.slug)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.slug
                    ? "bg-[#1a4a3f] text-white shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-[#1a8a76] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-16 text-red-500 font-medium">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {filteredPlans.length === 0 ? (
              <p className="text-center text-gray-400 py-16">
                No plans available in this category.
              </p>
            ) : (
              filteredPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}