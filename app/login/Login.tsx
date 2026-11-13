"use client";

import { useState, useEffect, Suspense, type SyntheticEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthShell, {
  AuthAlert,
  AuthDivider,
  AuthHeading,
  ChevronRightIcon,
  FacebookIcon,
  GoogleIcon,
  PasswordToggle,
  authInput,
  authLabel,
  authLink,
  authPrimaryBtn,
  authSocialBtn,
} from "../components/auth/AuthShell";
import { signIn } from "next-auth/react";



function LoginPageContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect");
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const { data: session, status } = useSession();
  const router = useRouter();


  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
      return;
    }

    if (status === "unauthenticated" && typeof window !== "undefined") {
      const token = localStorage.getItem("driverx_token");
      if (token) router.push(callbackUrl);
    }
  }, [status, callbackUrl]);

  const handleLogin = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accounts/login/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const text = await res.text();
      let data: any;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server error. Check API URL.");
      }

      if (!res.ok) throw new Error(data?.message || "Invalid credentials");

      localStorage.setItem("driverx_token", data.token);
      localStorage.setItem("driverx_user", JSON.stringify(data.user));

      router.replace(redirect || "/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell activeTab="login">
      <AuthHeading title="Welcome back!" subtitle="Sign in to your DriverXmobile account." />

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="login-email" className={authLabel}>
            Email address
          </label>
          <input
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            autoComplete="username"
            className={authInput}
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="login-password" className={authLabel}>
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className={`${authInput} pr-11`}
            />
            <PasswordToggle shown={showPassword} onToggle={() => setShowPassword(!showPassword)} />
          </div>
        </div>

        {/* Remember + forgot */}
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-[13px] text-[#1f2d3d] dark:text-gray-300">
            <input type="checkbox" className="h-4 w-4 accent-[#2f8a80]" />
            Remember me for 30 days
          </label>
          <Link href="/forgot-password" className="text-[13px] text-[#2f8a80] hover:text-[#1f6b62]">
            Forgot password?
          </Link>
        </div>

        {error && <AuthAlert type="error">{error}</AuthAlert>}

        <button type="submit" disabled={loading} className={authPrimaryBtn}>
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <AuthDivider />

      <div className="space-y-3">
        <button type="button" onClick={() => signIn("google", { callbackUrl })} className={authSocialBtn}>
          <GoogleIcon className="h-5 w-5" />
          <span className="flex-1 text-left">Continue with Google</span>
          <ChevronRightIcon className="h-4 w-4 text-[#8a97a3]" />
        </button>
        <button type="button" onClick={() => signIn("facebook", { callbackUrl })} className={authSocialBtn}>
          <FacebookIcon className="h-5 w-5" />
          <span className="flex-1 text-left">Continue with Facebook</span>
          <ChevronRightIcon className="h-4 w-4 text-[#8a97a3]" />
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-[#1f2d3d] dark:text-gray-300">
        New to DriverXmobile?{" "}
        <Link href="/register" className={authLink}>
          Register
        </Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
