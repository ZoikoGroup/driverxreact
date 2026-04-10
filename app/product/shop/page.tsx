"use client";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
type Product = {
  id: number;
  brand: string;
  name: string;
  image: string;
  rating: number;
  popularity: number;
  createdAt: number;

  description: string; 

  extraInfo?: {       
    label: string;
    value: string;
  }[];

  options: {
    storage: string[];
    colors: string[];
    condition: string[];
  };

  variants: {
    storage: string;
    condition: string;
    price: number;
    originalPrice?: number;
  }[];
};

/* ✅ PRODUCT DATA */
const dummyProducts: Product[] = [
  {
    id: 1,
    brand: "apple",
    name: "iPhone 13 Pro",
    image: "/images/iphone-13-pro-mlvw3hn-a-apple-original-imag6vpcvspnzyfy.png",
    rating: 4.8,
    popularity: 320,
    createdAt: 1700000000,
    description: "GSM Unlocked. iPhone 13 Pro with a stunning Super Retina XDR display.",
    extraInfo: [
      { label: "Network", value: "GSM Unlocked" },
      { label: "OS", value: "iOS 15" },
    ],
    options: {
      storage: ["128GB", "256GB", "512GB"],
      colors: ["Silver", "Gold", "Graphite"],
      condition: ["A1-Stock", "A2-Stock", "B1-Stock", "B2-Stock", "RC1-Stock"],
    },
    variants: [
      { storage: "128GB", condition: "A1-Stock", price: 500, originalPrice: 620 },
      { storage: "128GB", condition: "A2-Stock", price: 480, originalPrice: 600 },
      { storage: "256GB", condition: "A1-Stock", price: 550, originalPrice: 680 },
      { storage: "512GB", condition: "A1-Stock", price: 600, originalPrice: 740 },
    ],
  },
  {
    id: 2,
    brand: "apple",
    name: "iPhone 12",
    image: "/images/apple-iphone-12-dummyapplefsn-original-imafwg8dkyh2zgrh.png",
    rating: 4.5,
    popularity: 280,
    createdAt: 1690000000,
    description: "GSM Unlocked. iPhone 12 with 5G capability and Ceramic Shield.",
    extraInfo: [
      { label: "Network", value: "GSM Unlocked" },
      { label: "OS", value: "iOS 14" },
    ],
    options: {
      storage: ["64GB", "128GB", "256GB"],
      colors: ["Black", "Blue", "White"],
      condition: ["A1-Stock", "A2-Stock", "B1-Stock", "B2-Stock", "RC1-Stock"],
    },
    variants: [
      { storage: "64GB",  condition: "A1-Stock", price: 300, originalPrice: 380 },
      { storage: "128GB", condition: "A1-Stock", price: 340, originalPrice: 420 },
      { storage: "128GB", condition: "B1-Stock", price: 310, originalPrice: 390 },
      { storage: "256GB", condition: "A1-Stock", price: 380, originalPrice: 460 },
    ],
  },
  {
    id: 3,
    brand: "samsung",
    name: "Galaxy Z Flip 4",
    image: "/images/original-imahfay2yzrfjggn.png",
    rating: 4.3,
    popularity: 210,
    createdAt: 1695000000,
    description: "GSM Unlocked. Samsung Galaxy Z Flip 4 with foldable AMOLED display.",
    extraInfo: [
      { label: "Network", value: "GSM Unlocked" },
      { label: "OS", value: "Android 12" },
    ],
    options: {
      storage: ["128GB", "256GB", "512GB"],
      colors: ["Purple", "Black"],
      condition: ["A1-Stock", "A2-Stock", "B1-Stock", "RC1-Stock"],
    },
    variants: [
      { storage: "128GB", condition: "A1-Stock", price: 400, originalPrice: 500 },
      { storage: "256GB", condition: "A1-Stock", price: 450, originalPrice: 560 },
      { storage: "256GB", condition: "B1-Stock", price: 420, originalPrice: 530 },
      { storage: "512GB", condition: "A1-Stock", price: 500, originalPrice: 620 },
    ],
  },
  {
    id: 4,
    brand: "samsung",
    name: "Galaxy S21 Ultra",
    image: "/images/Galaxy-S21-600x817.jpg",
    rating: 4.6,
    popularity: 350,
    createdAt: 1680000000,
    description: "GSM Unlocked. Samsung Galaxy S21 Ultra with 108MP camera and S Pen support.",
    extraInfo: [
      { label: "Network", value: "GSM Unlocked" },
      { label: "OS", value: "Android 11" },
    ],
    options: {
      storage: ["128GB", "256GB", "512GB"],
      colors: ["Purple", "Black"],
      condition: ["A1-Stock", "A2-Stock", "B1-Stock", "RC1-Stock"],
    },
    variants: [
      { storage: "128GB", condition: "A1-Stock", price: 450, originalPrice: 560 },
      { storage: "256GB", condition: "A1-Stock", price: 500, originalPrice: 620 },
      { storage: "256GB", condition: "B1-Stock", price: 480, originalPrice: 595 },
      { storage: "512GB", condition: "A1-Stock", price: 500, originalPrice: 620 },
    ],
  },
  {
    id: 5,
    brand: "apple",
    name: "iPhone 12 Mini",
    image: "/images/iPhone_12-600x817.jpg",
    rating: 4.2,
    popularity: 190,
    createdAt: 1685000000,
    description: "GSM Unlocked. iPhone 12 Mini — the smallest, thinnest 5G iPhone ever.",
    extraInfo: [
      { label: "Network", value: "GSM Unlocked" },
      { label: "OS", value: "iOS 14" },
    ],
    options: {
      storage: ["64GB", "128GB", "256GB"],
      colors: ["Black", "Blue", "White"],
      condition: ["A1-Stock", "A2-Stock", "B1-Stock", "B2-Stock", "RC1-Stock"],
    },
    variants: [
      { storage: "64GB",  condition: "A1-Stock", price: 250, originalPrice: 320 },
      { storage: "128GB", condition: "A1-Stock", price: 340, originalPrice: 420 },
      { storage: "128GB", condition: "B1-Stock", price: 310, originalPrice: 390 },
      { storage: "256GB", condition: "A1-Stock", price: 380, originalPrice: 460 },
    ],
  },
];

