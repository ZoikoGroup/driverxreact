"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES — shaped exactly after GET /api/products/{slug}/
// ─────────────────────────────────────────────────────────────────────────────

type ProductImage = {
  id: number;
  image: string;       // full URL
  alt_text: string;
  is_primary: boolean;
  order: number;
};

// Each variant uses `attributes_dict` for fast lookup — e.g.
// { Storage: "128 GB", Color: "Black", Condition: "C1 Stock" }
type Variant = {
  id: number;
  sku: string;
  price: string;        // "247.06"
  stock: number;
  in_stock: boolean;
  is_active: boolean;
  image: string | null;
  attributes_dict: Record<string, string>;
};

// attribute_options drives the dropdowns — name + the values available
// for THIS product (not all global values)
type AttributeOption = {
  name: string;    // "Color" | "Storage" | "Condition"
  slug: string;
  options: string[]; // ["Black", "Silver"]
};

type Product = {
  id: number;
  name: string;
  slug: string;
  category: { id: number; name: string; slug: string };
  description: string;
  price_min: string;
  price_max: string;
  brand: string;
  model_number: string;
  display: string;
  resolution: string;
  processor: string;
  ram: string;
  rear_camera: string;
  front_camera: string;
  battery: string;
  os: string;
  network: string;
  sim_type: string;
  quick_charging: boolean;
  hybrid_sim_slot: boolean;
  images: ProductImage[];
  variants: Variant[];
  attribute_options: AttributeOption[]; // ← use this for dropdowns
  is_featured: boolean;
  created_at: string;
};

