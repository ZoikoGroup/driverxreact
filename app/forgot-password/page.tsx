"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { isLoggedIn } from "../utils/auth";
import AuthShell, {
  AuthAlert,
  AuthHeading,
  authInput,
  authLabel,
  authLink,
  authPrimaryBtn,
} from "../components/auth/AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 🔒 Block logged-in users
  useEffect(() => {
    if (isLoggedIn()) {
      window.location.href = "/my-account";
    }
  }, []);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accounts/forgot-password/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json",
                     "X-Frontend-Origin": window.location.origin, 
                    },
          body: JSON.stringify({ email: email.trim() }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (typeof data === "object") {
          const messages = Object.values(data).flat().join(" | ");
          throw new Error(messages || "Failed to send reset email");
        } else {
          throw new Error(data.message || "Failed to send reset email");
        }
      }

      setSuccess(
        data.message ||
          "Password reset link sent! Check your email for instructions."
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell activeTab="reset">
      <AuthHeading
        title="Forgot password?"
        subtitle="Enter your email and we'll send you a link to reset your password."
      />

      <form onSubmit={handleForgotPassword} className="space-y-4">
        <div>
          <label htmlFor="fp-email" className={authLabel}>
            Email address
          </label>
          <input
            id="fp-email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className={authInput}
          />
        </div>

        {error && <AuthAlert type="error">{error}</AuthAlert>}
        {success && <AuthAlert type="success">{success}</AuthAlert>}

        <button type="submit" disabled={loading} className={authPrimaryBtn}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#1f2d3d] dark:text-gray-300">
        Remembered your password?{" "}
        <Link href="/login" className={authLink}>
          Back to login
        </Link>
      </p>
    </AuthShell>
  );
}
