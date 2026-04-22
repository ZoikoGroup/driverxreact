"use client";
import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES — match https://api.driverxmobile.com/api/products/ exactly
// ─────────────────────────────────────────────────────────────────────────────
type Attribute = {
  name: string;     // "Storage" | "Color" | "Condition"
  values: string[]; // ["128 GB"] | ["Black", "Silver"] | ["B2-Stock", ...]
};

type Product = {
  id: number;
  name: string;
  slug: string;
  category: { id: number; name: string; slug: string };
  brand: string;             // "" in API — we use category.name as brand
  price_min: string;         // "247.06"
  price_max: string;         // "305.88"
  primary_image: string | null; // full URL e.g. "https://api.driverxmobile.com/media/..."
  is_featured: boolean;
  attributes: Attribute[];
};

type ApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
};

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL ?? "https://api.driverxmobile.com/api").replace(/\/$/, "");

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// brand field is "" so we read category.name instead
const getBrand = (p: Product) => p.category.name; // "Samsung", "Apple" etc.

// get values for a named attribute, or [] if missing
const getAttr = (p: Product, name: string) =>
  p.attributes.find((a) => a.name === name)?.values ?? [];

// ─────────────────────────────────────────────────────────────────────────────
// STAR RATING — kept for UI parity; API has no rating field yet
// ─────────────────────────────────────────────────────────────────────────────
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1 mt-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`text-sm ${
          star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
        }`}
      >
        ★
      </span>
    ))}
    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({rating})</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────────────────────────────────────
