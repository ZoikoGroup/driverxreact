"use client";

import { useEffect, useState, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// ── Replace these with your actual imports ────────────────────────────────────
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import HeadBar from "../components/HeadBar";
// import { usStates } from "../utils/usStates";
// import { processOrderZift } from "../utils/beQuickApi";
// import { processOrderStripe } from "../utils/beQuickStripeWebPaymentApi";
// import StripePaymentForm from "../components/StripePaymentForm";

// ── Stub data for standalone compilation ──────────────────────────────────────
const usStates = [
  { code: "AL", name: "Alabama" },
  { code: "CA", name: "California" },
  { code: "NY", name: "New York" },
  { code: "TX", name: "Texas" },
];
const processOrderZift = async (data: unknown) => ({ status: true, data });
const processOrderStripe = async (data: unknown) => ({ status: true, data });

// ─────────────────────────────────────────────────────────────────────────────

const ACTIVATION_FEE_PER_ESIM = 13.99;

// ── Types ─────────────────────────────────────────────────────────────────────

interface Feature { id: string | number; title: string }

interface CartItem {
  planId: string | number | null;
  planSlug: string | null;
  planTitle: string;
  planPrice: number;
  planDuration: string;
  lineType: string;
  simType: string;
  planType?: string;
  type?: string;
  qty?: number;
  formData: {
    priceQty: number;
    price: number;
  };
  _raw?: unknown;
}

interface Address {
  firstName: string;
  lastName: string;
  companyName: string;
  region: string;
  state: string;
  city: string;
  street: string;
  houseNumber: string;
  zip: string;
  phone: string;
  email: string;
}

interface CardAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  region: string;
  phone: string;
}

interface CardDetails {
  cardNumber: string;
  expiry: string;
  cvc: string;
}

interface DiscountData {
  type: "percentage" | "flat";
  discount: string | number;
}

interface ShippingOption {
  label: string;
  value: number;
}

interface FormErrors {
  [key: string]: string;
}

// ── Small reusable components ─────────────────────────────────────────────────

