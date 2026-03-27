"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaSimCard, FaMobileAlt, FaDatabase } from "react-icons/fa";
import Link from "next/link";
import beQuick from "../../../utils/dasdbeQuickApi";
import "../../Dashboard.css";

// ---------- Types ----------
interface Device {
  label: string;
  note: string;
  status: string;
  simType: string;
  phoneNumber: string;
  dataUsed: string;
  dataTotal: string;
}

interface SubscriberInfo {
  id?: string | number;
  primary_line_id?: string | number;
  mdn?: string;
}

interface PlanDetails {
  line?: {
    status?: string;
    is_esim?: boolean;
    mdn?: string;
  };
  service_buckets?: {
    plan?: { name?: string };
    services?: { used_units?: number; total_units?: number }[];
  }[];
}

// ---------- Component ----------
export default function DevicesPage() {
  // ✅ FIX: removed unused { params } prop — use useParams() only
  const { subscriber_id } = useParams() as { subscriber_id: string };

  const [loading, setLoading] = useState(true);
  const [subscriber, setSubscriber] = useState<SubscriberInfo | null>(null);
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    if (!subscriber_id) return;

    const fetchDevices = async () => {
      setLoading(true);
      try {
        const subDetails = await beQuick.getSubscriberDetails(subscriber_id) as { subscribers: SubscriberInfo[] };
        const subscriberInfo: SubscriberInfo | undefined = subDetails?.subscribers?.[0];
        setSubscriber(subscriberInfo ?? null);

        if (subscriberInfo?.primary_line_id) {
          const pDetails = await beQuick.getPlanDetails(subscriberInfo.primary_line_id, true) as PlanDetails;
          setPlanDetails(pDetails);

          const deviceList: Device[] = pDetails?.service_buckets?.length
            ? pDetails.service_buckets.map((bucket, idx) => ({
                label: `Device ${subscriberInfo?.mdn?.slice(-4) || idx + 1}`,
                note: bucket?.plan?.name || "pSIM • Primary Line",
                status: pDetails?.line?.status === "active" ? "Active" : "Pending",
                simType: pDetails?.line?.is_esim ? "eSIM" : "pSIM",
                phoneNumber: pDetails?.line?.mdn || "N/A",
                dataUsed: `${(Number(bucket?.services?.[0]?.used_units || 0) / 1024).toFixed(2)} GB`,
                dataTotal: `${(Number(bucket?.services?.[0]?.total_units || 0) / 1024).toFixed(2)} GB`,
              }))
            : [
                {
                  label: "No Device Found",
                  note: "N/A",
                  status: "Pending",
                  simType: "N/A",
                  phoneNumber: "N/A",
                  dataUsed: "0 GB",
                  dataTotal: "0 GB",
                },
              ];

          setDevices(deviceList);
        }
      } catch (err) {
        console.error("Error loading devices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [subscriber_id]); // ✅ subscriber_id in deps

  const handlePauseDevice = (device: Device): void => {
    alert(`Pausing ${device.label}...`);
  };

  // ---------- Data bar percentage helper ----------
  const getDataPct = (used: string, total: string): number => {
    const u = parseFloat(used);
    const t = parseFloat(total);
    if (!t || isNaN(u) || isNaN(t)) return 0;
    return Math.min(Math.round((u / t) * 100), 100);
  };

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

          {/* Devices */}
          {!loading && (
            <div className="row g-3">
              {devices.map((d, i) => (
                <div key={i} className="col-md-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-full">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <strong>{d.label}</strong>
                        <p className="text-gray-400 text-xs mb-0">{d.note}</p>
                      </div>
                      <span className={`badge ${d.status === "Active" ? "bg-success" : "bg-warning text-dark"}`}>
                        {d.status}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1 mb-3">
                      <p className="mb-1">
                        <FaSimCard className="inline me-2 text-green-500" />
                        <strong>SIM Type:</strong> {d.simType}
                      </p>
                      <p className="mb-1">
                        <FaMobileAlt className="inline me-2 text-green-500" />
                        <strong>Phone Number:</strong> {d.phoneNumber}
                      </p>
                      <p className="mb-2">
                        <FaDatabase className="inline me-2 text-green-500" />
                        <strong>Data Used:</strong> {d.dataUsed} / {d.dataTotal}
                      </p>

                      {/* Data bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${getDataPct(d.dataUsed, d.dataTotal)}%` }}
                        />
                      </div>
                    </div>

                    <button
                      className="btn btn-outline-success btn-sm mt-1 w-100"
                      onClick={() => handlePauseDevice(d)}
                    >
                      Pause Device
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Device */}
              <div className="col-12 mt-2">
                <Link href="/dashboard/add-device/">
                  <button className="btn btn-success w-100">+ Add New Device</button>
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}