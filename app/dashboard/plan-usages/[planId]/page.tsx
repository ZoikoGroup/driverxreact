"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import beQuick from "../../../utils/dasdbeQuickApi";
import "../../Dashboard.css";
import { FaMobileAlt, FaWifi, FaPhoneAlt, FaRegCommentDots } from "react-icons/fa";

// ---------- Types ----------
interface UsageBlock {
  used: string | number;
  remaining: string | number;
  total: string | number;
  pct: number;
  isData: boolean;
}

interface UsageState {
  usageBlocks: Record<string, UsageBlock>;
  autoRenew: boolean;
  usageAlerts: boolean;
  billingCycle: string;
}

interface UsageSummaryBlock {
  used?: string | number;
  remaining?: string | number;
}

interface PlanData {
  usage_summary?: {
    voice?: UsageSummaryBlock;
    international_voice?: UsageSummaryBlock;
    text?: UsageSummaryBlock;
    international_text?: UsageSummaryBlock;
    data?: UsageSummaryBlock;
    international_data?: UsageSummaryBlock;
  };
  service_period?: {
    start_at?: string;
    end_at?: string;
  };
}

// ---------- Helpers ----------
function convert(
  used: string | number | undefined,
  remaining: string | number | undefined,
  isData = false
): UsageBlock {
  let u = parseFloat(String(used || 0));
  let r = parseFloat(String(remaining || 0));

  if (isData) {
    u = u / (1024 * 1024);
    r = r / (1024 * 1024);
  }

  const total = u + r;
  return {
    used: isData ? u.toFixed(2) : Math.round(u),
    remaining: isData ? r.toFixed(2) : Math.round(r),
    total: isData ? total.toFixed(2) : Math.round(total),
    pct: total > 0 ? Math.round((u / total) * 100) : 0,
    isData,
  };
}

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ---------- Title & Icon maps ----------
const titleMap: Record<string, string> = {
  domestic_voice: "Domestic Voice",
  international_voice: "International Voice",
  domestic_text: "Domestic Texts",
  international_text: "International Texts",
  domestic_data: "Domestic Data",
  roaming_data: "Roaming Data",
};

