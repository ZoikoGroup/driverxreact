"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export type AuthUser = { name: string; email?: string };

/** Event other code can dispatch after changing login state in localStorage. */
export const AUTH_EVENT = "driverx_auth";

/** Best display name from the stored API user object. */
export function displayNameFrom(user: any): string {
  if (!user || typeof user !== "object") return "";
  const full = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  return (
    full ||
    user.name ||
    user.full_name ||
    user.username ||
    (typeof user.email === "string" ? user.email.split("@")[0] : "") ||
    ""
  );
}

function readStoredUser(): AuthUser | null {
  try {
    if (!localStorage.getItem("driverx_token")) return null;
    const user = JSON.parse(localStorage.getItem("driverx_user") || "{}");
    return { name: displayNameFrom(user) || "My Account", email: user?.email };
  } catch {
    return null;
  }
}

/**
 * Current logged-in user (email/password login via localStorage, or
 * Google/Facebook via NextAuth), plus a logout() that clears both.
 */
export function useAuthUser() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [storedUser, setStoredUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const read = () => setStoredUser(readStoredUser());
    read();
    window.addEventListener("storage", read);
    window.addEventListener(AUTH_EVENT, read);
    return () => {
      window.removeEventListener("storage", read);
      window.removeEventListener(AUTH_EVENT, read);
    };
  }, [pathname]); // re-read after navigation (e.g. login → /dashboard)

  const sessionUser: AuthUser | null =
    status === "authenticated" && session?.user
      ? {
          name: session.user.name || session.user.email?.split("@")[0] || "My Account",
          email: session.user.email ?? undefined,
        }
      : null;

  const user = storedUser ?? sessionUser;

  const logout = useCallback(async () => {
    localStorage.removeItem("driverx_token");
    localStorage.removeItem("driverx_user");
    localStorage.removeItem("user");
    setStoredUser(null);
    window.dispatchEvent(new Event(AUTH_EVENT));

    if (status === "authenticated") {
      await signOut({ callbackUrl: "/login" });
    } else {
      router.push("/login");
    }
  }, [status, router]);

  return { user, logout };
}
