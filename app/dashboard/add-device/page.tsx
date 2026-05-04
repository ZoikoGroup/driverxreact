"use client";
import { useState, useEffect } from "react";
import {
  getSubscriberByEmail,
  getLinesBySubscriberID,
  changeDevice,
} from "../../utils/beQuickStripeWebPaymentApi";

// ---------- Types ----------
interface DeviceOption {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

interface CompatResult {
  compatible: boolean;
  message: string;
}

interface LineInfo {
  id: number;
  iccid: string;
  status: string;
  mdn?: string;
}

interface ActivationResult {
  success: boolean;
  message: string;
  data?: unknown;
}

// ---------- Constants ----------
const DEVICES: DeviceOption[] = [
  { id: "smartphone", title: "Smartphone",    desc: "For calls, texts, data, and apps on the road", icon: "📱" },
  { id: "tablet",     title: "Tablet",         desc: "Perfect for navigation and entertainment",      icon: "💻" },
  { id: "hotspot",    title: "Mobile Hotspot", desc: "Share internet with multiple devices",          icon: "📶" },
  { id: "iot",        title: "IoT Device",      desc: "Fleet tracking and monitoring devices",         icon: "🔗" },
];

// ---------- Component ----------
export default function AddDevicePage() {
  const [step, setStep] = useState(1);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [imei, setImei] = useState("");
  const [checking, setChecking] = useState(false);
  const [compatResult, setCompatResult] = useState<CompatResult | null>(null);
  const [imeiError, setImeiError] = useState<string | null>(null);
  const [selectedLine, setSelectedLine] = useState<LineInfo | null>(null);
  const [iccidError, setIccidError] = useState<string | null>(null);
  const [activating, setActivating] = useState(false);
  const [activationResult, setActivationResult] = useState<ActivationResult | null>(null);
  const [linesInfo, setLinesInfo] = useState<LineInfo[]>([]);
  const [userMail, setUserMail] = useState<string>("");

  useEffect(() => {
    // localStorage is only available client-side — read it here to avoid SSR errors
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const email: string = user.email || "";
    setUserMail(email);

    const fetchLines = async () => {
      if (!email) return;
      try {
        const id = await getSubscriberByEmail(email);
        const response = await getLinesBySubscriberID(id);
        const rawLines: LineInfo[] = Array.isArray(response)
          ? response
          : Array.isArray((response as { lines?: LineInfo[] })?.lines)
          ? (response as { lines: LineInfo[] }).lines
          : [];
        const activeLines = rawLines.filter(
          (line) => line.status === "active" && line.iccid
        );
        setLinesInfo(activeLines);
      } catch (err) {
        console.error("Failed to load lines:", err);
        setLinesInfo([]);
      }
    };
    fetchLines();
  }, []);

  // ---------- Helpers ----------
  const handleNext = (): void => {
    if (step === 1 && !selectedDevice) {
      alert("Please select a device type.");
      return;
    }
    if (step === 2 && (!compatResult || !compatResult.compatible)) {
      alert("Please check device compatibility before continuing.");
      return;
    }
    if (step === 2 && !selectedLine) {
      alert("Please select an ICCID before continuing.");
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = (): void => setStep((s) => s - 1);

  const openChat = (): void => {
    window.open(
      "https://driverxchatbot-722985113446.europe-west1.run.app/",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const validateAndCheckDevice = async (): Promise<void> => {
    const cleanedImei = imei.replace(/\s/g, "").trim();

    if (!cleanedImei) {
      setImeiError("Please enter your IMEI/MEID number.");
      return;
    }
    if (!/^\d{14,16}$/.test(cleanedImei)) {
      setImeiError("Please enter a valid 14-16 digit IMEI number.");
      return;
    }

    setImeiError(null);
    setChecking(true);
    setCompatResult(null);
    setSelectedLine(null);

    try {
      // STEP 1: CHECK LOCAL STORAGE
      const storageKeys = Object.keys(localStorage).filter((key) =>
        key.startsWith("device_serial_")
      );
      let localMatch: { device_serial: string; esim_compatible: boolean } | null = null;
      for (const key of storageKeys) {
        const item = localStorage.getItem(key);
        if (!item) continue;
        const parsed = JSON.parse(item);
        if (parsed.device_serial === cleanedImei) {
          localMatch = parsed;
          break;
        }
      }
      const nextIndex = storageKeys.length + 1;

      if (localMatch) {
        setCompatResult({
          compatible: localMatch.esim_compatible,
          message: `${cleanedImei} is ${localMatch.esim_compatible ? "" : "not "}compatible with eSIM.`,
        });
        return;
      }

      // STEP 2: GOLITE CHECK
      const goliteRes = await fetch(
        "https://goliteapi.golitemobile.com/api/device_compatibility_checker/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Secret-Key": process.env.NEXT_PUBLIC_ESIM_SECRET_KEY as string,
          },
          body: JSON.stringify({ action: "esim_check", imei: cleanedImei }),
        }
      );
      const goliteData = await goliteRes.json();
      if (goliteData.compatible === true) {
        setCompatResult({ compatible: true, message: `${cleanedImei} is compatible with eSIM.` });
        localStorage.setItem(
          `device_serial_${nextIndex}`,
          JSON.stringify({ device_serial: cleanedImei, esim_compatible: true })
        );
        return;
      }

      // STEP 3: BEQUICK API
      const bequickRes = await fetch(
        "https://zoiko-atom-api.bequickapps.com/carriers/3/query_device_info",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-AUTH-TOKEN": process.env.NEXT_PUBLIC_BEQUICK_TOKEN as string,
          },
          body: JSON.stringify({ device_serial: cleanedImei }),
        }
      );
      const bequickData = await bequickRes.json();
      if (bequickData?.esim_compatible === true) {
        setCompatResult({ compatible: true, message: `${cleanedImei} is compatible with eSIM.` });
        localStorage.setItem(
          `device_serial_${nextIndex}`,
          JSON.stringify({ device_serial: cleanedImei, esim_compatible: true })
        );
        await fetch("https://goliteapi.golitemobile.com/api/device_compatibility_checker/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Secret-Key": process.env.NEXT_PUBLIC_ESIM_SECRET_KEY as string,
          },
          body: JSON.stringify({ action: "esim_update", imei: cleanedImei }),
        });
        return;
      }

      // STEP 4: FINAL CHECK
      const finalRes = await fetch(
        "https://goliteapi.golitemobile.com/api/device_compatibility_checker/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Secret-Key": process.env.NEXT_PUBLIC_ESIM_SECRET_KEY as string,
          },
          body: JSON.stringify({ action: "esim_v_check", imei: cleanedImei }),
        }
      );
      const finalData = await finalRes.json();
      const finalResult: boolean = finalData.esimCompatible === true;
      localStorage.setItem(
        `device_serial_${nextIndex}`,
        JSON.stringify({ device_serial: cleanedImei, esim_compatible: finalResult })
      );
      setCompatResult({
        compatible: finalResult,
        message: `${cleanedImei} is ${finalResult ? "" : "not "}compatible with eSIM.`,
      });
    } catch (err) {
      setCompatResult({
        compatible: false,
        message:
          err instanceof Error ? err.message : "Unable to verify device. Please try again.",
      });
    } finally {
      setChecking(false);
    }
  };

  const handleConfirmAndActivate = async (): Promise<void> => {
    if (!selectedLine) {
      setIccidError("Please select an ICCID.");
      return;
    }
    setIccidError(null);
    setActivating(true);
    try {
      const lineID = selectedLine.id;
      const deviceDetails = { device_serial: imei, iccid: selectedLine.iccid };
      console.log("[changeDevice] lineID:", lineID, "deviceDetails:", deviceDetails);

      const result = await changeDevice(lineID, deviceDetails);
      console.log("[changeDevice] raw result:", result);

      if (!result) throw new Error("No response returned from changeDevice.");
      if ((result as { error?: string; errors?: unknown })?.error || (result as { errors?: unknown })?.errors)
        throw new Error(
          (result as { error?: string }).error ||
          JSON.stringify((result as { errors?: unknown }).errors)
        );

      setActivationResult({ success: true, message: "Device successfully activated.", data: result });
      setTimeout(() => {
        setStep(1);
        setSelectedDevice("");
        setImei("");
        setCompatResult(null);
        setSelectedLine(null);
        setActivationResult(null);
      }, 3000);
    } catch (err) {
      console.error("[changeDevice] error:", (err as Error)?.message);
      setActivationResult({
        success: false,
        message:
          err instanceof Error ? err.message : "Activation failed. Please try again.",
      });
    } finally {
      setActivating(false);
    }
  };

  // ---------- Progress Bar ----------
  const ProgressBar = () => (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-6">
      <div
        className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
        style={{ width: `${(step / 3) * 100}%` }}
      />
    </div>
  );

  // ---------- Step 1 ----------
  const renderStep1 = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <p className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">Step 1 of 3</p>
      <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-1">Device Selection</h4>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        Choose the type of device you want to add to your plan.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {DEVICES.map((device) => (
          <button
            key={device.id}
            type="button"
            onClick={() => setSelectedDevice(device.id)}
            className={`border rounded-xl p-4 text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 ${
              selectedDevice === device.id
                ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm"
                : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-green-300 hover:bg-green-50/50 dark:hover:bg-green-900/10"
            }`}
          >
            <div className="text-3xl mb-2">{device.icon}</div>
            <h6 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">{device.title}</h6>
            <p className="text-gray-400 text-xs leading-snug">{device.desc}</p>
          </button>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
          onClick={handleNext}
        >
          Continue to Device Info →
        </button>
      </div>
    </div>
  );

  // ---------- Step 2 ----------
  const renderStep2 = () => {
    const isValidIMEI = /^\d{15,16}$/.test(imei) || /^\d{32}$/.test(imei);

    const handleLineSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const lineId = parseInt(e.target.value, 10);
      const line = linesInfo.find((l) => l.id === lineId) || null;
      setSelectedLine(line);
      setIccidError(null);
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">Step 2 of 3</p>
        <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-1">Device Info</h4>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Provide your device&apos;s unique identifier to check compatibility with our network.
        </p>

        {/* IMEI Input */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Device IMEI or EID Number
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={imei}
              onChange={(e) => {
                setImei(e.target.value);
                setCompatResult(null);
                setSelectedLine(null);
                setImeiError(null);
              }}
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white placeholder-gray-400"
              placeholder="Enter 15/16-digit IMEI or 32-digit EID"
            />
            <button
              type="button"
              className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              onClick={validateAndCheckDevice}
              disabled={!isValidIMEI || checking}
            >
              {checking ? "Checking..." : "Check Compatibility"}
            </button>
          </div>
          <p className="text-gray-400 text-xs mt-1.5">
            Find your IMEI by dialing <strong>*#06#</strong> or checking Settings → About.
          </p>

          {imeiError && (
            <p className="text-sm mt-1.5 text-red-500 flex items-center gap-1">
              <span>⚠️</span> {imeiError}
            </p>
          )}
          {compatResult && (
            <p className={`text-sm mt-1.5 font-semibold flex items-center gap-1 ${
              compatResult.compatible ? "text-green-600" : "text-red-500"
            }`}>
              {compatResult.compatible ? "✅" : "❌"} {compatResult.message}
            </p>
          )}
        </div>

        {/* ICCID select — only shown when device is compatible */}
        {compatResult?.compatible && (
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Select Line (ICCID)
            </label>
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              value={selectedLine?.id ?? ""}
              onChange={handleLineSelect}
            >
              <option value="">-- Select a line --</option>
              {linesInfo.map((line) => (
                <option key={line.id} value={line.id}>
                  {line.iccid}{line.mdn ? ` — ${line.mdn}` : ""} (Line #{line.id})
                </option>
              ))}
            </select>

            {linesInfo.length === 0 && (
              <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-2 flex items-center gap-1">
                ⚠️ No active lines found for your account.
              </p>
            )}
            {iccidError && (
              <p className="text-red-500 text-sm mt-2">{iccidError}</p>
            )}
            {selectedLine && (
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Line ID:</span> {selectedLine.id}
                &nbsp;·&nbsp;
                <span className="font-semibold">ICCID:</span> {selectedLine.iccid}
                {selectedLine.mdn && (
                  <>&nbsp;·&nbsp;<span className="font-semibold">MDN:</span> {selectedLine.mdn}</>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={handleBack}
          >
            ← Back
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleNext}
            disabled={!compatResult?.compatible || !selectedLine}
          >
            Continue to Review →
          </button>
        </div>
      </div>
    );
  };

  // ---------- Step 3 ----------
  const renderStep3 = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <p className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">Step 3 of 3</p>
      <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-4">Review &amp; Confirm</h4>

      <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 mb-5 text-sm space-y-2">
        {[
          ["Device Type", DEVICES.find((d) => d.id === selectedDevice)?.title || selectedDevice],
          ["IMEI / EID", imei],
          ["Line ID", selectedLine?.id],
          ["ICCID", selectedLine?.iccid],
          ...(selectedLine?.mdn ? [["MDN", selectedLine.mdn]] : []),
        ].map(([label, value]) => (
          <div key={String(label)} className="flex items-start gap-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300 w-32 shrink-0">{label}:</span>
            <span className="text-gray-600 dark:text-gray-400 break-all">{String(value)}</span>
          </div>
        ))}
        <div className="flex items-start gap-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300 w-32 shrink-0">eSIM Compat:</span>
          <span className="text-green-600 font-semibold">Compatible ✅</span>
        </div>
      </div>

      <p className="text-gray-400 dark:text-gray-500 text-sm mb-5">
        Clicking <strong className="text-gray-700 dark:text-gray-300">Confirm &amp; Activate</strong> will call{" "}
        <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs font-mono">
          changeDevice({selectedLine?.id}, {`{ device_serial, iccid }`})
        </code>{" "}
        to link this device to the selected line.
      </p>

      {activationResult && (
        <div className={`rounded-lg px-4 py-3 text-sm mb-4 flex items-center gap-2 ${
          activationResult.success
            ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
            : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
        }`}>
          {activationResult.success ? "✅" : "❌"}
          <span>{activationResult.message}</span>
        </div>
      )}

      {iccidError && (
        <p className="text-red-500 text-sm mb-4">{iccidError}</p>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          onClick={handleBack}
          disabled={activating}
        >
          ← Back
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleConfirmAndActivate}
          disabled={activating || activationResult?.success === true}
        >
          {activating ? "Activating..." : "Confirm & Activate"}
        </button>
      </div>
    </div>
  );

  // ---------- Render ----------
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-100 dark:bg-gray-900 dark:text-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main Steps */}
            <div className="lg:col-span-2">
              <ProgressBar />
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
            </div>

            {/* Help Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 sticky top-6">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Finding Your IMEI/EID
                </h5>

                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  For Smartphones &amp; Tablets:
                </p>
                <ul className="text-gray-400 text-sm list-disc pl-4 mb-4 space-y-1">
                  <li>Dial <strong>*#06#</strong> to display IMEI</li>
                  <li>Go to Settings → About → IMEI</li>
                  <li>Check device box or SIM tray</li>
                </ul>

                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  For eSIM devices:
                </p>
                <ul className="text-gray-400 text-sm list-disc pl-4 mb-5 space-y-1">
                  <li>Look for EID in Settings → Cellular</li>
                  <li>EID is 32 digits long</li>
                </ul>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-xl p-4">
                  <h6 className="font-semibold text-gray-800 dark:text-yellow-300 mb-1">
                    Need Assistance?
                  </h6>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                    Our support team is available 24/7. Chat with us for help with device
                    compatibility or activation.
                  </p>
                  <button
                    type="button"
                    className="w-full px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold rounded-lg text-sm transition-colors"
                    onClick={openChat}
                  >
                    Chat with Support
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}