// ---------- Component ----------
export default function PlanUsagesPage() {
  const params = useParams();
  const planId = params?.planId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullData, setFullData] = useState<PlanData | null>(null);
  const [usage, setUsage] = useState<UsageState>({
    usageBlocks: {},
    autoRenew: true,
    usageAlerts: true,
    billingCycle: "",
  });

  useEffect(() => {
    if (!planId) return;

    async function fetchData() {
      setLoading(true);
      try {
        // ✅ FIX: pass planId directly (not wrapped in array)
        const data = await beQuick.getPlanDetails(planId, true) as PlanData;
        setFullData(data);

        const usageSummary = data?.usage_summary || {};

        const usageBlocks: Record<string, UsageBlock> = {
          domestic_voice: convert(usageSummary.voice?.used, usageSummary.voice?.remaining),
          international_voice: convert(usageSummary.international_voice?.used, usageSummary.international_voice?.remaining),
          domestic_text: convert(usageSummary.text?.used, usageSummary.text?.remaining),
          international_text: convert(usageSummary.international_text?.used, usageSummary.international_text?.remaining),
          domestic_data: convert(usageSummary.data?.used, usageSummary.data?.remaining, true),
          roaming_data: convert(usageSummary.international_data?.used, usageSummary.international_data?.remaining, true),
        };

        // Billing cycle
        const startDate = data?.service_period?.start_at;
        const endDate = data?.service_period?.end_at;
        const billingCycle =
          startDate && endDate
            ? `${formatDate(startDate)} - ${formatDate(endDate)}, ${new Date(endDate).getFullYear()}`
            : "";

        setUsage({
          usageBlocks,
          autoRenew: true,
          usageAlerts: true,
          billingCycle,
        });
      } catch (err) {
        console.error("getPlanDetails error:", err);
        setError(err instanceof Error ? err.message : "Failed to load plan data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [planId]); // ✅ FIX: added planId to dependency array

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow dark:bg-gray-900 bg-gray-100 py-12 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-10">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <>
              {/* Usage Header */}
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-bold">Current Usage Overview</h4>
                <span className="text-sm text-gray-500">{usage.billingCycle}</span>
              </div>

              {/* Usage Cards — 3 per row */}
              <div className="row g-4 mb-6">
                {Object.entries(usage.usageBlocks).map(([key, item]) => {
                  // Icon
                  let Icon = FaMobileAlt;
                  let unit = "";
                  if (key.includes("voice")) { Icon = FaPhoneAlt; unit = "Minutes"; }
                  else if (key.includes("text")) { Icon = FaRegCommentDots; unit = "SMS"; }
                  else if (key.includes("data")) { Icon = FaWifi; unit = Number(item.total) < 1 ? "MB" : "GB"; }

                  // Convert <1GB → MB display
                  let usedLabel: string | number = item.used;
                  let totalLabel: string | number = item.total;
                  let remainingLabel: string | number = item.remaining;
                  if (item.isData && Number(item.total) < 1) {
                    usedLabel = (Number(item.used) * 1024).toFixed(0);
                    totalLabel = (Number(item.total) * 1024).toFixed(0);
                    remainingLabel = (Number(item.remaining) * 1024).toFixed(0);
                  }

                  return (
                    <div className="col-lg-4 col-md-6" key={key}>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 h-full">
                        {/* Card Top */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-green-500 text-xl">
                            <Icon />
                          </div>
                          <h6 className="font-semibold mb-0">{titleMap[key] || key}</h6>
                        </div>

                        {/* Value */}
                        <div className="mb-2">
                          <span className="text-2xl font-bold">{usedLabel}</span>
                          <span className="text-gray-400 text-sm"> / {totalLabel} {unit}</span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                          <div
                            className={`h-2 rounded-full ${item.pct > 90 ? "bg-red-500" : item.pct > 70 ? "bg-yellow-400" : "bg-green-500"}`}
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>

                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>{item.pct}% used</span>
                          <span>{remainingLabel} {unit} remaining</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Plan Preferences */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h5 className="font-semibold text-base mb-4">Plan Preferences</h5>

                {/* Auto Renewal */}
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                  <div>
                    <h6 className="font-semibold mb-1">Auto Renewal</h6>
                    <p className="text-gray-400 text-sm mb-1">Automatically renew your plan when it expires</p>
                    <p className="text-sm text-green-600">
                      {usage.autoRenew ? "Enabled - Your plan will renew automatically" : "Disabled - Your plan will not auto renew"}
                    </p>
                  </div>
                  <div className="form-check form-switch ms-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      checked={usage.autoRenew}
                      onChange={() => setUsage((p) => ({ ...p, autoRenew: !p.autoRenew }))}
                    />
                  </div>
                </div>

                {/* Usage Alerts */}
                <div className="flex justify-between items-start">
                  <div>
                    <h6 className="font-semibold mb-1">Usage Alerts</h6>
                    <p className="text-gray-400 text-sm mb-1">Get notified when approaching your plan limits</p>
                    <p className="text-sm text-green-600">
                      {usage.usageAlerts ? "Alerts at 80% and 95% usage" : "Alerts disabled"}
                    </p>
                  </div>
                  <div className="form-check form-switch ms-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      checked={usage.usageAlerts}
                      onChange={() => setUsage((p) => ({ ...p, usageAlerts: !p.usageAlerts }))}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h5 className="font-semibold text-base mb-4">Quick Actions</h5>
                <div className="flex gap-3 flex-wrap">
                  <button className="btn btn-success btn-sm">Upgrade Plan</button>
                  <button className="btn btn-outline-success btn-sm">Buy More Data</button>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => window.history.back()}>
                    ← Back
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}