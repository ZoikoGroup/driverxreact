"use client";
import { useState, useEffect, JSX } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

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

interface AllPlansSectionProps {
  heading?: string;
  subHeading?: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORY_TABS = [
  { label: "Prepaid Plans", slug: "prepaid-plans" },
  { label: "Postpaid Plans", slug: "postpaid-plans" },
  { label: "Business Plans", slug: "business-plans" },
  { label: "Data-Only Plans", slug: "data-only-plans" },
];

const TAB_ICONS: Record<string, JSX.Element> = {
  "prepaid-plans": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  "postpaid-plans": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  "business-plans": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  "data-only-plans": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
    </svg>
  ),
};

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

// ── Step Indicator ─────────────────────────────────────────────────────────────

const StepIndicator = ({ currentStep, totalSteps = 2 }: { currentStep: number; totalSteps?: number }) => (
  <div className="flex items-center justify-center gap-0 mb-6">
    {Array.from({ length: totalSteps }).map((_, i) => {
      const stepNum = i + 1;
      const isCompleted = stepNum < currentStep;
      const isActive = stepNum === currentStep;
      return (
        <div key={stepNum} className="flex items-center">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              isCompleted
                ? "bg-[#1a8a76] text-white"
                : isActive
                ? "bg-[#1a4a3f] text-white ring-4 ring-[#1a4a3f]/20"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            {isCompleted ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              stepNum
            )}
          </div>
          {i < totalSteps - 1 && (
            <div className={`w-16 h-0.5 transition-all duration-300 ${isCompleted ? "bg-[#1a8a76]" : "bg-gray-200"}`} />
          )}
        </div>
      );
    })}
  </div>
);

// ── Device Compatibility Result ───────────────────────────────────────────────

interface CompatibilityResult {
  compatible: boolean;
  device?: string | null;
  manufacturer?: string | null;
  lteCompatible?: boolean | null;
  fiveGCompatible?: boolean | null;
  esimCompatible?: boolean | null;
  message?: string | null;
}

