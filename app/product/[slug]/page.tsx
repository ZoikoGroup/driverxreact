"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetailPage() {
  const { slug } = useParams();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  const [selected, setSelected] = useState({
    storage: "",
    color: "",
    condition: "",
  });

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // ✅ Fetch product
  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://api.driverxmobile.com/api/products/${slug}/`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // ✅ Fetch related
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch("https://api.driverxmobile.com/api/products/");
        const data = await res.json();
        const filtered = data.results.filter((p: any) => p.slug !== slug);
        setRelatedProducts(filtered);
      } catch (err) {
        console.error("Related API error:", err);
      }
    };
    fetchRelated();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }
  if (!product) return <div className="p-10">Product not found</div>;

  // ✅ Image
  const mainImage =
    product.images?.find((img: any) => img.is_primary)?.image ||
    product.images?.[0]?.image ||
    "/images/placeholder.png";

  // ✅ Options
  const getOptions = (optSlug: string) =>
    product.attribute_options?.find((a: any) => a.slug === optSlug)?.options || [];

  const storageOptions   = getOptions("storage");
  const colorOptions     = getOptions("color");
  const conditionOptions = getOptions("condition");

  // ✅ Variants
  const variants = product.variants.map((v: any) => ({
    storage:   v.attributes_dict?.Storage,
    color:     v.attributes_dict?.Color,
    condition: v.attributes_dict?.Condition,
    price:     Number(v.price),
  }));

  const variant = variants.find(
    (v: any) =>
      v.storage   === selected.storage &&
      v.color     === selected.color &&
      v.condition === selected.condition
  );

  const range   = { min: product.price_min, max: product.price_max };
  const isValid = selected.storage && selected.color && selected.condition;

  const tabs = [
    { key: "description", label: "Description" },
    { key: "additional",  label: "Additional information" },
    { key: "reviews",     label: "Reviews (0)" },
  ];

  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">

      {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-10 pt-4 sm:pt-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="text-purple-600 hover:underline">Home</Link>
        {" » "}
        <Link href="/shop" className="text-purple-600 hover:underline">Shop</Link>
        {" » "}
        <span className="line-clamp-1">{product.name}</span>
      </div>

      {/* ── Main grid ────────────────────────────────────────────────────────
          Mobile:  single column (image on top, details below)
          Desktop: two columns side by side
      */}
      <div className="px-4 sm:px-10 py-6 sm:py-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12">

        {/* Image */}
        <div className="flex items-center justify-center border border-gray-100 dark:border-gray-700 rounded-lg
                        h-64 sm:h-80 md:h-[480px] bg-white dark:bg-gray-800">
          <Image
            src={mainImage}
            alt={product.name}
            width={380}
            height={380}
            className="object-contain max-h-56 sm:max-h-72 md:max-h-[440px] w-auto"
            unoptimized={mainImage.startsWith("http")}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/images/placeholder.png";
            }}
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 leading-snug">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mb-5 sm:mb-6">
            {variant ? (
              <span className="text-purple-600 text-xl sm:text-2xl font-semibold">
                ${variant.price}
              </span>
            ) : (
              <span className="text-purple-600 text-xl sm:text-2xl font-semibold">
                ${range.min} – ${range.max}
              </span>
            )}
          </div>

          {/* Storage */}
          <div className="mb-3 sm:mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
              Storage
            </label>
            <div className="relative">
              <select
                value={selected.storage}
                onChange={(e) => setSelected({ ...selected, storage: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 pr-8 appearance-none text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">Choose an option</option>
                {storageOptions.map((s: string) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
            </div>
          </div>

          {/* Color */}
          <div className="mb-3 sm:mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
              Color
            </label>
            <div className="relative">
              <select
                value={selected.color}
                onChange={(e) => setSelected({ ...selected, color: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 pr-8 appearance-none text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">Choose an option</option>
                {colorOptions.map((c: string) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
            </div>
          </div>

          {/* Condition */}
          <div className="mb-3 sm:mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
              Condition
            </label>
            <div className="relative">
              <select
                value={selected.condition}
                onChange={(e) => setSelected({ ...selected, condition: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 pr-8 appearance-none text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">Choose an option</option>
                {conditionOptions.map((c: string) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
            </div>
          </div>

          {/* Quantity + action buttons
              Mobile:  quantity + buttons in a column stack
              Desktop: all in one flex row
          */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-5 sm:mt-6">

            {/* Quantity stepper */}
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded overflow-hidden self-start">
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

            {/* Add to cart — full width on mobile */}
            <button
              disabled={!isValid}
              className={`w-full sm:w-auto px-5 py-2.5 rounded text-sm font-medium transition-colors ${
                isValid
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              Add to cart
            </button>

            {/* Checkout — full width on mobile */}
            <button
              disabled={!isValid}
              className={`w-full sm:w-auto px-5 py-2.5 rounded text-sm font-medium transition-colors ${
                isValid
                  ? "bg-purple-800 hover:bg-purple-900 text-white"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-10 mt-2 sm:mt-6">
        {/* Tab headers — scrollable on mobile so they never overflow */}
        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-5 sm:py-6">

          {/* Description */}
          {activeTab === "description" && (
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {product.description || "No description available"}
            </p>
          )}

          {/* Additional information */}
          {activeTab === "additional" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 dark:border-gray-700 min-w-[300px]">
                <tbody>
                  {[
                    { label: "Brand",   value: product.category?.name },
                    { label: "Network", value: product.network || "-" },
                    { label: "OS",      value: product.os || "-" },
                  ].map((row, i, arr) => (
                    <tr
                      key={row.label}
                      className={i < arr.length - 1 ? "border-b border-gray-200 dark:border-gray-700" : ""}
                    >
                      <td className="py-3 px-4 font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 w-36">
                        {row.label}
                      </td>
                      <td className="py-3 px-4">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Reviews */}
          {activeTab === "reviews" && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No reviews yet.</p>
              <p className="text-sm font-medium mb-1">
                Be the first to review &ldquo;{product.name}&rdquo;
              </p>
              <div className="flex gap-1 mt-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={`text-2xl transition-colors ${
                      star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
                    }`}
                  >★</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Related Products ──────────────────────────────────────────────
          Mobile:  2 columns
          sm:      2 columns (bigger)
          lg:      4 columns
      */}
      {relatedProducts.length > 0 && (
        <div className="px-4 sm:px-10 py-6 sm:py-10">
          <h2 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-6">Related Products</h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((item: any) => (
              <Link
                key={item.id}
                href={`/product/${item.slug}`}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 hover:shadow-lg transition bg-white dark:bg-gray-800 flex flex-col"
              >
                {/* Image */}
                <div className="flex items-center justify-center h-32 sm:h-[180px] mb-2 sm:mb-4">
                  <Image
                    src={item.primary_image || "/images/placeholder.png"}
                    alt={item.name}
                    width={160}
                    height={160}
                    className="object-contain max-h-28 sm:max-h-[160px] w-auto"
                    unoptimized={!!item.primary_image}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/placeholder.png";
                    }}
                  />
                </div>

                {/* Name */}
                <h3 className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 line-clamp-2 leading-snug">
                  {item.name}
                </h3>

                {/* Price */}
                <p className="text-purple-600 font-semibold text-xs sm:text-sm mt-auto">
                  ${parseFloat(item.price_min).toFixed(2)} – ${parseFloat(item.price_max).toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}