/* ✅ STAR RATING DISPLAY */
const StarRating = ({ rating }: { rating: number }) => {
  return (
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
};

/* ✅ CARD */
const ProductCard = ({ item }: { item: Product }) => {
  const prices    = item.variants.map((v) => v.price);
  const origPrices = item.variants.map((v) => v.originalPrice ?? v.price);
  const min     = Math.min(...prices);
  const max     = Math.max(...prices);
  const origMin = Math.min(...origPrices);
  const origMax = Math.max(...origPrices);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm bg-white dark:bg-gray-800 dark:text-white relative flex flex-col">
      {/* Sale badge */}
      <span className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full z-10">
        Sale!
      </span>

      <img src={item.image} alt={item.name} className="h-40 object-contain mx-auto" />

      <h3 className="font-semibold mt-2 text-sm">{item.name}</h3>

      <StarRating rating={item.rating} />

      <div className="flex items-center gap-2 mt-1 flex-wrap">
        <span className="text-gray-400 line-through text-xs">${origMin} – ${origMax}</span>
        <span className="text-purple-600 font-bold text-sm">${min} – ${max}</span>
      </div>

      <Link
        href={`/product/${item.id}`}
        className="mt-3 w-full border border-gray-300 dark:border-gray-600 text-sm py-1.5 rounded text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        Select options
      </Link>
    </div>
  );
};

/* ✅ SORT OPTIONS — matches reference exactly */
const sortOptions = [
  { value: "default",    label: "Default sorting" },
  { value: "popularity", label: "Sort by popularity" },
  { value: "rating",     label: "Sort by average rating" },
  { value: "latest",     label: "Sort by latest" },
  { value: "low",        label: "Sort by price: low to high" },
  { value: "high",       label: "Sort by price: high to low" },
];