// ── Port Field (defined outside modal to prevent focus loss on re-render) ────────
interface PortFieldProps {
  label: string;
  name: keyof PortForm;
  placeholder: string;
  required?: boolean;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PortField = ({ label, name, placeholder, required = true, value, error, onChange }: PortFieldProps) => (
  <div>
    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a8a76] transition ${
        error ? "border-red-400 focus:ring-red-400" : "border-gray-200 dark:border-gray-700"
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-0.5">{error}</p>}
  </div>
);

// ── Buy Plan Modal ─────────────────────────────────────────────────────────────

type ModalStep =
  | "choose-setup"    // Step 1: Get New SIM / Keep My Number
  | "choose-sim-type" // Step 2a (Get New SIM): eSIM / pSIM
  | "esim-check"      // Step 2b (eSIM): IMEI check
  | "port-form";      // Step 2c (Keep My Number): port details form

interface PortForm {
  fullName: string;
  mobileNumber: string;
  email: string;
  zipCode: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  currentCarrierName: string;
  currentSimSerial: string;
  currentOspAccountNumber: string;
  ospAccountPin: string;
}

interface BuyPlanModalProps {
  plan: Plan;
  onClose: () => void;
}

const EMPTY_PORT_FORM: PortForm = {
  fullName: "", mobileNumber: "", email: "", zipCode: "",
  addressLine1: "", addressLine2: "", city: "", state: "",
  currentCarrierName: "", currentSimSerial: "",
  currentOspAccountNumber: "", ospAccountPin: "",
};

const BuyPlanModal = ({ plan, onClose }: BuyPlanModalProps) => {
  const [step, setStep] = useState<ModalStep>("choose-setup");
  const [setupChoice, setSetupChoice] = useState<"new-sim" | "keep-number" | null>("new-sim");
  const [simChoice, setSimChoice] = useState<"esim" | "psim" | null>("esim");

  // IMEI check state (Get New SIM → eSIM)
  const [imei, setImei] = useState("");
  const [checking, setChecking] = useState(false);
  const [compatResult, setCompatResult] = useState<CompatibilityResult | null>(null);
  const [imeiError, setImeiError] = useState<string | null>(null);

  // Keep My Number state
  const [mdn, setMdn] = useState("");
  const [mdnChecking, setMdnChecking] = useState(false);
  const [mdnEligible, setMdnEligible] = useState<boolean | null>(null);
  const [mdnError, setMdnError] = useState<string | null>(null);

  // Port form state
  const [portForm, setPortForm] = useState<PortForm>(EMPTY_PORT_FORM);
  const [portErrors, setPortErrors] = useState<Partial<PortForm>>({});

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Reset compat result when IMEI changes
  useEffect(() => { setCompatResult(null); setImeiError(null); }, [imei]);

  // Reset MDN eligibility when MDN changes
  useEffect(() => { setMdnEligible(null); setMdnError(null); }, [mdn]);

  const handleSetupContinue = () => {
    if (!setupChoice) return;
    if (setupChoice === "new-sim") setStep("choose-sim-type");
    // keep-number: MDN check is inline on step 1
  };

  const handleCheckMdn = async () => {
    if (!mdn.trim()) { setMdnError("Please enter your MDN/MSISDN number."); return; }
    if (!/^\+?[\d\s\-().]{7,15}$/.test(mdn)) { setMdnError("Please enter a valid phone number."); return; }
    setMdnError(null);
    setMdnChecking(true);
    setMdnEligible(null);
    try {
      // ── Replace with your real eligibility API ──
      // const res = await fetch(`https://your-api.com/check-port?mdn=${mdn}`);
      // const data = await res.json();
      // setMdnEligible(data.eligible);
      await new Promise((r) => setTimeout(r, 1200));
      setMdnEligible(true); // simulated
    } catch {
      setMdnError("Unable to verify number. Please try again.");
    } finally {
      setMdnChecking(false);
    }
  };

  const handlePortFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPortForm((prev) => ({ ...prev, [name]: value }));
    if (portErrors[name as keyof PortForm]) {
      setPortErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validatePortForm = (): Partial<PortForm> => {
    const errs: Partial<PortForm> = {};
    if (!portForm.fullName.trim())                errs.fullName = "Required";
    if (!portForm.mobileNumber.trim())            errs.mobileNumber = "Required";
    if (!portForm.email.trim())                   errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(portForm.email)) errs.email = "Invalid email";
    if (!portForm.addressLine1.trim())            errs.addressLine1 = "Required";
    if (!portForm.addressLine2.trim())            errs.addressLine2 = "Required";
    if (!portForm.city.trim())                    errs.city = "Required";
    if (!portForm.state.trim())                   errs.state = "Required";
    if (!portForm.currentCarrierName.trim())      errs.currentCarrierName = "Required";
    if (!portForm.currentSimSerial.trim())        errs.currentSimSerial = "Required";
    if (!portForm.currentOspAccountNumber.trim()) errs.currentOspAccountNumber = "Required";
    if (!portForm.ospAccountPin.trim())           errs.ospAccountPin = "Required";
    return errs;
  };

  const handlePortFormContinue = () => {
    const errs = validatePortForm();
    if (Object.keys(errs).length > 0) { setPortErrors(errs); return; }
    const checkoutData = {
      planId: plan.id, bqPlanID: plan.bqPlanID, planSlug: plan.slug, planName: plan.name,
      price: plan.price, salePrice: plan.sale_price, price24: plan.price_24,
      finalPrice: plan.final_price, durationDays: plan.duration_days,
      shortDescription: plan.short_description, isPopular: plan.is_popular,
      category: { id: plan.category.id, name: plan.category.name, slug: plan.category.slug },
      features: plan.features.map((f) => ({ id: f.id, title: f.title })),
      simType: "keep-number", setupType: "keep-number",
      imei: null, device: null, manufacturer: null,
      lteCompatible: null, fiveGCompatible: null, esimCompatible: null,
      portNumberInfo: {
        mdn: mdn.trim(),
        fullName: portForm.fullName,
        mobileNumber: portForm.mobileNumber,
        email: portForm.email,
        zipCode: portForm.zipCode,
        addressLine1: portForm.addressLine1,
        addressLine2: portForm.addressLine2,
        city: portForm.city,
        state: portForm.state,
        currentCarrierName: portForm.currentCarrierName,
        currentSimSerial: portForm.currentSimSerial,
        currentOspAccountNumber: portForm.currentOspAccountNumber,
        ospAccountPin: portForm.ospAccountPin,
      },
      timestamp: Date.now(),
    };
    saveToCart(checkoutData);
    onClose();
    window.location.href = "/checkout";
  };

  const handleSimTypeSelect = (type: "esim" | "psim") => {
    setSimChoice(type);
    setCompatResult(null);
    setImei("");
    setImeiError(null);
    if (type === "esim") {
      setStep("esim-check");
    }
    // pSIM: stay on current screen but show Continue button
  };

  const handleCheckDevice = async () => {
    if (!imei.trim()) {
      setImeiError("Please enter your IMEI/MEID number.");
      return;
    }
    if (!/^\d{14,16}$/.test(imei.replace(/\s/g, ""))) {
      setImeiError("Please enter a valid 14–16 digit IMEI number.");
      return;
    }
    setImeiError(null);
    setChecking(true);
    setCompatResult(null);

    try {
      const res = await fetch("https://zoiko-atom-api.bequickapps.com/carriers/3/query_device_info", {
        method: "POST",
        headers: {
          "X-AUTH-TOKEN": process.env.NEXT_PUBLIC_BEQUICK_TOKEN!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ device_serial: imei.trim() }),
      });

      const data = await res.json();

      // wp_send_json_error returns { success: false, data: {...} } with HTTP 200
      // so we check data.success instead of res.ok
      if (data.compatibility !== true) {
        const info = data.device_info ?? {};
        setCompatResult({
          compatible: false,
          device: info.marketing_name ?? info.name ?? null,
          manufacturer: info.manufacturer ?? null,
          lteCompatible: info.lte_device,
          fiveGCompatible: info.device_5g,
          esimCompatible: info.esim_compatible,
          message: data.message ?? "Device is not compatible with our network.",
        });
        return;
      }

      // Response shape (flat, PHP already casts to bool):
      // { compatibility: bool, success: bool, message: string, imei: string,
      //   device_info: { name, manufacturer, model, lte_device, device_5g, esim_compatible,
      //                  marketing_name, operating_system, volte_compatible, wifi_calling_capable } }
      const info = data.device_info ?? {};
      setCompatResult({
        compatible: data.compatibility === true,
        device: info.marketing_name ?? info.name ?? null,
        manufacturer: info.manufacturer ?? null,
        lteCompatible: info.lte_device,
        fiveGCompatible: info.device_5g,
        esimCompatible: info.esim_compatible,
        message: data.message ?? null,
      });
    } catch (err) {
      setCompatResult({ compatible: false, message: err instanceof Error ? err.message : "Unable to verify device. Please try again." });
    } finally {
      setChecking(false);
    }
  };

