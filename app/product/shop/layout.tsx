import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Refurbished Phone & Accessories | DriverX Mobile",
  description:
    "Shop Refurbished Phones & Accessories at DriverX Mobile. Discover certified smartphones, chargers, cases, cables, and quality tech essentials online.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}