const InputField = ({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const inputClass = (error?: string) =>
  `w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors
   focus:ring-2 focus:ring-red-300 focus:border-red-400
   ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`;

const selectClass = (error?: string) =>
  `w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors
   focus:ring-2 focus:ring-red-300 focus:border-red-400
   ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`;

// ── Address Form ──────────────────────────────────────────────────────────────

const billingFieldMeta: Record<string, { label: string; placeholder: string; disabled?: boolean }> = {
  firstName:   { label: "First Name",       placeholder: "Enter your first name" },
  lastName:    { label: "Last Name",        placeholder: "Enter your last name" },
  companyName: { label: "Company Name",     placeholder: "Company name (optional)" },
  region:      { label: "Country / Region", placeholder: "United States (US)", disabled: true },
  state:       { label: "State",            placeholder: "Select state" },
  city:        { label: "City",             placeholder: "Enter your city" },
  street:      { label: "Street Address",   placeholder: "Enter your street address" },
  houseNumber: { label: "Apt / Suite",      placeholder: "Apartment or suite" },
  zip:         { label: "ZIP Code",         placeholder: "Enter ZIP code" },
  phone:       { label: "Phone Number",     placeholder: "Enter phone number" },
  email:       { label: "Email Address",    placeholder: "Enter email address" },
};

const requiredBillingFields = ["firstName","lastName","state","city","houseNumber","zip","email","phone"];

const AddressForm = ({
  address,
  setAddress,
  prefix,
  errors,
  loading,
  includeShipping = false,
}: {
  address: Address;
  setAddress: (a: Address) => void;
  prefix: string;
  errors: FormErrors;
  loading: boolean;
  includeShipping?: boolean;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {(Object.keys(address) as Array<keyof Address>).map((key) => {
      const meta = billingFieldMeta[key] || { label: key, placeholder: key };
      const errKey = `${prefix}${key.charAt(0).toUpperCase() + key.slice(1)}`;
      const isRequired = requiredBillingFields.includes(key) ||
        (includeShipping && ["firstName","lastName","state","city","houseNumber","zip","email"].includes(key));

      return (
        <InputField key={key} label={meta.label} required={isRequired} error={errors[errKey]}>
          {key === "state" ? (
            <select
              className={selectClass(errors[errKey])}
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              disabled={loading}
            >
              <option value="">Select state</option>
              {usStates.map((s) => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              className={inputClass(errors[errKey])}
              placeholder={meta.placeholder}
              value={address[key]}
              disabled={meta.disabled || loading}
              onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
            />
          )}
        </InputField>
      );
    })}
  </div>
);

// ── Card Address Form ─────────────────────────────────────────────────────────

const cardAddressRequiredFields = ["firstName","lastName","state","city","zip"];

const CardAddressForm = ({
  address,
  setAddress,
  errors,
  loading,
}: {
  address: CardAddress;
  setAddress: (a: CardAddress) => void;
  errors: FormErrors;
  loading: boolean;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {(Object.keys(address) as Array<keyof CardAddress>).map((key) => {
      const meta = billingFieldMeta[key] || { label: key, placeholder: key };
      const errKey = `card${key.charAt(0).toUpperCase() + key.slice(1)}`;
      const isRequired = cardAddressRequiredFields.includes(key);
      return (
        <InputField key={key} label={meta.label} required={isRequired} error={errors[errKey]}>
          {key === "state" ? (
            <select
              className={selectClass(errors[errKey])}
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              disabled={loading}
            >
              <option value="">Select state</option>
              {usStates.map((s) => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              className={inputClass(errors[errKey])}
              placeholder={meta.placeholder}
              value={address[key]}
              disabled={meta.disabled || loading}
              onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
            />
          )}
        </InputField>
      );
    })}
  </div>
);

// ── Modal ─────────────────────────────────────────────────────────────────────

const Modal = ({
  show,
  onClose,
  title,
  children,
}: {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

  const [paymentMethod, setPaymentMethod] = useState<"zift" | "stripe">("zift");
  const [clientSecret, setClientSecret] = useState("");
  const stripeFormRef = useRef<{ submitPayment: () => Promise<{ success: boolean; error?: string }> }>(null);

  const shippingOptions: ShippingOption[] = [
    { label: "Standard (3–5 Days)", value: 9.99 },
    { label: "Expedited (2–3 Days)", value: 14.99 },
    { label: "Overnight", value: 24.99 },
  ];

  const [showThankYou, setShowThankYou]   = useState(false);
  const [cart, setCart]                   = useState<CartItem[]>([]);
  const [showShipping, setShowShipping]   = useState(false);
  const [coupon, setCoupon]               = useState("");
  const [loading, setLoading]             = useState(false);
  const [discountData, setDiscountData]   = useState<DiscountData | null>(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [showLoginPopup, setShowLoginPopup]   = useState(false);
  const [isLoggedIn, setIsLoggedIn]           = useState(false);
  const [agreeTerms, setAgreeTerms]           = useState(false);
  const [showTermsPopup, setShowTermsPopup]   = useState(false);
  const [shippingFee, setShippingFee]         = useState(0);
  const [selectedShippingOption, setSelectedShippingOption] = useState<ShippingOption>(shippingOptions[0]);

  const emptyAddress: Address = {
    firstName: "", lastName: "", companyName: "",
    region: "United States (US)", state: "", city: "",
    street: "", houseNumber: "", zip: "", phone: "", email: "",
  };

  const emptyCardAddress: CardAddress = {
    firstName: "", lastName: "", street: "",
    city: "", state: "", zip: "",
    region: "United States (US)", phone: "",
  };

  const [billingAddress, setBillingAddress]   = useState<Address>(emptyAddress);
  const [shippingAddress, setShippingAddress] = useState<Address>(emptyAddress);
  const [cardAddress, setCardAddress]         = useState<CardAddress>(emptyCardAddress);
  const [cardDetails, setCardDetails]         = useState<CardDetails>({ cardNumber: "", expiry: "", cvc: "" });
  const [sameAsBilling, setSameAsBilling]     = useState(false);
  const [errors, setErrors]                   = useState<FormErrors>({});

  const handleSameAsBilling = (checked: boolean) => {
    setSameAsBilling(checked);
    if (checked) {
      setCardAddress({
        firstName: billingAddress.firstName,
        lastName:  billingAddress.lastName,
        street:    billingAddress.street,
        city:      billingAddress.city,
        state:     billingAddress.state,
        zip:       billingAddress.zip,
        region:    billingAddress.region,
        phone:     billingAddress.phone,
      });
    } else {
      setCardAddress(emptyCardAddress);
    }
  };

  // Load cart
  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("driverx_checkout") ?? "[]") as unknown[];
      const normalized: CartItem[] = (storedCart ?? []).map((item: unknown) => {
        const i = item as Record<string, unknown>;
        if (i && (i.planId || i.planTitle)) return i as unknown as CartItem;
        const numericPrice = (() => {
          if (!i) return 0;
          if (typeof i.price === "number") return i.price;
          if (typeof i.price === "string") {
            const n = parseFloat((i.price as string).replace(/[^0-9.-]+/g, ""));
            return Number.isFinite(n) ? n : 0;
          }
          return 0;
        })();
        return {
          planId:       (i.id ?? i.planId ?? null) as string | null,
          planSlug:     (i.slug ?? i.planSlug ?? null) as string | null,
          planTitle:    (i.name ?? i.planTitle ?? i.title ?? i.slug ?? "") as string,
          planPrice:    numericPrice,
          planDuration: (i.planDuration ?? "1") as string,
          lineType:     (i.lineType ?? "device") as string,
          simType:      (i.simType ?? "N/A") as string,
          formData: {
            priceQty: Number(i.qty ?? (i.formData && (i.formData as Record<string,unknown>).priceQty) ?? 1),
            price: Number((i.formData && (i.formData as Record<string,unknown>).price) ?? numericPrice),
          },
          _raw: i,
        } as CartItem;
      });
      setCart(normalized);
      if (typeof window !== "undefined" && localStorage.getItem("zoiko_token")) {
        setIsLoggedIn(true);
      }
    } catch {
      setCart([]);
    }
  }, []);

  const hasShippingItem = cart.some((item) => item.type === "device" || item.simType === "pSIM");
  const prepaidEsimItems = cart.filter((item) => item.planType === "prepaid-plans");
  const activationFeeTotal = prepaidEsimItems.reduce((acc, item) => {
    const qty = Number(item.formData?.priceQty ?? item.qty ?? 1);
    return acc + ACTIVATION_FEE_PER_ESIM * qty;
  }, 0);

  const handleQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    const curQty = Number(newCart[index].formData?.priceQty || 1);
    newCart[index].formData = { ...newCart[index].formData, priceQty: Math.max(1, curQty + delta) };
    setCart(newCart);
    localStorage.setItem("driverx_checkout", JSON.stringify(newCart));
  };

  const handleRemove = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem("driverx_checkout", JSON.stringify(newCart));
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem("driverx_checkout");
  };

  const handleApplyCoupon = async () => {
    const user = JSON.parse(localStorage.getItem("user") ?? "null");
    if (!user) { setShowLoginPopup(true); return; }
    if (!coupon) { setCouponMessage("Please enter a coupon code"); return; }
    setLoading(true);
    setCouponMessage("");
    try {
      const res = await fetch("https://zmapi.zoikomobile.co.uk/api/v1/apply-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.zoiko_token}` },
        body: JSON.stringify({ user_id: user.id, email: user.email, coupon_code: coupon }),
      });
      const data = await res.json();
      if (data.success) {
        setDiscountData(data.data);
        const num = parseFloat(data.data.discount);
        const clean = Number.isInteger(num) ? num.toString() : num.toFixed(2);
        setCouponMessage(`Coupon applied! Discount: ${data.data.type === "percentage" ? clean + "%" : "$" + clean + " flat"}`);
      } else {
        setDiscountData(null);
        setCouponMessage(data.message || "Invalid coupon code");
      }
    } catch {
      setDiscountData(null);
      setCouponMessage("Something went wrong, please try again.");
    }
    setLoading(false);
  };

  const handleCancelCoupon = () => {
    setCoupon("");
    setDiscountData(null);
    setCouponMessage("Coupon cancelled.");
  };

  const subtotal = cart.reduce((acc, item) => {
    const price = Number(item.planPrice ?? item.formData?.price ?? 0);
    const qty   = Number(item.formData?.priceQty ?? 1);
    return acc + price * qty;
  }, 0);

  const discountAmount = discountData
    ? discountData.type === "percentage"
      ? (subtotal * Number(discountData.discount)) / 100
      : Number(discountData.discount)
    : 0;

  useEffect(() => {
    setShippingFee(hasShippingItem ? selectedShippingOption.value : 0);
  }, [selectedShippingOption, hasShippingItem]);

  const total = Math.max(subtotal + shippingFee + activationFeeTotal - discountAmount, 0);

  // Create payment intent
  useEffect(() => {
    if (total > 0 && cart.length > 0) {
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          currency: "usd",
          metadata: { cartItems: cart.length, subtotal: subtotal.toFixed(2), shipping: shippingFee.toFixed(2) },
        }),
      })
        .then((r) => r.json())
        .then((d) => { if (d.clientSecret) setClientSecret(d.clientSecret); })
        .catch(() => {});
    }
  }, [total, cart.length]);

  const validateFields = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRx = /^[0-9]{7,15}$/;

    newErrors.billingFirstName   = billingAddress.firstName  ? "" : "Required";
    newErrors.billingLastName    = billingAddress.lastName   ? "" : "Required";
    newErrors.billingState       = billingAddress.state      ? "" : "Required";
    newErrors.billingCity        = billingAddress.city       ? "" : "Required";
    newErrors.billingHouseNumber = billingAddress.houseNumber ? "" : "Required";
    newErrors.billingZip         = billingAddress.zip        ? "" : "Required";
    newErrors.billingEmail       = emailRx.test(billingAddress.email) ? "" : "Invalid email";
    newErrors.billingPhone       = phoneRx.test(billingAddress.phone) ? "" : "Invalid phone";

    if (showShipping) {
      newErrors.shippingFirstName   = shippingAddress.firstName   ? "" : "Required";
      newErrors.shippingLastName    = shippingAddress.lastName    ? "" : "Required";
      newErrors.shippingState       = shippingAddress.state       ? "" : "Required";
      newErrors.shippingCity        = shippingAddress.city        ? "" : "Required";
      newErrors.shippingHouseNumber = shippingAddress.houseNumber ? "" : "Required";
      newErrors.shippingZip         = shippingAddress.zip         ? "" : "Required";
      newErrors.shippingEmail       = emailRx.test(shippingAddress.email) ? "" : "Invalid email";
      newErrors.shippingPhone       = phoneRx.test(shippingAddress.phone) ? "" : "Invalid phone";
    }

    newErrors.cardFirstName = cardAddress.firstName ? "" : "Required";
    newErrors.cardLastName  = cardAddress.lastName  ? "" : "Required";
    newErrors.cardState     = cardAddress.state     ? "" : "Required";
    newErrors.cardCity      = cardAddress.city      ? "" : "Required";
    newErrors.cardZip       = cardAddress.zip       ? "" : "Required";

    const cardRx   = /^[0-9]{13,19}$/;
    const expiryRx = /^(0[1-9]|1[0-2])\s*\/\s*([0-9]{2})$/;
    const cvcRx    = /^[0-9]{3,4}$/;

    newErrors.cardNumber = cardRx.test(cardDetails.cardNumber.replace(/\s+/g, ""))   ? "" : "Invalid card number";
    newErrors.cardExpiry = expiryRx.test(cardDetails.expiry.replace(/\s+/g, ""))    ? "" : "Invalid expiry (MM/YY)";
    newErrors.cardCvc    = cvcRx.test(cardDetails.cvc.trim())                        ? "" : "Invalid CVC";

    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e.length > 0);
  };

  const validateFieldsStripe = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRx = /^[0-9]{7,15}$/;
    newErrors.billingFirstName   = billingAddress.firstName  ? "" : "Required";
    newErrors.billingLastName    = billingAddress.lastName   ? "" : "Required";
    newErrors.billingState       = billingAddress.state      ? "" : "Required";
    newErrors.billingCity        = billingAddress.city       ? "" : "Required";
    newErrors.billingHouseNumber = billingAddress.houseNumber ? "" : "Required";
    newErrors.billingZip         = billingAddress.zip        ? "" : "Required";
    newErrors.billingEmail       = emailRx.test(billingAddress.email) ? "" : "Invalid email";
    newErrors.billingPhone       = phoneRx.test(billingAddress.phone) ? "" : "Invalid phone";
    if (showShipping) {
      newErrors.shippingFirstName   = shippingAddress.firstName   ? "" : "Required";
      newErrors.shippingLastName    = shippingAddress.lastName    ? "" : "Required";
      newErrors.shippingState       = shippingAddress.state       ? "" : "Required";
      newErrors.shippingCity        = shippingAddress.city        ? "" : "Required";
      newErrors.shippingHouseNumber = shippingAddress.houseNumber ? "" : "Required";
      newErrors.shippingZip         = shippingAddress.zip         ? "" : "Required";
      newErrors.shippingEmail       = emailRx.test(shippingAddress.email) ? "" : "Invalid email";
      newErrors.shippingPhone       = phoneRx.test(shippingAddress.phone) ? "" : "Invalid phone";
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e.length > 0);
  };

  const handlePlaceOrderZift = async () => {
    if (!agreeTerms) { setShowTermsPopup(true); return; }
    if (!validateFields()) return;

    const products = cart.map((item) => ({
      id:          item.planId,
      title:       item.planTitle,
      slug:        item.planSlug,
      duration:    item.planDuration,
      lineType:    item.lineType,
      simType:     item.simType,
      quantity:    Number(item.formData?.priceQty ?? 1),
      pricePerUnit: Number(item.planPrice ?? item.formData?.price ?? 0),
      totalPrice:  Number(item.planPrice ?? item.formData?.price ?? 0) * Number(item.formData?.priceQty ?? 1),
    }));

    const subtotalLocal      = products.reduce((s, p) => s + p.totalPrice, 0);
    const discountLocal      = discountData
      ? discountData.type === "percentage"
        ? (subtotalLocal * Number(discountData.discount)) / 100
        : Number(discountData.discount)
      : 0;
    const shippingLocal      = hasShippingItem ? selectedShippingOption.value : 0;
    const activationLocal    = prepaidEsimItems.length * ACTIVATION_FEE_PER_ESIM;
    const totalLocal         = Math.max(subtotalLocal + shippingLocal + activationLocal - discountLocal, 0);

    const orderData = {
      billingAddress, shippingAddress: showShipping ? shippingAddress : billingAddress,
      shippingOption: hasShippingItem ? { ...selectedShippingOption } : null,
      cardAddress: { ...cardAddress }, cardDetails: { ...cardDetails },
      coupon: discountData ? { ...discountData } : null, cart,
      totals: { subtotal: subtotalLocal, shipping: shippingLocal, activationFee: activationLocal, discount: discountLocal, total: totalLocal },
      agreedToTerms: agreeTerms, createdAt: new Date().toISOString(),
    };

    try {
      setLoading(true);
      const response = await processOrderZift(orderData);
      const payload  = (response as Record<string, unknown>).data ?? response;

      try {
        await fetch("https://zmapi.zoikomobile.co.uk/api/v1/bqorders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch { /* non-fatal */ }

      const r = response as Record<string, unknown>;
      const success = r.status === true || r.status === "success" || r.status === 1 || r.success === true;
      if (success) {
        setShowThankYou(true);
        setCart([]);
        localStorage.removeItem("driverx_checkout");
      } else {
        alert((r.message as string) || "Failed to place order. Please try again.");
      }
    } catch {
      alert("Something went wrong while processing your order.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrderStripe = async () => {
    if (!agreeTerms) { setShowTermsPopup(true); return; }
    if (!validateFieldsStripe()) { alert("Please fill all required fields correctly"); return; }

    try {
      setLoading(true);
      if (stripeFormRef.current) {
        const result = await stripeFormRef.current.submitPayment();
        if (!result.success) { alert(result.error || "Payment failed"); return; }
      }
      const orderData = {
        billingAddress, shippingAddress: showShipping ? shippingAddress : billingAddress,
        shippingOption: hasShippingItem ? { ...selectedShippingOption } : null,
        coupon: discountData ? { ...discountData } : null, cart,
        totals: { subtotal, shipping: shippingFee, activationFee: activationFeeTotal, discount: discountAmount, total },
        agreedToTerms: agreeTerms, paymentMethod: "stripe", createdAt: new Date().toISOString(),
      };
      const response = await processOrderStripe(orderData);
      const payload  = (response as Record<string, unknown>).data ?? response;
      await fetch("https://zmapi.zoikomobile.co.uk/api/v1/bqorders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setShowThankYou(true);
      setCart([]);
      localStorage.removeItem("driverx_checkout");
    } catch {
      alert("Something went wrong while processing your order.");
    } finally {
      setLoading(false);
    }
  };

  const formatDiscount = (value: string | number) => {
    const n = parseFloat(String(value));
    return Number.isInteger(n) ? n.toString() : n.toFixed(2);
  };

  // ── Empty Cart ──────────────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-40 h-40 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <svg className="w-20 h-20 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl">
          {[
            { href: "/prepaid-plans",  label: "Prepaid Plans" },
            { href: "/postpaid-plans", label: "Postpaid Plans" },
            { href: "/business-deals", label: "Business Deals" },
            { href: "/travel-plans",   label: "Travel Plans" },
          ].map((link) => (
            <a key={link.href} href={link.href}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    );
  }

  // ── Main Checkout ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="text-sm text-gray-500">Connecting Every Possibility with Zoiko Mobile!</p>
          </div>
          <button
            onClick={handleClearCart}
            disabled={loading}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Cart
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left Column ── */}
          <div className="flex-1 space-y-6">

            {/* Cart Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Your Items</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {cart.map((item, idx) => (
                  <div key={idx} className="px-6 py-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{item.planTitle}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Line: {item.lineType || "N/A"} · SIM: {item.simType || "N/A"}
                      </p>
                      {item.planType === "prepaid-plans" && (
                        <span className="inline-block mt-1.5 text-xs bg-amber-100 text-amber-700 font-semibold px-2.5 py-0.5 rounded-full">
                          + ${ACTIVATION_FEE_PER_ESIM.toFixed(2)} Activation Fee
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => handleQuantity(idx, -1)} disabled={loading}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-red-300 hover:text-red-500 transition-colors disabled:opacity-40">
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.formData?.priceQty ?? 1}</span>
                      <button onClick={() => handleQuantity(idx, 1)} disabled={loading}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-red-300 hover:text-red-500 transition-colors disabled:opacity-40">
                        +
                      </button>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-gray-900">
                        ${(Number(item.planPrice ?? item.formData?.price ?? 0) * Number(item.formData?.priceQty ?? 1)).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">${Number(item.planPrice ?? 0).toFixed(2)} / {item.planDuration}</p>
                    </div>
                    <button onClick={() => handleRemove(idx)} disabled={loading}
                      className="shrink-0 text-gray-300 hover:text-red-400 transition-colors disabled:opacity-40">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Have a Coupon?</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300"
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  disabled={loading}
                />
                <button onClick={handleApplyCoupon} disabled={loading}
                  className="px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-50">
                  {loading ? "Applying…" : "Apply"}
                </button>
                {discountData && (
                  <button onClick={handleCancelCoupon} disabled={loading}
                    className="px-4 py-2.5 rounded-lg border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50">
                    Remove
                  </button>
                )}
              </div>
              {couponMessage && (
                <p className={`mt-2 text-sm ${discountData ? "text-green-600" : "text-red-500"}`}>{couponMessage}</p>
              )}
              {!isLoggedIn && (
                <p className="mt-2 text-xs text-red-400">You need to be logged in to apply a coupon.</p>
              )}
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-5">Service / Billing Details</h2>
              <AddressForm
                address={billingAddress}
                setAddress={setBillingAddress}
                prefix="billing"
                errors={errors}
                loading={loading}
              />

              <label className="flex items-center gap-2.5 mt-5 cursor-pointer">
                <input type="checkbox" checked={showShipping}
                  onChange={(e) => setShowShipping(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 accent-red-500" />
                <span className="text-sm text-gray-700">Ship to a different address?</span>
              </label>

              {showShipping && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-4">Shipping Address</h3>
                  <AddressForm
                    address={shippingAddress}
                    setAddress={setShippingAddress}
                    prefix="shipping"
                    errors={errors}
                    loading={loading}
                    includeShipping
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="w-full lg:w-96 space-y-6">

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-2">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate pr-2">
                      {item.planTitle} ({item.simType}) × {item.formData?.priceQty ?? 1}
                    </span>
                    <span className="font-medium text-gray-900 shrink-0">
                      ${(Number(item.planPrice ?? item.formData?.price ?? 0) * Number(item.formData?.priceQty ?? 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {hasShippingItem && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Shipping Options</label>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300 mb-2"
                    value={selectedShippingOption.value}
                    onChange={(e) => {
                      const opt = shippingOptions.find((o) => o.value === parseFloat(e.target.value));
                      if (opt) setSelectedShippingOption(opt);
                    }}
                  >
                    {shippingOptions.map((o, i) => (
                      <option key={i} value={o.value}>{o.label} — ${o.value}</option>
                    ))}
                  </select>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium">${shippingFee.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {activationFeeTotal > 0 && (() => {
                const qty = prepaidEsimItems.reduce((a, i) => a + Number(i.formData?.priceQty ?? 1), 0);
                return (
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">Activation Fee{qty > 1 ? "s" : ""} ({qty} × ${ACTIVATION_FEE_PER_ESIM.toFixed(2)})</span>
                    <span className="font-medium text-green-600">+${activationFeeTotal.toFixed(2)}</span>
                  </div>
                );
              })()}

              {discountData && (
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">
                    Discount ({discountData.type === "percentage" ? formatDiscount(discountData.discount) + "%" : "$" + formatDiscount(discountData.discount)})
                  </span>
                  <span className="font-medium text-green-600">−${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-base mt-4 pt-4 border-t border-gray-100">
                <span>Total</span>
                <span className="text-red-500">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Payment Method</h2>

              <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-red-100 bg-red-50 cursor-pointer mb-4">
                <input type="radio" name="paymentMethod" checked={paymentMethod === "zift"}
                  onChange={() => setPaymentMethod("zift")} className="accent-red-500" />
                <span className="text-sm font-semibold text-gray-800">Credit / Debit Card</span>
              </label>

              {paymentMethod === "zift" && (
                <div className="space-y-4">
                  <InputField label="Card Number" required error={errors.cardNumber}>
                    <input
                      className={inputClass(errors.cardNumber)}
                      type="text" placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                      disabled={loading}
                    />
                  </InputField>

                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="Expiry Date" required error={errors.cardExpiry}>
                      <input
                        className={inputClass(errors.cardExpiry)}
                        type="text" placeholder="MM / YY"
                        value={cardDetails.expiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "");
                          if (v.length >= 3) v = v.slice(0, 2) + " / " + v.slice(2, 4);
                          setCardDetails({ ...cardDetails, expiry: v });
                        }}
                        disabled={loading}
                      />
                    </InputField>
                    <InputField label="CVC" required error={errors.cardCvc}>
                      <input
                        className={inputClass(errors.cardCvc)}
                        type="text" placeholder="CVC"
                        value={cardDetails.cvc}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                        disabled={loading}
                      />
                    </InputField>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm">Billing Address for Card</h3>
                    <label className="flex items-center gap-2.5 mb-4 cursor-pointer">
                      <input type="checkbox" checked={sameAsBilling}
                        onChange={(e) => handleSameAsBilling(e.target.checked)}
                        disabled={loading}
                        className="w-4 h-4 accent-red-500" />
                      <span className="text-sm text-gray-700">Same as Service / Billing Address</span>
                    </label>
                    <CardAddressForm
                      address={cardAddress}
                      setAddress={setCardAddress}
                      errors={errors}
                      loading={loading}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === "stripe" && clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe", variables: { colorPrimary: "#dc3545" } } }}>
                  {/* <StripePaymentForm ref={stripeFormRef} ... /> */}
                  <p className="text-sm text-gray-500 text-center py-4">Stripe form loads here</p>
                </Elements>
              )}

              <label className="flex items-start gap-2.5 mt-5 cursor-pointer">
                <input type="checkbox" checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 mt-0.5 accent-red-500" />
                <span className="text-sm text-gray-600">
                  I have read and agree to the website{" "}
                  <a href="/terms-and-conditions" className="text-red-500 hover:underline">terms and conditions</a>.
                </span>
              </label>

              <button
                onClick={paymentMethod === "stripe" ? handlePlaceOrderStripe : handlePlaceOrderZift}
                disabled={loading || (paymentMethod === "stripe" && !clientSecret)}
                className="w-full mt-5 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {paymentMethod === "stripe" ? "Processing with Stripe…" : "Placing order…"}
                  </>
                ) : paymentMethod === "stripe" ? "Place Order with Stripe" : "Place Your Order"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <Modal show={showLoginPopup} onClose={() => setShowLoginPopup(false)} title="Login Required">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-5 text-sm">You need to log in to apply a coupon code.</p>
          <a href={`/login?redirect=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "/")}`}
            className="block w-full py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors mb-2">
            Go to Login
          </a>
          <button onClick={() => setShowLoginPopup(false)}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
        </div>
      </Modal>

      <Modal show={showTermsPopup} onClose={() => setShowTermsPopup(false)} title="Terms & Conditions Required">
        <div className="text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-5 text-sm">
            You must agree to the{" "}
            <a href="/terms-and-conditions" className="text-red-500 hover:underline">terms and conditions</a>{" "}
            before placing your order.
          </p>
          <button onClick={() => setShowTermsPopup(false)}
            className="w-full py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors">
            OK, I understand
          </button>
        </div>
      </Modal>

      <Modal show={showThankYou} onClose={() => setShowThankYou(false)} title="Order Placed!">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-gray-500 text-sm mb-6">Your order has been placed successfully. A confirmation email has been sent with your order details.</p>
          <button onClick={() => { setShowThankYou(false); window.location.href = "/"; }}
            className="w-full py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-colors">
            Continue Shopping
          </button>
        </div>
      </Modal>
    </div>
  );
}