  const handleContinueToCheckout = () => {
    const checkoutData = {
      // ── Plan core identifiers ──
      planId: plan.id,
      bqPlanID: plan.bqPlanID,
      planSlug: plan.slug,
      planName: plan.name,

      // ── Plan pricing ──
      price: plan.price,
      salePrice: plan.sale_price,
      price24: plan.price_24,
      finalPrice: plan.final_price,
      durationDays: plan.duration_days,

      // ── Plan meta ──
      shortDescription: plan.short_description,
      isPopular: plan.is_popular,
      category: {
        id: plan.category.id,
        name: plan.category.name,
        slug: plan.category.slug,
      },
      features: plan.features.map((f) => ({ id: f.id, title: f.title })),

      // ── SIM & setup ──
      simType: "esim",
      setupType: setupChoice, // "new-sim" | "keep-number"

      // ── Device info ──
      imei: imei.trim(),
      device: compatResult?.device ?? null,
      manufacturer: compatResult?.manufacturer ?? null,
      lteCompatible: compatResult?.lteCompatible ?? null,
      fiveGCompatible: compatResult?.fiveGCompatible ?? null,
      esimCompatible: compatResult?.esimCompatible ?? null,

      // ── Meta ──
      timestamp: Date.now(),
    };
    saveToCart(checkoutData);
    onClose();
    // router.push("/checkout");
    window.location.href = "/checkout";
  };

  const handlePsimContinue = () => {
    const checkoutData = {
      // ── Plan core identifiers ──
      planId: plan.id,
      bqPlanID: plan.bqPlanID,
      planSlug: plan.slug,
      planName: plan.name,

      // ── Plan pricing ──
      price: plan.price,
      salePrice: plan.sale_price,
      price24: plan.price_24,
      finalPrice: plan.final_price,
      durationDays: plan.duration_days,

      // ── Plan meta ──
      shortDescription: plan.short_description,
      isPopular: plan.is_popular,
      category: {
        id: plan.category.id,
        name: plan.category.name,
        slug: plan.category.slug,
      },
      features: plan.features.map((f) => ({ id: f.id, title: f.title })),

      // ── SIM & setup ──
      simType: "psim",
      setupType: setupChoice,

      // ── Device info (not applicable for pSIM) ──
      imei: null,
      device: null,
      manufacturer: null,
      lteCompatible: null,
      fiveGCompatible: null,
      esimCompatible: null,

      // ── Meta ──
      timestamp: Date.now(),
    };
    saveToCart(checkoutData);
    onClose();
    window.location.href = "/checkout";
  };

