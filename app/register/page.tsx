"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
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
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center px-4 py-10 dark:bg-gray-900 dark:text-white">
      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT */}
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-3xl font-extrabold dark:bg-gray-900 dark:text-white text-gray-900 mb-8">
            Get Started Now
          </h1>

          <form onSubmit={handleRegister} noValidate>

            {/* Name */}
            <div className="mb-5">
              <label className="block text-sm font-medium mb-1  dark:text-teal-400 text-[#2d6a6a]">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFieldErrors(p => ({ ...p, name: undefined }));
                }}
                placeholder="Enter your name"
                className={`w-full px-4 py-3 rounded-lg text-sm outline-none transition dark:bg-gray-700 dark:text-white ${
                  fieldErrors.name
                    ? "border-2 border-red-400 bg-red-50"
                    : "border border-gray-200 bg-blue-50 focus:border-teal-500"
                }`}
              />
              {fieldErrors.name && (
                <p className="text-red-500 text-xs mt-1 ">{fieldErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="block text-sm font-medium mb-1 dark:text-teal-400 text-[#2d6a6a]">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFieldErrors(p => ({ ...p, email: undefined }));
                }}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-lg text-sm outline-none transition dark:bg-gray-700 dark:text-white ${
                  fieldErrors.email
                    ? "border-2 border-red-400 bg-red-50"
                    : "border border-gray-200 bg-blue-50 focus:border-teal-500"
                }`}
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
           <div className="mb-6">
  <label className="block text-sm font-medium mb-1 dark:text-teal-400 text-[#2d6a6a]">
    Password
  </label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => {
        setPassword(e.target.value);
        setFieldErrors((p) => ({ ...p, password: undefined }));
      }}
      placeholder="Enter your password"
      className={`w-full px-4 py-3 pr-11 rounded-lg text-sm outline-none transition dark:bg-gray-700 dark:text-white ${
        fieldErrors.password
          ? "border-2 border-red-400 bg-red-50"
          : "border border-gray-200 bg-blue-50 focus:border-teal-500"
      }`}
    />

    {/* 👁️ Toggle Button */}
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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

  {fieldErrors.password && (
    <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
  )}
</div>

            {/* Checkbox */}
            <div className="flex items-center gap-2 mb-6">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 accent-teal-700"
              />
              <p className="text-sm dark:text-white text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className="dark:text-teal-400 text-teal-700 font-medium">
                  terms & policy
                </Link>
              </p>
            </div>

            {/* Messages */}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#2f6f66] text-white font-semibold hover:bg-[#255c55] transition"
            >
              {loading ? "Signing up..." : "Signup"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-400">Or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Social */}
            <div className="flex gap-4 justify-center mb-6">
              <button className="px-4 py-2 border rounded-lg text-sm hover:bg-blue-500">
                Login with Facebook
              </button>
              <button className="px-4 py-2 border rounded-lg text-sm hover:bg-orange-500">
                Login with Google
              </button>
            </div>

            {/* Footer */}
            <p className="text-center text-sm dark:text-white text-gray-500">
              Have an account?{" "}
              <Link href="/login" className="text-teal-700  dark:text-teal-400 font-semibold">
                Sign In
              </Link>
            </p>
          </form>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden md:flex justify-end">
          <div className="relative w-[420px] h-[560px] rounded-3xl overflow-hidden shadow-lg">
            <Image
              src="/images/register-bg.webp"
              alt="Register"
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


// "use client";
// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { isLoggedIn } from "../utils/auth";

// export default function RegisterPage() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [agreedToTerms, setAgreedToTerms] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});
//   const [success, setSuccess] = useState<string | null>(null);

//   // 🔒 Block logged-in users
//   useEffect(() => {
//     if (isLoggedIn()) {
//       window.location.href = "/dashboard";
//     }
//   }, []);

//   const validate = () => {
//     const errors: { name?: string; email?: string; password?: string } = {};
//     if (!name.trim()) errors.name = "Name is required";
//     if (!email.trim()) errors.email = "Email is required";
//     if (!password) errors.password = "Password is required";
//     return errors;
//   };

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);

//     const errors = validate();
//     setFieldErrors(errors);
//     if (Object.keys(errors).length > 0) return;

//     if (!agreedToTerms) {
//       setError("Please agree to the terms & policy.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accounts/register/`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "X-Frontend-Origin": window.location.origin,
//           },
//           body: JSON.stringify({
//             username: name.trim(),
//             email: email.trim(),
//             password,
//             password2: password,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         if (typeof data === "object") {
//           const messages = Object.values(data).flat().join(" | ");
//           throw new Error(messages || "Registration failed");
//         } else {
//           throw new Error(data.message || "Registration failed");
//         }
//       }

//       setSuccess(data.message || "Registration successful!");
//       // s
//     } catch (err: unknown) {
//       setError(err instanceof Error ? err.message : "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen">

//       {/* LEFT — Form */}
//       <div className="flex-1 flex items-center justify-center bg-white px-8 py-12 md:px-16 lg:px-24">
//         <div className="w-full max-w-md">

//           <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
//             Get Started Now
//           </h1>

//           <form onSubmit={handleRegister} noValidate>

//             {/* Name */}
//             <div className="mb-5">
//               <label className="block text-sm font-medium mb-1" style={{ color: "#2d6a6a" }}>
//                 Name
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter your name"
//                 value={name}
//                 onChange={(e) => { setName(e.target.value); setFieldErrors(p => ({ ...p, name: undefined })); }}
//                 className={`w-full px-4 py-3 rounded-lg text-sm outline-none transition ${
//                   fieldErrors.name
//                     ? "border-2 border-red-400 bg-red-50 placeholder-red-300"
//                     : "border border-gray-200 bg-blue-50 placeholder-gray-400 focus:border-teal-400"
//                 }`}
//               />
//               {fieldErrors.name && (
//                 <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
//               )}
//             </div>

//             {/* Email */}
//             <div className="mb-5">
//               <label className="block text-sm font-medium mb-1" style={{ color: "#2d6a6a" }}>
//                 Email address
//               </label>
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: undefined })); }}
//                 className={`w-full px-4 py-3 rounded-lg text-sm outline-none transition ${
//                   fieldErrors.email
//                     ? "border-2 border-red-400 bg-red-50 placeholder-red-300"
//                     : "border border-gray-200 bg-blue-50 placeholder-gray-400 focus:border-teal-400"
//                 }`}
//               />
//               {fieldErrors.email && (
//                 <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
//               )}
//             </div>

