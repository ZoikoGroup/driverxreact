"use client";

import { useState, useEffect, Suspense, type SyntheticEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center px-4 py-10 dark:bg-gray-900 dark:text-white">
      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT */}
        <div className="w-full max-w-md mx-auto">

          {/* Back */}
          <Link href="/" className="text-sm text-gray-500 mb-4 inline-block dark:bg-gray-900 dark:text-white">
            ← Back to Site
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/images/Logo.svg.png"
              alt="DriverX Logo"
              width={140}
              height={40}
              priority
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:bg-gray-900 dark:text-white">
            Welcome back!
          </h1>

          <p className="text-gray-500 mb-6 text-sm dark:bg-gray-900 dark:text-white">
            Enter your credentials to access your account.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-sm font-medium  dark:text-white text-[#2d6a6a]">
                Username or Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Username or Email"
                className=" dark:bg-gray-800 dark:text-white w-full mt-1 px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-teal-600"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium  dark:text-white text-[#2d6a6a]">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm dark:text-teal-400 text-teal-600">
                  Forgot Password?
                </Link>
              </div>

              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="dark:bg-gray-800 dark:text-white w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 dark:bg-gray-800 dark:text-white text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    // Eye OFF
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-10-7a13.16 13.16 0 012.25-3.592M6.223 6.223A9.956 9.956 0 0112 5c5 0 9 4 10 7a13.16 13.16 0 01-4.043 5.192M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L3 3"
                      />
                    </svg>
                  ) : (
                    // Eye ON
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm text-gray-600  dark:text-white">
                Remember for 30 days
              </span>
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg dark:bg-teal-800 dark:text-white bg-[#2f6f66] text-white font-semibold hover:bg-teal-400"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

           {/* Social */}
<div className="space-y-3 mt-6">

  {/* Divider */}
  <div className="flex items-center gap-3">
    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
    <span className="text-xs text-gray-500 dark:text-gray-400">OR</span>
    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
  </div>

{/* Google */}
  <button
    type="button"
    onClick={() => signIn("google", { callbackUrl })}
    className="w-full flex items-center justify-center gap-3 py-3 rounded-xl
               border border-gray-300 dark:border-gray-700
               bg-white dark:bg-gray-800
               text-gray-700 dark:text-white font-medium
               hover:bg-gray-100 dark:hover:bg-gray-700
               transition shadow-sm hover:shadow-md"
  >
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.73 1.22 9.23 3.6l6.85-6.85C35.9 2.43 30.36 0 24 0 14.64 0 6.4 5.48 2.6 13.44l7.98 6.2C12.5 13.1 17.8 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24c0-1.6-.14-3.13-.4-4.6H24v9.2h12.7c-.55 2.96-2.2 5.46-4.7 7.13l7.28 5.67C43.96 37.2 46.5 31.1 46.5 24z"/>
      <path fill="#FBBC05" d="M10.58 28.36A14.5 14.5 0 019.5 24c0-1.52.26-2.98.72-4.36l-7.98-6.2A23.94 23.94 0 000 24c0 3.9.94 7.58 2.6 10.56l7.98-6.2z"/>
      <path fill="#34A853" d="M24 48c6.36 0 11.9-2.1 15.87-5.7l-7.28-5.67c-2.02 1.36-4.6 2.17-8.6 2.17-6.2 0-11.5-3.6-13.42-8.86l-7.98 6.2C6.4 42.52 14.64 48 24 48z"/>
    </svg>
    Continue with Google
  </button>
  {/* Facebook */}
  <button
    type="button"
    onClick={() => signIn("facebook", { callbackUrl })}
    className="w-full flex items-center justify-center gap-3 py-3 rounded-xl
               bg-[#1877F2] text-white font-medium
               hover:bg-[#166fe5] transition
               shadow-sm hover:shadow-md"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12.073C22 6.503 17.523 2 12 2S2 6.503 2 12.073c0 5.022 3.657 9.184 8.438 9.928v-7.026H7.898v-2.902h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.902h-2.33V22c4.78-.744 8.437-4.906 8.437-9.927z"/>
    </svg>
    Continue with Facebook
  </button>

  

</div>

            {/* Footer */}
            <p className="text-center text-sm dark:text-white text-gray-500 mt-4">
              Don't have an account?{" "}
              <Link href="/register" className="text-teal-700 dark:text-teal-400 font-semibold">
                Sign Up
              </Link>
            </p>

          </form>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden md:flex justify-end">
          <div className="relative w-[420px] h-[560px] rounded-3xl overflow-hidden shadow-lg">
            <Image
              src="/images/login-right-scaled.webp"
              alt="Login"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
