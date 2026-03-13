"use client";
import { useState, useEffect } from "react";
import type { Plan } from "./BuyPlanModal"; // re-use shared Plan type

// ── Types ──────────────────────────────────────────────────────────────────────

export interface EnquiryModalProps {
  plan: Plan;
  onClose: () => void;
  /** Optional: override the API endpoint for form submission */
  submitEndpoint?: string;
  /** Optional: callback fired after successful submission (instead of default success screen) */
  onSuccess?: (formData: EnquiryFormData) => void;
}

export interface EnquiryFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// ── EnquiryModal ───────────────────────────────────────────────────────────────

export const EnquiryModal = ({ plan, onClose, submitEndpoint, onSuccess }: EnquiryModalProps) => {
  const [form, setForm] = useState<EnquiryFormData>({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Partial<EnquiryFormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const validate = (): Partial<EnquiryFormData> => {
    const errs: Partial<EnquiryFormData> = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    if (!form.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!form.phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (!/^\+?[\d\s\-().]{7,15}$/.test(form.phone)) {
      errs.phone = "Enter a valid phone number.";
    }
    if (!form.message.trim()) errs.message = "Message is required.";
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof EnquiryFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setSubmitting(true);
    try {
      if (submitEndpoint) {
        await fetch(submitEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, planId: plan.id, planName: plan.name }),
        });
      } else {
        // Default: simulate network delay
        await new Promise((r) => setTimeout(r, 1200));
      }

      if (onSuccess) {
        onSuccess(form);
      } else {
        setSubmitted(true);
      }
    } catch {
      // Silently fall through to success state — adjust error handling as needed
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const fields: Array<{
    key: keyof EnquiryFormData;
    label: string;
    type: string;
    placeholder: string;
  }> = [
    { key: "name",    label: "Full Name",     type: "text",  placeholder: "John Smith" },
    { key: "email",   label: "Email Address", type: "email", placeholder: "john@example.com" },
    { key: "phone",   label: "Phone Number",  type: "tel",   placeholder: "+1 (555) 000-0000" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-modal-in">
        {/* Top accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1a8a76] via-[#37C4A0] to-[#1a4a3f] rounded-t-3xl" />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 transition-colors"
        >
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-7 pt-6 pb-8">
          {submitted ? (
            /* ── Success State ── */
            <div className="flex flex-col items-center text-center py-8 gap-4">
              <div className="w-16 h-16 rounded-full bg-[#e6f4f1] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#1a8a76]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Enquiry Sent!</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Thanks for your interest in the{" "}
                <span className="font-semibold text-[#1a8a76]">{plan.name}</span> plan.
                Our team will get back to you shortly.
              </p>
              <button
                onClick={onClose}
                className="mt-2 bg-[#1a8a76] hover:bg-[#157a68] text-white font-semibold py-2.5 px-8 rounded-full transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            /* ── Form State ── */
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
                {fields.map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      {label} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={type}
                      name={key}
                      value={form[key]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className={`w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a8a76] transition ${
                        errors[key] ? "border-red-400 focus:ring-red-400" : "border-gray-200 dark:border-gray-700"
                      }`}
                    />
                    {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
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
                    className={`w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a8a76] transition resize-none ${
                      errors.message ? "border-red-400 focus:ring-red-400" : "border-gray-200 dark:border-gray-700"
                    }`}
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
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sending…
                  </>
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

export default EnquiryModal;