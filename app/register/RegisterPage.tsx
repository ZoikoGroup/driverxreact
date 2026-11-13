"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import AuthShell, {
  AuthAlert,
  AuthDivider,
  AuthHeading,
  ChevronRightIcon,
  FacebookIcon,
  GoogleIcon,
  PasswordToggle,
  authInput,
  authInputError,
  authLabel,
  authLink,
  authPrimaryBtn,
  authSocialBtn,
} from "../components/auth/AuthShell";
import Link from "next/link";
import { isLoggedIn } from "../utils/auth";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn()) {
      window.location.href = "/dashboard";
    }
  }, []);

  const validate = () => {
    const errors: any = {};
    if (!name.trim()) errors.name = "Name is required";
    if (!email.trim()) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    return errors;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (!agreedToTerms) {
      setError("Please agree to the terms & policy.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accounts/register/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Frontend-Origin": window.location.origin,
          },
          body: JSON.stringify({
            username: name.trim(),
            email: email.trim(),
            password,
            password2: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const msg =
          typeof data === "object"
            ? Object.values(data).flat().join(" | ")
            : data.message;
        throw new Error(msg || "Registration failed");
      }

      setSuccess(data.message || "Registration successful!");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell activeTab="register">
      <AuthHeading title="Get started now" subtitle="Create your DriverXmobile account in seconds." />

      <form onSubmit={handleRegister} noValidate className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="reg-name" className={authLabel}>
            Name
          </label>
          <input
            id="reg-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setFieldErrors(p => ({ ...p, name: undefined }));
            }}
            placeholder="Enter your name"
            autoComplete="name"
            className={fieldErrors.name ? authInputError : authInput}
          />
          {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="reg-email" className={authLabel}>
            Email address
          </label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors(p => ({ ...p, email: undefined }));
            }}
            placeholder="name@company.com"
            autoComplete="email"
            className={fieldErrors.email ? authInputError : authInput}
          />
          {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="reg-password" className={authLabel}>
            Password
          </label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErrors((p) => ({ ...p, password: undefined }));
              }}
              placeholder="Enter your password"
              autoComplete="new-password"
              className={`${fieldErrors.password ? authInputError : authInput} pr-11`}
            />
            <PasswordToggle shown={showPassword} onToggle={() => setShowPassword(!showPassword)} />
          </div>
          {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>}
        </div>

        {/* Terms */}
        <label className="flex items-center gap-2 text-[13px] text-[#1f2d3d] dark:text-gray-300">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="h-4 w-4 accent-[#2f8a80]"
          />
          <span>
            I agree to the{" "}
            <Link href="/privacy-policy" className="text-[#2f8a80] hover:text-[#1f6b62]">
              terms &amp; policy
            </Link>
          </span>
        </label>

        {error && <AuthAlert type="error">{error}</AuthAlert>}
        {success && <AuthAlert type="success">{success}</AuthAlert>}

        <button type="submit" disabled={loading} className={authPrimaryBtn}>
          {loading ? "Signing up..." : "Create account"}
        </button>
      </form>

      <AuthDivider />

      <div className="space-y-3">
        <button type="button" onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className={authSocialBtn}>
          <GoogleIcon className="h-5 w-5" />
          <span className="flex-1 text-left">Continue with Google</span>
          <ChevronRightIcon className="h-4 w-4 text-[#8a97a3]" />
        </button>
        <button type="button" onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })} className={authSocialBtn}>
          <FacebookIcon className="h-5 w-5" />
          <span className="flex-1 text-left">Continue with Facebook</span>
          <ChevronRightIcon className="h-4 w-4 text-[#8a97a3]" />
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-[#1f2d3d] dark:text-gray-300">
        Already have an account?{" "}
        <Link href="/login" className={authLink}>
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
