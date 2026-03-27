"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import beQuick from "../../../utils/dasdbeQuickApi";
import { getPlanDetails } from "../../../utils/dasdbeQuickApi";
import "../../Dashboard.css";

// ---------- Types ----------
interface Bill {
  id: string | number;
  period: string;
  amount: string;
  due: string;
  status: string;
  attachmentUrl?: string;
}

interface BillingData {
  bills: Bill[];
  currentBalance: string;
  daysLeft: number;
  recentSummary: string;
  billingAlerts: string[];
}

interface PlanDetails {
  current_plans?: { id: string | number; name: string }[];
}

interface SubscriberInfo {
  primary_line_id?: string | number;
}

// ---------- Constants ----------
const TOKEN = "09ff2d85-a451-47e6-86bc-aba98e1e4629";

// ---------- Component ----------
export default function BillingPaymentPage() {
  // ✅ FIX: use useParams() instead of React.use(params)
  const { subscriber_id } = useParams() as { subscriber_id: string };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billingData, setBillingData] = useState<BillingData>({
    bills: [],
    currentBalance: "0.00",
    daysLeft: 0,
    recentSummary: "0.00",
    billingAlerts: [],
  });
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);
  const [primaryLineId, setPrimaryLineId] = useState<string | number | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const BILLS_PER_PAGE = 5;

  // ---------- Fetch Billing ----------
  useEffect(() => {
    if (!subscriber_id) return;

    async function fetchBillingData() {
      try {
        setLoading(true);
        setError(null);

        const API_URL = `https://zoiko-atom-api.bequickapps.com/billing_statements?by_subscriber_id=${subscriber_id}`;
        const res = await fetch(API_URL, {
          headers: { "X-AUTH-TOKEN": TOKEN },
        });

        if (!res.ok) throw new Error("Failed to fetch billing data");

        const data = await res.json();
        const statements: {
          id: string | number;
          start_at: string;
          closed_at: string;
          due_at: string;
          total?: string | number;
          net_received?: string | number;
          status?: string;
          past_due?: boolean;
          paid?: boolean;
          statement_attachment_url?: string;
        }[] = data?.billing_statements || [];

        if (statements.length === 0) {
          setBillingData({
            bills: [],
            currentBalance: "$0.00",
            daysLeft: 0,
            recentSummary: "$0.00",
            billingAlerts: ["No billing statements found"],
          });
          return;
        }

        const bills: Bill[] = statements
          .map((b) => ({
            id: b.id,
            period: `${new Date(b.start_at).toLocaleDateString()} - ${new Date(b.closed_at).toLocaleDateString()}`,
            amount: `$${b.total}`,
            due: new Date(b.due_at).toLocaleDateString(),
            status: b.status || "Unknown",
            attachmentUrl: b.statement_attachment_url,
          }))
          .reverse();

        const latest = statements[statements.length - 1];

        const alerts: string[] = [];
        if (latest?.past_due) alerts.push("Payment overdue");
        if (!latest?.paid) alerts.push("Pending payment for the latest bill");
        else alerts.push("Auto-renew is enabled");

        const dueDate = latest?.due_at ? new Date(latest.due_at) : null;
        const daysLeft = dueDate
          ? Math.max(0, Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
          : 0;

        setBillingData({
          bills,
          currentBalance: `$${latest?.total || "0.00"}`,
          daysLeft,
          recentSummary: `$${latest?.net_received || "0.00"}`,
          billingAlerts: alerts,
        });
      } catch (err) {
        console.error("Billing fetch error:", err);
        setError("Unable to load billing data.");
      } finally {
        setLoading(false);
      }
    }

    fetchBillingData();
  }, [subscriber_id]);

  // ---------- Fetch Plan ----------
  useEffect(() => {
    if (!subscriber_id) return;

    async function fetchPlan() {
      try {
        const subDetails = await beQuick.getSubscriberDetails(subscriber_id) as { subscribers: SubscriberInfo[] };
        const subscriberInfo: SubscriberInfo | undefined = subDetails?.subscribers?.[0];
        if (!subscriberInfo) return;

        const lineId = subscriberInfo.primary_line_id;
        setPrimaryLineId(lineId ?? null);

        if (lineId) {
          const data = await getPlanDetails(lineId, true) as PlanDetails;
          setPlanDetails(data);
        }
      } catch (err) {
        console.error("Failed to fetch plan details:", err);
      }
    }

    fetchPlan();
  }, [subscriber_id]);

  // ---------- Download Bill ----------
  const handleDownload = async (billId: string | number): Promise<void> => {
    try {
      const res = await fetch(
        `https://zoiko-atom-api.bequickapps.com/billing_statements/${billId}/statement_attachment`,
        { headers: { "X-AUTH-TOKEN": TOKEN } }
      );
      if (!res.ok) throw new Error("Failed to download statement");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `billing_statement_${billId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download statement.");
    }
  };

  // ---------- Pagination ----------
  const totalPages = Math.ceil(billingData.bills.length / BILLS_PER_PAGE);
  const currentBills = billingData.bills.slice(
    (currentPage - 1) * BILLS_PER_PAGE,
    currentPage * BILLS_PER_PAGE
  );
  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ---------- Derived ----------
  const currentPlan = planDetails?.current_plans?.[0];
  const currentPlanName = currentPlan?.name || "N/A";
  const currentPlanId = currentPlan?.id || "N/A";

  // ---------- Render ----------
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow dark:bg-gray-900 bg-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-10">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && <div className="alert alert-danger text-center">{error}</div>}

          {!loading && !error && (
            <>
              {/* Summary Cards */}
              <div className="row g-3 mb-6">

                {/* Current Balance */}
                <div className="col-md-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
                    <h6 className="text-gray-400 mb-1">Current Balance</h6>
                    <h4 className="font-bold text-2xl mb-1">{billingData.currentBalance}</h4>
                    <p className="text-gray-400 text-sm mb-4">
                      {billingData.daysLeft} days left ({currentPlanName})
                    </p>
                    <button
                      className="btn btn-success w-100"
                      onClick={() => alert(`Pay Now clicked for plan ${currentPlanId}`)}
                    >
                      Pay Now
                    </button>
                  </div>
                </div>

                {/* Recent Summary */}
                <div className="col-md-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
                    <h6 className="text-gray-400 mb-1">Recent Summary</h6>
                    <h4 className="font-bold text-2xl mb-1">{billingData.recentSummary}</h4>
                    <p className="text-green-600 text-sm">✓ Last payment successful</p>
                  </div>
                </div>

                {/* Billing Alerts */}
                <div className="col-md-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
                    <h6 className="text-gray-400 mb-2">Billing Alerts</h6>
                    {billingData.billingAlerts.length > 0 ? (
                      billingData.billingAlerts.map((alert, i) => (
                        <p key={i} className="text-sm mb-1 text-yellow-600">⚠️ {alert}</p>
                      ))
                    ) : (
                      <p className="text-green-600 text-sm mb-0">✓ No pending alerts</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bill History */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
                <h6 className="font-bold mb-4">Bill History</h6>

                <div className="table-responsive">
                  <table className="table table-striped align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Service Period</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentBills.length > 0 ? (
                        currentBills.map((bill, i) => (
                          <tr key={i}>
                            <td>{bill.id}</td>
                            <td>{bill.period}</td>
                            <td>{bill.amount}</td>
                            <td>{bill.due}</td>
                            <td>
                              <span className={`badge ${bill.status?.toLowerCase() === "paid" ? "bg-success" : "bg-warning"}`}>
                                {bill.status}
                              </span>
                            </td>
                            <td>
                              {bill.attachmentUrl ? (
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() => handleDownload(bill.id)}
                                >
                                  Download
                                </button>
                              ) : (
                                <span className="text-gray-400 text-sm">N/A</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center text-gray-400 py-4">
                            No billing records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-4">
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}