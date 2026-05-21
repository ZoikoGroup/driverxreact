import { Metadata } from "next";

const metadataMap: Record<
  string,
  { title: string; description: string }
> = {
  "galaxy-s21-5g": {
    title:
      "Affordable Refurbished Galaxy S21 5G | DriverX Mobile",
    description:
      "Shop the refurbished Samsung Galaxy S21 5G at DriverX Mobile. Unlocked, tested, and certified. Get premium performance at a fraction of the retail price.",
  },

  "galaxy-s21-ultra-5g": {
    title:
      "Buy Refurbished Galaxy S21 Ultra 5G | DriverX Mobile",
    description:
      "Buy a refurbished Samsung Galaxy S21 Ultra 5G, fully unlocked and tested for performance. Shop DriverX Mobile for great deals, fast shipping & warranty.",
  }
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {

  const { slug } = await params;

  const meta = metadataMap[slug];

  return {
    title: meta?.title || "DriverX Mobile",

    description:
      meta?.description || "DriverX Mobile Products",

    alternates: {
      canonical: `https://driverxmobile.com/product/${slug}`,
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}