//             {/* Password */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium mb-1" style={{ color: "#2d6a6a" }}>
//                 Password
//               </label>
//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: undefined })); }}
//                 className={`w-full px-4 py-3 rounded-lg text-sm outline-none transition ${
//                   fieldErrors.password
//                     ? "border-2 border-red-400 bg-red-50 placeholder-red-300"
//                     : "border border-gray-200 bg-blue-50 placeholder-gray-400 focus:border-teal-400"
//                 }`}
//               />
//               {fieldErrors.password && (
//                 <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
//               )}
//             </div>

//             {/* Terms checkbox */}
//             <div className="flex items-center gap-2 mb-6">
//               <input
//                 type="checkbox"
//                 id="terms"
//                 checked={agreedToTerms}
//                 onChange={(e) => setAgreedToTerms(e.target.checked)}
//                 className="w-4 h-4 rounded border-gray-300 accent-teal-700"
//               />
//               <label htmlFor="terms" className="text-sm text-gray-600">
//                 I agree to the{" "}
//                 <Link href="/terms" className="font-medium" style={{ color: "#2d9d8f" }}>
//                   terms & policy
//                 </Link>
//               </label>
//             </div>

//             {/* Global error / success */}
//             {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//             {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

//             {/* Signup button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-colors duration-200 disabled:opacity-60"
//               style={{ backgroundColor: "#1e6b5e" }}
//               onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#164f46")}
//               onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1e6b5e")}
//             >
//               {loading ? "Signing up..." : "Signup"}
//             </button>

//             {/* Or divider */}
//             <div className="flex items-center gap-3 my-5">
//               <div className="flex-1 h-px bg-gray-200" />
//               <span className="text-sm text-gray-400">Or</span>
//               <div className="flex-1 h-px bg-gray-200" />
//             </div>

//             {/* Social logins */}
//             <div className="flex items-center justify-center gap-4 mb-6">
//               {/* Facebook */}
//               <button
//                 type="button"
//                 className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition"
//               >
//                 <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
//                   <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//                 </svg>
//                 Login with Facebook
//               </button>

//               {/* Google */}
//               <button
//                 type="button"
//                 className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition"
//               >
//                 <svg className="w-5 h-5" viewBox="0 0 24 24">
//                   <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                   <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                   <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                   <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                 </svg>
//                 Login with Google
//               </button>
//             </div>

//             {/* Sign in link */}
//             <p className="text-center text-sm text-gray-500">
//               Have an account?{" "}
//               <Link href="/login" className="font-semibold" style={{ color: "#2d9d8f" }}>
//                 Sign In
//               </Link>
//             </p>

//           </form>
//         </div>
//       </div>

//       {/* RIGHT — Image */}
//       <div className="hidden md:block w-1/2 relative">
//         <Image
//           src="/images/register-bg.webp"
//           alt="Register background"
//           fill
//           className="object-cover object-center"
//           priority
//         />
//       </div>

//     </div>
//   );
// }