// Shape from GET /api/products/ list (for related products)
type ProductListItem = {
  id: number;
  name: string;
  slug: string;
  price_min: string;
  price_max: string;
  primary_image: string | null;
  category: { id: number; name: string; slug: string };
};

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL ?? "https://api.driverxmobile.com/api").replace(/\/$/, "");

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — match a variant using attributes_dict
// Returns null until every attribute_option has a chosen value
// ─────────────────────────────────────────────────────────────────────────────
function findVariant(
  variants: Variant[],
  selected: Record<string, string>
): Variant | null {
  const keys = Object.keys(selected);
  if (!keys.length || keys.some((k) => selected[k] === "")) return null;
  return (
    variants.find((v) =>
      keys.every((k) => v.attributes_dict[k] === selected[k])
    ) ?? null
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE — folder: app/product/[slug]/page.tsx
// URL:  /product/galaxy-s21-ultra-5g
// ─────────────────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  // Works with both [slug] and [id] folder names
  const params = useParams<{ slug?: string; id?: string }>();
  const slug   = params.slug ?? params.id ?? "";

  // ── Remote data ──────────────────────────────────────────────────────────
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // ── UI state ─────────────────────────────────────────────────────────────
  // `selected` maps each attribute name → chosen value, e.g.
  // { Color: "Black", Storage: "128 GB", Condition: "" }
  const [selected, setSelected]       = useState<Record<string, string>>({});
  const [quantity, setQuantity]       = useState(1);
  const [activeTab, setActiveTab]     = useState("description");
  const [userRating, setUserRating]   = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // ── Fetch product by slug ─────────────────────────────────────────────────
  // Hits GET /api/products/{slug}/ directly
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    setProduct(null);
    setSelected({});

    fetch(`${BASE_URL}/products/${slug}/`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json() as Promise<Product>;
      })
      .then((data) => {
        setProduct(data);
        // Seed selected with "" for each attribute_option
        // so all dropdowns render immediately on first paint
        const init: Record<string, string> = {};
        data.attribute_options.forEach((opt) => { init[opt.name] = ""; });
        setSelected(init);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  // ── Fetch related products ────────────────────────────────────────────────
  // Uses the list endpoint, excludes the current product
  useEffect(() => {
    if (!product) return;
    fetch(`${BASE_URL}/products/`)
      .then((r) => r.json())
      .then((data) => {
        const list: ProductListItem[] = data.results ?? data;
        setRelated(list.filter((p) => p.slug !== product.slug).slice(0, 4));
      })
      .catch(() => setRelated([]));
  }, [product]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const variant   = product ? findVariant(product.variants, selected) : null;
  const allChosen =
    !!product?.attribute_options.length &&
    product.attribute_options.every((opt) => selected[opt.name] !== "");

  // Primary image — first image with is_primary, else first image, else placeholder
  const mainImage =
    product?.images.find((img) => img.is_primary)?.image ??
    product?.images[0]?.image ??
    "/images/placeholder.png";

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-6">
        <p className="text-red-500 text-lg font-medium">
          {error ?? "Product not found."}
        </p>
        <Link href="/shop" className="text-purple-600 hover:underline text-sm">
          ← Back to shop
        </Link>
      </div>
    );
  }

  // ── Spec rows — only show fields the API actually filled in ───────────────
  const specRows: { label: string; value: string | boolean }[] = [
    { label: "Model Number",   value: product.model_number },
    { label: "Display",        value: product.display },
    { label: "Resolution",     value: product.resolution },
    { label: "Processor",      value: product.processor },
    { label: "RAM",            value: product.ram },
    { label: "Rear Camera",    value: product.rear_camera },
    { label: "Front Camera",   value: product.front_camera },
    { label: "Battery",        value: product.battery },
    { label: "OS",             value: product.os },
    { label: "Network",        value: product.network },
    { label: "SIM Type",       value: product.sim_type },
    { label: "Quick Charging", value: product.quick_charging ? "Yes" : "No" },
    { label: "Hybrid SIM",     value: product.hybrid_sim_slot ? "Yes" : "No" },
  ].filter((row) => row.value && row.value !== "" && row.value !== "No");

  const tabs = [
    { key: "description", label: "Description" },
    { key: "additional",  label: "Additional information" },
    { key: "reviews",     label: "Reviews (0)" },
  ];

  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">

      {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
      <div className="px-10 pt-6 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="text-purple-600 hover:underline">Home</Link>
        {" » "}
        <Link href="/shop" className="text-purple-600 hover:underline">Shop</Link>
        {" » "}
        <Link
          href={`/shop?category=${product.category.slug}`}
          className="text-purple-600 hover:underline"
        >
          {product.category.name}
        </Link>
        {" » "}
        <span>{product.name}</span>
      </div>

      {/* ── Main grid ───────────────────────────────────────────────────── */}
      <div className="px-10 py-8 grid grid-cols-2 gap-12">

        {/* Image */}
        <div className="flex items-center justify-center border border-gray-100 dark:border-gray-700 rounded-lg h-[480px] bg-white dark:bg-gray-800">
          <Image
            src={mainImage}
            alt={product.name}
            width={380}
            height={380}
            className="object-contain max-h-[440px]"
            unoptimized
          />
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold mb-1">{product.name}</h1>
          <p className="text-xs text-gray-400 mb-4 font-mono">
            {product.slug}
          </p>

          {/* Price */}
          <div className="mb-6">
            {variant ? (
              <span className="text-purple-600 text-2xl font-semibold">
                ${parseFloat(variant.price).toFixed(2)}
              </span>
            ) : (
              <span className="text-purple-600 text-2xl font-semibold">
                ${parseFloat(product.price_min).toFixed(2)} –{" "}
                ${parseFloat(product.price_max).toFixed(2)}
              </span>
            )}
          </div>

          {/*
            ── Attribute dropdowns ─────────────────────────────────────────
            Driven by product.attribute_options — the API tells us exactly
            which values are available for THIS product.
            e.g. Color: ["Black","Silver"]  Condition: ["B2-Stock","C1 Stock",...]
          */}
          {product.attribute_options.map((opt) => (
            <div key={opt.name} className="flex items-start gap-4 mb-4">
              <label className="w-36 text-sm font-medium text-gray-600 dark:text-gray-300 shrink-0 pt-2">
                {opt.name}
              </label>
              <div className="flex-1">
                <div className="relative">
                  <select
                    value={selected[opt.name] ?? ""}
                    onChange={(e) =>
                      setSelected((prev) => ({ ...prev, [opt.name]: e.target.value }))
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 pr-8 appearance-none bg-white dark:bg-gray-800 text-black dark:text-white text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Choose an option</option>
                    {opt.options.map((val) => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
                </div>
                {selected[opt.name] && (
                  <button
                    onClick={() => setSelected((prev) => ({ ...prev, [opt.name]: "" }))}
                    className="text-xs text-purple-500 mt-1 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Resolved price + stock after full selection */}
          {variant && (
            <div className="flex items-center gap-4 my-4">
              <span className="text-purple-600 text-xl font-bold">
                ${parseFloat(variant.price).toFixed(2)}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                variant.in_stock
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
              }`}>
                {variant.in_stock ? `In stock (${variant.stock})` : "Out of stock"}
              </span>
            </div>
          )}

          {/* Quantity + actions */}
          <div className="flex items-center gap-3 mt-6 flex-wrap">
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-lg leading-none"
              >−</button>
              <span className="px-4 py-2 text-sm font-medium border-x border-gray-300 dark:border-gray-600">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-lg leading-none"
              >+</button>
            </div>

            <button
              disabled={!allChosen || !variant || !variant.in_stock}
              className={`px-5 py-2 rounded text-sm font-medium transition-colors ${
                allChosen && variant && variant.in_stock
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              Add to cart
            </button>

            <button
              disabled={!allChosen || !variant || !variant.in_stock}
              className={`px-5 py-2 rounded text-sm font-medium transition-colors ${
                allChosen && variant && variant.in_stock
                  ? "bg-purple-800 hover:bg-purple-900 text-white"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <div className="px-10 mt-4">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-8">

          {/* Description */}
          {activeTab === "description" && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line">
                {product.description?.trim() || "No description available for this product."}
              </p>
            </div>
          )}

          {/* Additional information */}
          {activeTab === "additional" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Additional information</h2>
              <table className="w-full text-sm border border-gray-200 dark:border-gray-700">
                <tbody>
                  {/* Attribute options rows (Storage, Color, Condition) */}
                  {product.attribute_options.map((opt, i) => {
                    const isLast = i === product.attribute_options.length - 1 && !specRows.length;
                    return (
                      <tr key={opt.name} className={isLast ? "" : "border-b border-gray-200 dark:border-gray-700"}>
                        <td className="py-3 px-4 font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 w-40">
                          {opt.name}
                        </td>
                        <td className="py-3 px-4">{opt.options.join(", ")}</td>
                      </tr>
                    );
                  })}
                  {/* Spec rows — only rendered when the API provides values */}
                  {specRows.map((row, i) => (
                    <tr
                      key={row.label}
                      className={i < specRows.length - 1 ? "border-b border-gray-200 dark:border-gray-700" : ""}
                    >
                      <td className="py-3 px-4 font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 w-40">
                        {row.label}
                      </td>
                      <td className="py-3 px-4">{String(row.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Reviews */}
          {activeTab === "reviews" && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Reviews</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">There are no reviews yet.</p>
              <p className="text-sm font-medium mb-1">
                Be the first to review &ldquo;{product.name}&rdquo;
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Your email address will not be published. Required fields are marked *
              </p>
              <div className="mb-4">
                <label className="text-sm font-medium mb-1 block">
                  Your rating <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className={`text-2xl transition-colors ${
                        star <= (hoverRating || userRating) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
                      }`}
                    >★</button>
                  ))}
                </div>
              </div>
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="text-sm font-medium block mb-1">Your review <span className="text-red-500">*</span></label>
                  <textarea rows={5} className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:border-purple-500 resize-none" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Name <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Email <span className="text-red-500">*</span></label>
                  <input type="email" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:border-purple-500" />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <input type="checkbox" id="save-info" className="rounded" />
                  <label htmlFor="save-info">Save my name, email, and website in this browser for the next time I comment.</label>
                </div>
                <button className="bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 text-white text-sm px-5 py-2 rounded transition-colors">
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Related Products ─────────────────────────────────────────────── */}
      {related.length > 0 && (
        <div className="px-10 pb-10">
          <h2 className="text-xl font-semibold mb-6">Related products</h2>
          <div className="grid grid-cols-4 gap-6">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.slug}`}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow relative flex flex-col"
              >
                <span className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full z-10">
                  Sale!
                </span>
                <Image
                  src={item.primary_image ?? "/images/placeholder.png"}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="mx-auto object-contain h-44"
                  unoptimized
                />
                <h3 className="mt-3 font-medium text-sm">{item.name}</h3>
                <div className="mt-1">
                  <span className="text-purple-600 text-sm font-semibold">
                    ${parseFloat(item.price_min).toFixed(2)} – ${parseFloat(item.price_max).toFixed(2)}
                  </span>
                </div>
                <button className="mt-3 w-full border border-gray-300 dark:border-gray-600 text-sm py-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Select options
                </button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}