const ProductCard = ({ item }: { item: Product }) => {
  const min = parseFloat(item.price_min).toFixed(2);
  const max = parseFloat(item.price_max).toFixed(2);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm bg-white dark:bg-gray-800 dark:text-white relative flex flex-col">
      {/* Sale badge */}
      <span className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full z-10">
        Sale!
      </span>

      {/* Product image — uses the real URL from the API */}
      <div className="h-40 flex items-center justify-center overflow-hidden">
        <Image
          src={item.primary_image ?? "/images/placeholder.png"}
          alt={item.name}
          width={160}
          height={160}
          className="h-40 w-auto object-contain mx-auto"
          unoptimized // allows external URLs without next.config domains setup
        />
      </div>

      <h3 className="font-semibold mt-2 text-sm">{item.name}</h3>

      {/* API has no rating yet — shows empty stars; swap 0 → item.rating when available */}
      <StarRating rating={0} />

      {/* Price range from price_min / price_max */}
      <div className="flex items-center gap-2 mt-1 flex-wrap">
        <span className="text-purple-600 font-bold text-sm">
          ${min} – ${max}
        </span>
      </div>

      {/* Link uses item.id — matches your existing /product/[id] folder */}
      <Link
        href={`/product/${item.id}`}
        className="mt-3 w-full border border-gray-300 dark:border-gray-600 text-sm py-1.5 rounded text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        Select options
      </Link>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SORT OPTIONS
// ─────────────────────────────────────────────────────────────────────────────
const sortOptions = [
  { value: "default", label: "Default sorting" },
  { value: "low",     label: "Sort by price: low to high" },
  { value: "high",    label: "Sort by price: high to low" },
  { value: "name",    label: "Sort by name: A → Z" },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ProductPage() {

  // ── Remote data ────────────────────────────────────────────────────────────
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount]   = useState(0);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  // ── Filter / sort state ────────────────────────────────────────────────────
  const [sortType, setSortType]                   = useState("default");
  const [search, setSearch]                       = useState("");
  const [selectedBrand, setSelectedBrand]         = useState("");
  const [selectedColor, setSelectedColor]         = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
  const [priceRange, setPriceRange]               = useState(1000);

  // ── Fetch from API on mount ────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${BASE_URL}/products/`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json() as Promise<ApiResponse>;
      })
      .then((data) => {
        setAllProducts(data.results);
        setTotalCount(data.count);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ── Derive filter options dynamically from fetched data ────────────────────
  // These update automatically if you add products / new attributes to the API.
  const brands = useMemo(
    () => [...new Set(allProducts.map(getBrand))].sort(),
    [allProducts]
  );

  const colors = useMemo(
    () => [...new Set(allProducts.flatMap((p) => getAttr(p, "Color")))].sort(),
    [allProducts]
  );

  const conditions = useMemo(
    () => [...new Set(allProducts.flatMap((p) => getAttr(p, "Condition")))].sort(),
    [allProducts]
  );

  const globalMaxPrice = useMemo(
    () => Math.ceil(Math.max(...allProducts.map((p) => parseFloat(p.price_max)), 1000)),
    [allProducts]
  );

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const minPrice         = parseFloat(p.price_min);
      const brand            = getBrand(p).toLowerCase();
      const productColors    = getAttr(p, "Color");
      const productConds     = getAttr(p, "Condition");

      return (
        // search by name or brand
        (p.name.toLowerCase().includes(search.toLowerCase()) ||
          brand.includes(search.toLowerCase())) &&
        // brand radio
        (selectedBrand ? brand === selectedBrand.toLowerCase() : true) &&
        // color checkboxes
        (selectedColor.length
          ? productColors.some((c) => selectedColor.includes(c))
          : true) &&
        // condition checkboxes
        (selectedCondition.length
          ? productConds.some((c) => selectedCondition.includes(c))
          : true) &&
        // price slider — filter by price_min (cheapest variant)
        minPrice <= priceRange
      );
    });
  }, [allProducts, search, selectedBrand, selectedColor, selectedCondition, priceRange]);

  // ── Sort ───────────────────────────────────────────────────────────────────
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortType) {
        case "low":  return parseFloat(a.price_min) - parseFloat(b.price_min);
        case "high": return parseFloat(b.price_min) - parseFloat(a.price_min);
        case "name": return a.name.localeCompare(b.name);
        default:     return a.id - b.id; // API order
      }
    });
  }, [filteredProducts, sortType]);

  // ── Reset ──────────────────────────────────────────────────────────────────
  const resetFilters = () => {
    setSearch("");
    setSelectedBrand("");
    setSelectedColor([]);
    setSelectedCondition([]);
    setPriceRange(globalMaxPrice);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full dark:text-white dark:bg-gray-900 min-h-screen">

      <h1 className="text-2xl font-bold mb-4 px-4 pt-4">Products</h1>

      {/* Brand logos */}
      <div className="p-4">
        <div className="flex justify-center gap-8">
          <Image src="/images/samsung.png"  alt="Samsung"  width={120} height={60} />
          <Image src="/images/apple.png"    alt="Apple"    width={120} height={60} />
          <Image src="/images/oneplus.png"  alt="OnePlus"  width={120} height={60} />
          <Image src="/images/motorola.png" alt="Motorola" width={120} height={60} />
          <Image src="/images/google.png"   alt="Google"   width={120} height={60} />
          <Image src="/images/nokia-1.png"  alt="Nokia"    width={120} height={60} />
        </div>
      </div>

      <div className="flex gap-6 px-4 pb-10">

        {/* ── LEFT FILTER SIDEBAR ──────────────────────────────────────── */}
        <div className="w-1/4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-100 dark:bg-gray-800 self-start">

          <h2 className="text-xl font-bold mb-4">Filter Product</h2>

          {/* Search */}
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            className="w-full mb-4 p-2 border rounded text-gray-950 dark:text-white dark:bg-gray-700 dark:border-gray-600"
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Brand — built from API data, no hardcoding */}
          <h3 className="font-semibold mt-4 mb-2">Brand</h3>
          {brands.map((b) => (
            <div key={b} className="flex items-center gap-2 mb-1">
              <input
                type="radio"
                name="brand"
                checked={selectedBrand.toLowerCase() === b.toLowerCase()}
                onChange={() => setSelectedBrand(b)}
              />
              <label>{b}</label>
            </div>
          ))}
          {selectedBrand && (
            <button
              onClick={() => setSelectedBrand("")}
              className="text-xs text-purple-500 mt-1 hover:underline"
            >
              Clear brand
            </button>
          )}

          {/* Price slider — max auto-adjusts to priciest product */}
          <h3 className="font-semibold mt-4 mb-2">Price</h3>
          <input
            type="range"
            min="0"
            max={globalMaxPrice}
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
          <p className="text-sm mt-1">Up to ${priceRange}</p>

          {/* Color checkboxes — built from API attribute values */}
          <h3 className="font-semibold mt-4 mb-2">Select Color</h3>
          {colors.map((c) => (
            <div key={c} className="flex items-center gap-2 mb-1">
              <input
                type="checkbox"
                checked={selectedColor.includes(c)}
                onChange={(e) => {
                  if (e.target.checked) setSelectedColor((prev) => [...prev, c]);
                  else setSelectedColor((prev) => prev.filter((x) => x !== c));
                }}
              />
              <label>{c}</label>
            </div>
          ))}

          {/* Condition checkboxes — built from API attribute values */}
          <h3 className="font-semibold mt-4 mb-2">Condition</h3>
          {conditions.map((c) => (
            <div key={c} className="flex items-center gap-2 mb-1">
              <input
                type="checkbox"
                checked={selectedCondition.includes(c)}
                onChange={(e) => {
                  if (e.target.checked) setSelectedCondition((prev) => [...prev, c]);
                  else setSelectedCondition((prev) => prev.filter((x) => x !== c));
                }}
              />
              <label>{c}</label>
            </div>
          ))}

          <button
            onClick={resetFilters}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded w-full transition-colors"
          >
            Reset
          </button>
        </div>

        {/* ── RIGHT PRODUCT GRID ────────────────────────────────────────── */}
        <div className="w-3/4">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {loading
                ? "Loading…"
                : `Showing 1–${sortedProducts.length} of ${totalCount} results`}
            </p>

            <div className="relative">
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded px-4 py-2 pr-10 appearance-none bg-white dark:bg-gray-800 text-sm text-black dark:text-white focus:outline-none focus:border-purple-500 min-w-[200px]"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">All Products</h2>

          {/* Loading spinner */}
          {loading && (
            <div className="flex items-center justify-center h-60">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-600 border-t-transparent" />
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <p className="text-red-500 mt-10">Failed to load products: {error}</p>
          )}

          {/* Empty state */}
          {!loading && !error && sortedProducts.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 mt-10">
              No products match your filters.
            </p>
          )}

          {/* Product grid */}
          {!loading && !error && sortedProducts.length > 0 && (
            <div className="grid grid-cols-3 gap-6">
              {sortedProducts.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}