"use client";
import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";


// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type Attribute = {
  name: string;
  values: string[];
};

type Product = {
  id: number;
  name: string;
  slug: string;
  category: { id: number; name: string; slug: string };
  brand: string;
  price_min: string;
  price_max: string;
  primary_image: string | null;
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

const getBrand = (p: Product) => p.category.name;
const getAttr  = (p: Product, name: string) =>
  p.attributes.find((a) => a.name === name)?.values ?? [];

// ─────────────────────────────────────────────────────────────────────────────
// STAR RATING
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

  const imgSrc = item.primary_image && item.primary_image.trim() !== ""
    ? item.primary_image
    : "/images/placeholder.png";

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 shadow-sm bg-white dark:bg-gray-800 dark:text-white relative flex flex-col">
      {/* Sale badge */}
      <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full z-10">
        Sale!
      </span>

      {/* Image */}
      <div className="h-32 sm:h-40 flex items-center justify-center overflow-hidden">
        <Image
          src={imgSrc}
          alt={item.name}
          width={160}
          height={160}
          className="h-32 sm:h-40 w-auto object-contain mx-auto"
          unoptimized={imgSrc.startsWith("http")}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/images/placeholder.png";
          }}
        />
      </div>

      <h3 className="font-semibold mt-2 text-xs sm:text-sm leading-snug line-clamp-2">
        {item.name}
      </h3>
      <StarRating rating={0} />

      <div className="flex items-center gap-2 mt-1 flex-wrap">
        <span className="text-purple-600 font-bold text-xs sm:text-sm">
          ${min} – ${max}
        </span>
      </div>

      <Link
        href={`/product/${item.slug}`}
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
  { value: "low",     label: "Price: low to high" },
  { value: "high",    label: "Price: high to low" },
  { value: "name",    label: "Name: A → Z" },
];

// ─────────────────────────────────────────────────────────────────────────────
// FILTER SIDEBAR — extracted as its own component so it can be used
// both in the desktop sidebar AND the mobile drawer
// ─────────────────────────────────────────────────────────────────────────────
type FilterPanelProps = {
  brands: string[];
  colors: string[];
  conditions: string[];
  globalMaxPrice: number;
  search: string; setSearch: (v: string) => void;
  selectedBrand: string; setSelectedBrand: (v: string) => void;
  selectedColor: string[]; setSelectedColor: (v: string[]) => void;
  selectedCondition: string[]; setSelectedCondition: (v: string[]) => void;
  priceRange: number; setPriceRange: (v: number) => void;
  onReset: () => void;
  onClose?: () => void; // only used in mobile drawer
};

