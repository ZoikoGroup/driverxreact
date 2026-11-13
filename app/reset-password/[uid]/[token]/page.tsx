"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthShell, {
  AuthAlert,
  AuthHeading,
  authInput,
  authLabel,
  authLink,
  authPrimaryBtn,
} from "../../../components/auth/AuthShell";

type PageProps = {
  params: Promise<{
    uid: string;
    token: string;
  }>;
};

export default function ResetPasswordPage({ params }: PageProps) {
  // ✅ REQUIRED FIX (unwrap params)
  const { uid, token } = use(params);

  const router = useRouter();

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accounts/reset-password/${uid}/${token}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password,
            password2,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (typeof data === "object") {
          const messages = Object.values(data).flat().join(" | ");
          throw new Error(messages || "Reset failed");
        }
        throw new Error("Reset failed");
      }

      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell activeTab="reset">
      <AuthHeading title="Reset password" subtitle="Choose a new password for your DriverXmobile account." />

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label htmlFor="rp-password" className={authLabel}>
            New password
          </label>
          <input
            id="rp-password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className={authInput}
          />
        </div>

        <div>
          <label htmlFor="rp-password2" className={authLabel}>
            Confirm new password
          </label>
          <input
            id="rp-password2"
            type="password"
            placeholder="Confirm new password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            autoComplete="new-password"
            className={authInput}
          />
        </div>

        {error && <AuthAlert type="error">{error}</AuthAlert>}
        {success && <AuthAlert type="success">{success}</AuthAlert>}

        <button type="submit" disabled={loading} className={authPrimaryBtn}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#1f2d3d] dark:text-gray-300">
        <Link href="/login" className={authLink}>
          Back to login
        </Link>
      </p>
    </AuthShell>
  );
}