  // Appends item to cart array — never overwrites existing plans
  const saveToCart = (item: object) => {
    const existing = localStorage.getItem("driverx_checkout");
    const cart: object[] = existing ? JSON.parse(existing) : [];
    cart.push(item);
    localStorage.setItem("driverx_checkout", JSON.stringify(cart));
  };

  // ── Rendered steps ────────────────────────────────────────────────────────

  const renderStep = () => {
    // ── STEP 1: Choose Setup ──────────────────────────────────────────────────
    if (step === "choose-setup") {
      return (
        <>
          <StepIndicator currentStep={1} />
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white text-center mb-1">
            Get Started with Your Plan
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
            Choose how you'd like to set up your new mobile service
          </p>

          <div className="space-y-3 mb-8">
            {/* Get a New SIM */}
            <button
              onClick={() => setSetupChoice("new-sim")}
              className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 flex items-start gap-4 ${
                setupChoice === "new-sim"
                  ? "border-[#1a4a3f] bg-[#f0faf8] dark:bg-[#1a4a3f]/20"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 bg-white dark:bg-gray-700"
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <rect x="5" y="2" width="14" height="20" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 7h14M5 17h14" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">Get a New SIM</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">
                  Start fresh with a brand new phone number and SIM card
                </p>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Instant activation | New phone number | Quick setup
                </p>
              </div>
              <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                setupChoice === "new-sim" ? "border-[#1a4a3f] bg-[#1a4a3f]" : "border-gray-300"
              }`}>
                {setupChoice === "new-sim" && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </button>

            {/* Keep My Number */}
            <div
              onClick={() => setSetupChoice("keep-number")}
              className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 cursor-pointer ${
                setupChoice === "keep-number"
                  ? "border-[#1a4a3f] bg-[#f0faf8] dark:bg-[#1a4a3f]/20"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 bg-white dark:bg-gray-700"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">Keep My Number</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">
                    Transfer your existing phone number from another carrier
                  </p>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Keep your number | No interruption | Easy transfer
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  setupChoice === "keep-number" ? "border-[#1a4a3f] bg-[#1a4a3f]" : "border-gray-300"
                }`}>
                  {setupChoice === "keep-number" && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>

              {/* Inline MDN check — visible only when Keep My Number is selected */}
              {setupChoice === "keep-number" && (
                <div className="mt-4 border-t border-[#1a4a3f]/20 pt-4" onClick={(e) => e.stopPropagation()}>
                  <p className="text-sm font-bold text-gray-800 dark:text-white mb-3">Check If Eligible to Port</p>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={mdn}
                      onChange={(e) => setMdn(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleCheckMdn(); }}
                      placeholder="Enter your mdn/MSISDN number"
                      className={`flex-1 px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-gray-700 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a8a76] transition ${
                        mdnError ? "border-red-400" : "border-gray-200 dark:border-gray-500"
                      }`}
                    />
                    <button
                      onClick={handleCheckMdn}
                      disabled={mdnChecking}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-colors whitespace-nowrap"
                    >
                      {mdnChecking ? (
                        <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Checking…</>
                      ) : "Check My number"}
                    </button>
                  </div>
                  {mdnError && <p className="text-red-500 text-xs mt-1.5">{mdnError}</p>}
                  {mdnEligible === true && (
                    <div className="mt-3 flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-xl px-3 py-2">
                      <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <p className="text-xs font-semibold text-green-800 dark:text-green-400">Your number is eligible to port!</p>
                    </div>
                  )}
                  {mdnEligible === false && (
                    <div className="mt-3 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl px-3 py-2">
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      <p className="text-xs font-semibold text-red-700 dark:text-red-400">This number is not eligible to port. Please contact support.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold text-sm hover:border-gray-300 transition-colors"
            >
              Cancel
            </button>
            {setupChoice === "new-sim" && (
              <button
                onClick={handleSetupContinue}
                className="flex items-center gap-2 px-7 py-2.5 bg-[#1a4a3f] hover:bg-[#133830] text-white font-semibold text-sm rounded-full transition-colors duration-200"
              >
                Continue
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            {setupChoice === "keep-number" && mdnEligible === true && (
              <button
                onClick={() => setStep("port-form")}
                className="flex items-center gap-2 px-7 py-2.5 bg-[#1a4a3f] hover:bg-[#133830] text-white font-semibold text-sm rounded-full transition-colors duration-200"
              >
                Continue
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </>
      );
    }

    // ── STEP 2: Choose SIM Type (after "Get New SIM") ──────────────────────
    if (step === "choose-sim-type") {
      return (
        <>
          <StepIndicator currentStep={2} />
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white text-center mb-1">
            Get Started with Your Plan
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
            Choose how you'd like to set up your new mobile service
          </p>

          <div className="space-y-3 mb-8">
            {/* eSIM */}
            <button
              onClick={() => handleSimTypeSelect("esim")}
              className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 flex items-start gap-4 ${
                simChoice === "esim"
                  ? "border-[#1a4a3f] bg-[#f0faf8] dark:bg-[#1a4a3f]/20"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 bg-white dark:bg-gray-700"
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-[#e6f4f1] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-6 h-6 text-[#1a8a76]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">eSIM</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">
                  Digital SIM built into your phone - no physical card needed
                </p>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Instant activation | No waiting for delivery | Can't be lost or damaged
                </p>
              </div>
              <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                simChoice === "esim" ? "border-[#1a4a3f] bg-[#1a4a3f]" : "border-gray-300"
              }`}>
                {simChoice === "esim" && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>

            {/* pSIM */}
            <button
              onClick={() => { setSimChoice("psim"); setStep("choose-sim-type"); }}
              className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 flex items-start gap-4 ${
                simChoice === "psim"
                  ? "border-[#1a4a3f] bg-[#f0faf8] dark:bg-[#1a4a3f]/20"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 bg-white dark:bg-gray-700"
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-[#e6f4f1] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-6 h-6 text-[#1a8a76]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V8l-5-5H9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v5h11" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">pSIM</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">
                  Traditional SIM card that you insert into your phone
                </p>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Works with all phones | Easy to transfer between devices | Familiar and reliable
                </p>
                <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-3 py-2">
                  <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    <span className="font-bold">Delivery charges apply.</span> Your SIM will be delivered in 2-3 business days
                  </p>
                </div>
              </div>
              <div className={`ml-2 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                simChoice === "psim" ? "border-[#1a4a3f] bg-[#1a4a3f]" : "border-gray-300"
              }`}>
                {simChoice === "psim" && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => { setStep("choose-setup"); setSimChoice("esim"); }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold text-sm hover:border-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            {simChoice === "psim" && (
              <button
                onClick={handlePsimContinue}
                className="flex items-center gap-2 px-7 py-2.5 bg-[#1a4a3f] hover:bg-[#133830] text-white font-semibold text-sm rounded-full transition-colors duration-200"
              >
                Continue to Checkout
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </>
      );
    }

    // ── STEP 2b: eSIM – Check Device Compatibility ────────────────────────────
    if (step === "esim-check") {
      return (
        <>
          <StepIndicator currentStep={2} />
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white text-center mb-1">
            Get Started with Your Plan
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
            Choose how you'd like to set up your new mobile service
          </p>

          <div className="space-y-3 mb-4">
            {/* eSIM selected card with IMEI input */}
            <div className="rounded-2xl border-2 border-[#1a4a3f] bg-[#f0faf8] dark:bg-[#1a4a3f]/20 p-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-11 h-11 rounded-xl bg-[#e6f4f1] flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#1a8a76]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">eSIM</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                    Digital SIM built into your phone - no physical card needed
                  </p>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Instant activation | No waiting for delivery | Can't be lost or damaged
                  </p>
                </div>
              </div>

              {/* IMEI Check */}
              <div className="border-t border-[#1a4a3f]/20 pt-4">
                <p className="text-sm font-bold text-gray-800 dark:text-white mb-3">Check If Phone is Compatible</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imei}
                    onChange={(e) => setImei(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleCheckDevice(); }}
                    placeholder="Enter your IMEI/MEID number"
                    className={`flex-1 px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-gray-700 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a8a76] transition ${
                      imeiError ? "border-red-400" : "border-gray-200 dark:border-gray-500"
                    }`}
                  />
                  <button
                    onClick={handleCheckDevice}
                    disabled={checking}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-colors whitespace-nowrap"
                  >
                    {checking ? (
                      <>
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Checking…
                      </>
                    ) : compatResult?.compatible ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Compatible
                      </>
                    ) : (
                      "Check My Device"
                    )}
                  </button>
                </div>
                {imeiError && <p className="text-red-500 text-xs mt-1.5">{imeiError}</p>}

                {/* Compatibility result */}
                {compatResult && (
                  <div className={`mt-3 rounded-xl p-3 text-sm ${
                    compatResult.compatible
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700"
                      : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700"
                  }`}>
                    {compatResult.compatible ? (
                      <>
                        <p className="font-bold text-green-800 dark:text-green-400 mb-1.5">
                          Great! Your device is compatible with our network.
                        </p>
                        <div className="space-y-0.5 text-green-900 dark:text-green-300 text-xs">
                          {compatResult.device && (
                            <p><span className="font-semibold">Device:</span> {compatResult.device}</p>
                          )}
                          {compatResult.manufacturer && (
                            <p><span className="font-semibold">Manufacturer:</span> {compatResult.manufacturer}</p>
                          )}
                          {compatResult.lteCompatible !== undefined && (
                            <p><span className="font-semibold">LTE Compatible:</span> {compatResult.lteCompatible ? "Yes" : "No"}</p>
                          )}
                          {compatResult.fiveGCompatible !== undefined && (
                            <p><span className="font-semibold">5G Compatible:</span> {compatResult.fiveGCompatible ? "Yes" : "No"}</p>
                          )}
                          {compatResult.esimCompatible !== undefined && (
                            <p><span className="font-semibold">eSIM Compatible:</span> {compatResult.esimCompatible ? "Yes" : "No"}</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <p className="text-red-700 dark:text-red-400 font-medium">
                        {compatResult.message || "Your device may not be compatible. Please contact support."}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* pSIM option (collapsed/secondary) */}
            <button
              onClick={() => { setSimChoice("psim"); setStep("choose-sim-type"); }}
              className="w-full text-left rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 bg-white dark:bg-gray-700 p-4 transition-all duration-200 flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-[#e6f4f1] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-6 h-6 text-[#1a8a76]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V8l-5-5H9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v5h11" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">pSIM</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">
                  Traditional SIM card that you insert into your phone
                </p>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Works with all phones | Easy to transfer between devices | Familiar and reliable
                </p>
                <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-3 py-2">
                  <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    <span className="font-bold">Delivery charges apply.</span> Your SIM will be delivered in 2-3 business days
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => { setStep("choose-sim-type"); setCompatResult(null); setImei(""); }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold text-sm hover:border-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            {compatResult?.compatible && (
              <button
                onClick={handleContinueToCheckout}
                className="flex items-center gap-2 px-7 py-2.5 bg-[#1a4a3f] hover:bg-[#133830] text-white font-semibold text-sm rounded-full transition-colors duration-200"
              >
                Continue to Checkout
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </>
      );
    }

    // ── STEP: Port Form (Keep My Number) ─────────────────────────────────────
    if (step === "port-form") {
      return (
        <>
          <StepIndicator currentStep={2} />
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white text-center mb-1">
            Port Your Number
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-5">
            Fill in your details to transfer your existing number
          </p>

          {/* Personal Details */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <PortField label="Full Name" name="fullName" placeholder="Enter your Full Name" value={portForm.fullName} error={portErrors.fullName} onChange={handlePortFormChange} />
            <PortField label="Mobile Number" name="mobileNumber" placeholder="(352) 449-0630" value={portForm.mobileNumber} error={portErrors.mobileNumber} onChange={handlePortFormChange} />
            <PortField label="Email Address" name="email" placeholder="Enter Your Email Address" value={portForm.email} error={portErrors.email} onChange={handlePortFormChange} />
            <PortField label="Zip Code" name="zipCode" placeholder="Enter ZIP Code" required={false} value={portForm.zipCode} error={portErrors.zipCode} onChange={handlePortFormChange} />
            <PortField label="Address Line 1" name="addressLine1" placeholder="Address Line 1" value={portForm.addressLine1} error={portErrors.addressLine1} onChange={handlePortFormChange} />
            <PortField label="Address Line 2" name="addressLine2" placeholder="Address Line 2" value={portForm.addressLine2} error={portErrors.addressLine2} onChange={handlePortFormChange} />
            <PortField label="City" name="city" placeholder="City" value={portForm.city} error={portErrors.city} onChange={handlePortFormChange} />
            <PortField label="State" name="state" placeholder="State" value={portForm.state} error={portErrors.state} onChange={handlePortFormChange} />
          </div>

          {/* Current Service Provider */}
          <p className="text-base font-extrabold text-gray-900 dark:text-white mb-3">
            Current Service Provider Details
          </p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <PortField label="Current Carrier Name" name="currentCarrierName" placeholder="Enter Carrier Name" value={portForm.currentCarrierName} error={portErrors.currentCarrierName} onChange={handlePortFormChange} />
            <PortField label="Current SIM Serial Number" name="currentSimSerial" placeholder="Enter 19 Digit SIM Serial Number" value={portForm.currentSimSerial} error={portErrors.currentSimSerial} onChange={handlePortFormChange} />
            <PortField label="Current OSP Account Number" name="currentOspAccountNumber" placeholder="Enter Account Number" value={portForm.currentOspAccountNumber} error={portErrors.currentOspAccountNumber} onChange={handlePortFormChange} />
            <PortField label="OSP Account PIN/Password" name="ospAccountPin" placeholder="Enter PIN" value={portForm.ospAccountPin} error={portErrors.ospAccountPin} onChange={handlePortFormChange} />
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setStep("choose-setup")}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold text-sm hover:border-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <button
              onClick={handlePortFormContinue}
              className="flex items-center gap-2 px-7 py-2.5 bg-[#1a4a3f] hover:bg-[#133830] text-white font-semibold text-sm rounded-full transition-colors duration-200"
            >
              Continue to Checkout
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-modal-in">
        {/* Top accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1a8a76] via-[#37C4A0] to-[#1a4a3f] rounded-t-3xl" />

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors z-10"
        >
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-6 pt-6 pb-7">
          {renderStep()}
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in { animation: modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>
    </div>
  );
};

// ── Enquiry Modal ──────────────────────────────────────────────────────────────

interface EnquiryModalProps {
  plan: Plan;
  onClose: () => void;
}

const EnquiryModal = ({ plan, onClose }: EnquiryModalProps) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const validate = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.name.trim()) newErrors.name = "Full name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\+?[\d\s\-().]{7,15}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid phone number.";
    }
    if (!form.message.trim()) newErrors.message = "Message is required.";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof form]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-modal-in">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1a8a76] via-[#37C4A0] to-[#1a4a3f] rounded-t-3xl" />
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 transition-colors">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="px-7 pt-6 pb-8">
          {submitted ? (
            <div className="flex flex-col items-center text-center py-8 gap-4">
              <div className="w-16 h-16 rounded-full bg-[#e6f4f1] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#1a8a76]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Enquiry Sent!</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Thanks for your interest in the <span className="font-semibold text-[#1a8a76]">{plan.name}</span> plan. Our team will get back to you shortly.
              </p>
              <button onClick={onClose} className="mt-2 bg-[#1a8a76] hover:bg-[#157a68] text-white font-semibold py-2.5 px-8 rounded-full transition-colors">Done</button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#1a8a76] mb-1">Plan Enquiry</p>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  Enquire about <span className="text-[#1a8a76]">{plan.name}</span>
                </h3>
                {plan.short_description && (
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{plan.short_description}</p>
                )}
              </div>
              <div className="space-y-4">
                {(["name", "email", "phone"] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 capitalize">
                      {field === "name" ? "Full Name" : field === "email" ? "Email Address" : "Phone Number"} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      placeholder={field === "name" ? "John Smith" : field === "email" ? "john@example.com" : "+1 (555) 000-0000"}
                      className={`w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a8a76] transition ${errors[field] ? "border-red-400 focus:ring-red-400" : "border-gray-200 dark:border-gray-700"}`}
                    />
                    {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us what you'd like to know about this plan..."
                    className={`w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a8a76] transition resize-none ${errors.message ? "border-red-400 focus:ring-red-400" : "border-gray-200 dark:border-gray-700"}`}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-6 w-full bg-[#1a8a76] hover:bg-[#157a68] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Sending…</>
                ) : "Send Enquiry"}
              </button>
            </>
          )}
        </div>
      </div>
      <style>{`
        @keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-modal-in { animation: modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>
    </div>
  );
};

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

        <div className="h-px md:h-auto md:w-px bg-gray-200 mx-4 md:mx-0 md:my-5 flex-shrink-0" />

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
            onClick={() => plan.final_price === 0 ? onEnquire(plan) : onBuy(plan)}
            className={`font-semibold py-2.5 px-5 rounded-full transition-colors duration-200 text-sm whitespace-nowrap ${
              plan.final_price === 0
                ? "bg-white dark:bg-gray-700 border-2 border-[#1a8a76] text-[#1a8a76] hover:bg-[#f0faf8]"
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

// ── Main Section ──────────────────────────────────────────────────────────────

export default function PlansSection({
  heading = "Choose a Plan that's right for you",
  subHeading = "Choose plan that works best for you, feel free to contact us",
}: AllPlansSectionProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("prepaid-plans");
  const [enquiryPlan, setEnquiryPlan] = useState<Plan | null>(null);
  const [buyPlan, setBuyPlan] = useState<Plan | null>(null);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_BASE_URL+"/api/plans/v1/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch plans");
        return res.json();
      })
      .then((data) => { setPlans(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  const filteredPlans = plans
    .filter((p) => p.category?.slug === activeTab && p.is_active)
    .sort((a, b) => {
      if (a.final_price === 0 && b.final_price !== 0) return 1;
      if (a.final_price !== 0 && b.final_price === 0) return -1;
      return a.final_price - b.final_price;
    });

  const availableTabs = CATEGORY_TABS.filter((tab) =>
    plans.some((p) => p.category?.slug === tab.slug && p.is_active)
  );

  return (
    <section className="bg-[#f5f7f6] dark:bg-gray-800 min-h-screen py-16 px-4 overflow-x-hidden w-full">
      <div className="max-w-6xl xl:max-w-6xl lg:max-w-4xl mx-auto w-full overflow-hidden">

        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold dark:text-white text-gray-900 mb-2">{heading}</h2>
          <p className="text-gray-500 text-sm sm:text-base dark:text-gray-400">{subHeading}</p>
        </div>

        {/* Tabs */}
        <div className="mb-10">
          <div className="grid grid-cols-2 gap-3 sm:hidden">
            {availableTabs.map((tab) => {
              const isActive = activeTab === tab.slug;
              return (
                <button
                  key={tab.slug}
                  onClick={() => setActiveTab(tab.slug)}
                  className={`relative flex flex-col items-center justify-center gap-1.5 py-4 px-3 rounded-2xl font-semibold text-sm transition-all duration-200 border-2 ${
                    isActive
                      ? "bg-[#1a4a3f] dark:bg-gray-600 dark:text-gray-900 text-white border-[#1a4a3f] shadow-lg scale-[1.02]"
                      : "bg-white dark:bg-gray-700 dark:text-gray-100 text-gray-200 border-gray-200 hover:border-[#1a4a3f] hover:text-[#1a4a3f]"
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-[#1a8a76]"}>{TAB_ICONS[tab.slug]}</span>
                  <span className="leading-tight text-center">{tab.label}</span>
                  {isActive && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#4ecdb4]" />}
                </button>
              );
            })}
          </div>
          <div className="hidden sm:flex justify-center">
            <div className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-full px-2 py-2 flex gap-2 shadow-md w-full max-w-2xl">
              {availableTabs.map((tab) => (
                <button
                  key={tab.slug}
                  onClick={() => setActiveTab(tab.slug)}
                  className={`flex-1 py-2.5 md:py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-200 whitespace-nowrap text-center ${
                    activeTab === tab.slug
                      ? "bg-[#1a4a3f] dark:bg-[#37C4A0] dark:text-gray-800 text-white shadow-md"
                      : "bg-transparent text-gray-900 dark:text-gray-300 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-[#1a8a76] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {error && <div className="text-center py-16 text-red-500 font-medium">{error}</div>}
        {!loading && !error && (
          <div className="space-y-4">
            {filteredPlans.length === 0 ? (
              <p className="text-center text-gray-400 py-16">No plans available in this category.</p>
            ) : (
              filteredPlans.map((plan) => (
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

      {/* Buy Plan Modal */}
      {buyPlan && (
        <BuyPlanModal plan={buyPlan} onClose={() => setBuyPlan(null)} />
      )}

      {/* Enquiry Modal */}
      {enquiryPlan && (
        <EnquiryModal plan={enquiryPlan} onClose={() => setEnquiryPlan(null)} />
      )}
    </section>
  );
}