const FilterPanel = ({
  brands, colors, conditions, globalMaxPrice,
  search, setSearch,
  selectedBrand, setSelectedBrand,
  selectedColor, setSelectedColor,
  selectedCondition, setSelectedCondition,
  priceRange, setPriceRange,
  onReset, onClose,
}: FilterPanelProps) => (
  <div className="p-4">
    {/* Mobile close button */}
    {onClose && (
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Filter Products</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 dark:hover:text-white text-2xl leading-none"
          aria-label="Close filters"
        >
          ×
        </button>
      </div>
    )}

    {/* Desktop heading — hidden on mobile since drawer has its own */}
    {!onClose && <h2 className="text-xl font-bold mb-4">Filter Product</h2>}

    {/* Search */}
    <input
      type="text"
      placeholder="Search products..."
      value={search}
      className="w-full mb-4 p-2 border rounded text-gray-950 dark:text-white dark:bg-gray-700 dark:border-gray-600 text-sm"
      onChange={(e) => setSearch(e.target.value)}
    />

    {/* Brand */}
    <h3 className="font-semibold mt-3 mb-2 text-sm">Brand</h3>
    {brands.map((b) => (
      <div key={b} className="flex items-center gap-2 mb-1">
        <input
          type="radio"
          name="brand"
          checked={selectedBrand.toLowerCase() === b.toLowerCase()}
          onChange={() => setSelectedBrand(b)}
        />
        <label className="text-sm">{b}</label>
      </div>
    ))}
    {selectedBrand && (
      <button onClick={() => setSelectedBrand("")} className="text-xs text-purple-500 mt-1 hover:underline">
        Clear brand
      </button>
    )}

    {/* Price */}
    <h3 className="font-semibold mt-4 mb-2 text-sm">Price</h3>
    <input
      type="range"
      min="0"
      max={globalMaxPrice}
      value={priceRange}
      onChange={(e) => setPriceRange(Number(e.target.value))}
      className="w-full accent-purple-600"
    />
    <p className="text-sm mt-1">Up to ${priceRange}</p>

    {/* Color */}
    <h3 className="font-semibold mt-4 mb-2 text-sm">Select Color</h3>
    {colors.map((c) => (
      <div key={c} className="flex items-center gap-2 mb-1">
        <input
          type="checkbox"
          checked={selectedColor.includes(c)}
          onChange={(e) => {
            if (e.target.checked) setSelectedColor([...selectedColor, c]);
            else setSelectedColor(selectedColor.filter((x) => x !== c));
          }}
        />
        <label className="text-sm">{c}</label>
      </div>
    ))}

    {/* Condition */}
    <h3 className="font-semibold mt-4 mb-2 text-sm">Condition</h3>
    {conditions.map((c) => (
      <div key={c} className="flex items-center gap-2 mb-1">
        <input
          type="checkbox"
          checked={selectedCondition.includes(c)}
          onChange={(e) => {
            if (e.target.checked) setSelectedCondition([...selectedCondition, c]);
            else setSelectedCondition(selectedCondition.filter((x) => x !== c));
          }}
        />
        <label className="text-sm">{c}</label>
      </div>
    ))}

    <button
      onClick={onReset}
      className="mt-5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded w-full transition-colors text-sm font-medium"
    >
      Reset Filters
    </button>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ProductPage() {

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount]   = useState(0);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  // Filter / sort state
  const [sortType, setSortType]                   = useState("default");
  const [search, setSearch]                       = useState("");
  const [selectedBrand, setSelectedBrand]         = useState("");
  const [selectedColor, setSelectedColor]         = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
  const [priceRange, setPriceRange]               = useState(1000);

  // Mobile filter drawer open/close
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  // Prevent body scroll when drawer is open on mobile
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const brands = useMemo(() => [...new Set(allProducts.map(getBrand))].sort(), [allProducts]);
  const colors = useMemo(() => [...new Set(allProducts.flatMap((p) => getAttr(p, "Color")))].sort(), [allProducts]);
  const conditions = useMemo(() => [...new Set(allProducts.flatMap((p) => getAttr(p, "Condition")))].sort(), [allProducts]);
  const globalMaxPrice = useMemo(
    () => Math.ceil(Math.max(...allProducts.map((p) => parseFloat(p.price_max)), 1000)),
    [allProducts]
  );

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const minPrice      = parseFloat(p.price_min);
      const brand         = getBrand(p).toLowerCase();
      const productColors = getAttr(p, "Color");
      const productConds  = getAttr(p, "Condition");
      return (
        (p.name.toLowerCase().includes(search.toLowerCase()) || brand.includes(search.toLowerCase())) &&
        (selectedBrand ? brand === selectedBrand.toLowerCase() : true) &&
        (selectedColor.length ? productColors.some((c) => selectedColor.includes(c)) : true) &&
        (selectedCondition.length ? productConds.some((c) => selectedCondition.includes(c)) : true) &&
        minPrice <= priceRange
      );
    });
  }, [allProducts, search, selectedBrand, selectedColor, selectedCondition, priceRange]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortType) {
        case "low":  return parseFloat(a.price_min) - parseFloat(b.price_min);
        case "high": return parseFloat(b.price_min) - parseFloat(a.price_min);
        case "name": return a.name.localeCompare(b.name);
        default:     return a.id - b.id;
      }
    });
  }, [filteredProducts, sortType]);

  const resetFilters = () => {
    setSearch("");
    setSelectedBrand("");
    setSelectedColor([]);
    setSelectedCondition([]);
    setPriceRange(globalMaxPrice);
  };

  // Shared filter props passed to both desktop sidebar and mobile drawer
  const filterProps = {
    brands, colors, conditions, globalMaxPrice,
    search, setSearch,
    selectedBrand, setSelectedBrand,
    selectedColor, setSelectedColor,
    selectedCondition, setSelectedCondition,
    priceRange, setPriceRange,
    onReset: resetFilters,
  };

  // Count how many filters are active (for the mobile badge)
  const activeFilterCount =
    (search ? 1 : 0) +
    (selectedBrand ? 1 : 0) +
    selectedColor.length +
    selectedCondition.length +
    (priceRange < globalMaxPrice ? 1 : 0);

  return (
    <div className="w-full dark:text-white dark:bg-gray-900 min-h-screen">

      {/* ── Page title ─────────────────────────────────────────────────── */}
      <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 px-4 pt-4">Products</h1>

      {/* ── Brand logos ──────────────────────────────────────────────────
          Mobile:  2 columns grid  (2 logos per row → 3 rows of 2)
          Desktop: single flex row, all 6 side by side centred
      */}
      <div className="px-4 pb-4">
        {/* Mobile grid: 2 columns */}
        <div className="grid grid-cols-2 gap-3 sm:hidden">
          {[
            { src: "/images/samsung.png",  alt: "Samsung"  },
            { src: "/images/apple.png",    alt: "Apple"    },
            { src: "/images/oneplus.png",  alt: "OnePlus"  },
            { src: "/images/motorola.png", alt: "Motorola" },
            { src: "/images/google.png",   alt: "Google"   },
            { src: "/images/nokia-1.png",  alt: "Nokia"    },
          ].map((logo) => (
            <div
              key={logo.alt}
              className="flex items-center justify-center border border-gray-100 dark:border-gray-700 rounded-xl py-3 bg-white dark:bg-gray-800"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={80}
                height={40}
                className="object-contain"
              />
            </div>
          ))}
        </div>

        {/* Desktop row: all 6 in one line */}
        <div className="hidden sm:flex justify-center gap-8">
          {[
            { src: "/images/samsung.png",  alt: "Samsung"  },
            { src: "/images/apple.png",    alt: "Apple"    },
            { src: "/images/oneplus.png",  alt: "OnePlus"  },
            { src: "/images/motorola.png", alt: "Motorola" },
            { src: "/images/google.png",   alt: "Google"   },
            { src: "/images/nokia-1.png",  alt: "Nokia"    },
          ].map((logo) => (
            <div key={logo.alt} className="flex items-center justify-center">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={60}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── MOBILE: top bar with filter button + sort ─────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 gap-2 lg:hidden border-b border-gray-200 dark:border-gray-700">

        {/* Filter toggle button with active count badge */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm font-medium bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative"
        >
          {/* Filter icon */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 8h10M10 12h4M12 16h0" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-purple-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Sort dropdown */}
        <div className="relative flex-1 max-w-[200px]">
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-8 appearance-none bg-white dark:bg-gray-800 text-sm text-black dark:text-white focus:outline-none focus:border-purple-500"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
        </div>

        {/* Result count */}
        <p className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
          {loading ? "…" : `${sortedProducts.length} items`}
        </p>
      </div>

      {/* ── MOBILE FILTER DRAWER ─────────────────────────────────────────
          Slides in from the left on mobile. Hidden on lg+.
      */}
      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-xs bg-white dark:bg-gray-900 z-50 overflow-y-auto shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <FilterPanel {...filterProps} onClose={() => setDrawerOpen(false)} />
      </div>

      {/* ── DESKTOP + MOBILE layout ───────────────────────────────────── */}
      <div className="flex gap-6 px-4 pb-10 mt-2">

        {/* ── DESKTOP SIDEBAR — hidden below lg ─────────────────────── */}
        <div className="hidden lg:block w-1/4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-100 dark:bg-gray-800 self-start">
          <FilterPanel {...filterProps} />
        </div>

        {/* ── PRODUCT GRID ──────────────────────────────────────────── */}
        <div className="w-full lg:w-3/4">

          {/* Desktop top bar (hidden on mobile — already shown above) */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {loading ? "Loading…" : `Showing 1–${sortedProducts.length} of ${totalCount} results`}
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

          <h2 className="text-lg sm:text-2xl font-bold mb-4">All Products</h2>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center h-60">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-600 border-t-transparent" />
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <p className="text-red-500 mt-10 text-sm px-1">Failed to load products: {error}</p>
          )}

          {/* Empty */}
          {!loading && !error && sortedProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-3">No products match your filters.</p>
              <button
                onClick={resetFilters}
                className="text-purple-600 text-sm underline hover:text-purple-800"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Grid
              Mobile:  2 columns
              sm:      2 columns with bigger cards
              lg:      3 columns
          */}
          {!loading && !error && sortedProducts.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
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