/* ✅ MAIN */
export default function ProductPage() {
  const [sortType, setSortType]               = useState("default");
  const [search, setSearch]                   = useState("");
  const [selectedBrand, setSelectedBrand]     = useState("");
  const [selectedColor, setSelectedColor]     = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
  const [priceRange, setPriceRange]           = useState(1000);

  const getMinPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price));

  /* ✅ FILTER */
  const filteredProducts = dummyProducts.filter((p) => {
    const minPrice = getMinPrice(p);
    return (
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())) &&
      (selectedBrand ? p.brand.toLowerCase() === selectedBrand.toLowerCase() : true) &&
      (selectedColor.length ? p.options.colors.some((c) => selectedColor.includes(c)) : true) &&
      (selectedCondition.length ? p.options.condition.some((c) => selectedCondition.includes(c)) : true) &&
      minPrice <= Number(priceRange)
    );
  });

  /* ✅ SORT — all 6 modes */
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortType) {
      case "popularity": return b.popularity - a.popularity;
      case "rating":     return b.rating - a.rating;
      case "latest":     return b.createdAt - a.createdAt;
      case "low":        return getMinPrice(a) - getMinPrice(b);
      case "high":       return getMinPrice(b) - getMinPrice(a);
      default:           return a.id - b.id;
    }
  });

  return (
    <div className="w-full dark:text-white dark:bg-gray-900 min-h-screen">

      <h1 className="text-2xl font-bold mb-4 px-4 pt-4">Products</h1>

      {/* BRAND IMAGES */}
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

        {/* LEFT FILTER */}
        <div className="w-1/4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-100 dark:bg-gray-800 self-start">

          <h2 className="text-xl font-bold mb-4">Filter Product</h2>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            className="w-full mb-4 p-2 border rounded text-gray-950 dark:text-white dark:bg-gray-700 dark:border-gray-600"
            onChange={(e) => setSearch(e.target.value)}
          />

          <h3 className="font-semibold mt-4 mb-2">Brand</h3>
          {["Apple", "Samsung"].map((b) => (
            <div key={b} className="flex items-center gap-2 mb-1">
              <input
                type="radio"
                name="brand"
                checked={selectedBrand === b}
                onChange={() => setSelectedBrand(b)}
              />
              <label>{b}</label>
            </div>
          ))}

          <h3 className="font-semibold mt-4 mb-2">Price</h3>
          <input
            type="range"
            min="100"
            max="1000"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
          <p className="text-sm mt-1">Up to ${priceRange}</p>

          <h3 className="font-semibold mt-4 mb-2">Select Color</h3>
          {["Black", "Blue", "Gold", "Purple"].map((c) => (
            <div key={c} className="flex items-center gap-2 mb-1">
              <input
                type="checkbox"
                checked={selectedColor.includes(c)}
                onChange={(e) => {
                  if (e.target.checked) setSelectedColor([...selectedColor, c]);
                  else setSelectedColor(selectedColor.filter((x) => x !== c));
                }}
              />
              <label>{c}</label>
            </div>
          ))}

          <h3 className="font-semibold mt-4 mb-2">Condition</h3>
          {["A1-Stock", "A2-Stock", "B1-Stock", "B2-Stock", "RC1-Stock"].map((c) => (
            <div key={c} className="flex items-center gap-2 mb-1">
              <input
                type="checkbox"
                checked={selectedCondition.includes(c)}
                onChange={(e) => {
                  if (e.target.checked) setSelectedCondition([...selectedCondition, c]);
                  else setSelectedCondition(selectedCondition.filter((x) => x !== c));
                }}
              />
              <label>{c}</label>
            </div>
          ))}

          <button
            onClick={() => {
              setSearch("");
              setSelectedBrand("");
              setSelectedColor([]);
              setSelectedCondition([]);
              setPriceRange(1000);
            }}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded w-full transition-colors"
          >
            Reset
          </button>
        </div>

        {/* RIGHT PRODUCTS */}
        <div className="w-3/4">

          {/* Top bar: result count + sort */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing 1–{sortedProducts.length} of {dummyProducts.length} results
            </p>

            {/* Sort dropdown — styled to match reference */}
            <div className="relative">
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded px-4 py-2 pr-10 appearance-none bg-white dark:bg-gray-800 text-sm text-black dark:text-white focus:outline-none focus:border-purple-500 min-w-[200px]"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-4">All Products</h1>

          {sortedProducts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 mt-10">No products match your filters.</p>
          ) : (
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
