"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

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
export default function ProductDetailPage() {
  const { id } = useParams();

  // ✅ All hooks BEFORE any early return (React rules of hooks)
  const [selected, setSelected]       = useState({ storage: "", condition: "" });
  const [color, setColor]             = useState("");
  const [quantity, setQuantity]       = useState(1);
  const [activeTab, setActiveTab]     = useState("description");
  const [rating, setRating]           = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const product = dummyProducts.find((p) => p.id === Number(id));

  // Safe early return AFTER all hooks
  if (!product) return <div className="p-10">Product not found</div>;

  // All other products shown as related (cross-brand, matches reference design)
  const relatedProducts = dummyProducts.filter((p) => p.id !== product.id);

  const getPriceRange = () => {
    const prices     = product.variants.map((v) => v.price);
    const origPrices = product.variants.map((v) => v.originalPrice ?? v.price);
    return {
      min:     Math.min(...prices),
      max:     Math.max(...prices),
      origMin: Math.min(...origPrices),
      origMax: Math.max(...origPrices),
    };
  };

  const getVariant = () => {
    if (!selected.storage || !selected.condition) return null;
    return (
      product.variants.find(
        (v) => v.storage === selected.storage && v.condition === selected.condition
      ) ?? null
    );
  };

  const variant = getVariant();
  const range   = getPriceRange();

  const tabs = [
    { key: "description", label: "Description" },
    { key: "additional",  label: "Additional information" },
    { key: "reviews",     label: "Reviews (0)" },
  ];

  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">

      {/* Breadcrumb */}
      <div className="px-10 pt-6 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="text-purple-600 hover:underline">Home</Link>
        {" » "}
        <Link href="/shop" className="text-purple-600 hover:underline">Shop</Link>
        {" » "}
        <span>{product.name}</span>
      </div>

      {/* Main product area */}
      <div className="px-10 py-8 grid grid-cols-2 gap-12">

        {/* Image */}
        <div className="flex items-center justify-center border border-gray-100 dark:border-gray-700 rounded-lg h-[480px] bg-white dark:bg-gray-800">
          <Image
            src={product.image}
            alt={product.name}
            width={380}
            height={380}
            className="object-contain max-h-[440px]"
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          {/* Price range or selected price */}
          <div className="mb-6">
            {variant ? (
              <div className="flex items-center gap-3">
                {variant.originalPrice && (
                  <span className="text-gray-400 line-through text-lg">${variant.originalPrice}</span>
                )}
                <span className="text-purple-600 text-2xl font-semibold">${variant.price}</span>
              </div>
            ) : (
              <span className="text-purple-600 text-2xl font-semibold">
                ${range.min} – ${range.max}
              </span>
            )}
          </div>

          {/* Storage */}
          <div className="flex items-center gap-4 mb-4">
            <label className="w-32 text-sm font-medium text-gray-600 dark:text-gray-300 shrink-0">Storage</label>
            <div className="relative flex-1">
              <select
                value={selected.storage}
                onChange={(e) => setSelected({ ...selected, storage: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 pr-8 appearance-none bg-white dark:bg-gray-800 text-black dark:text-white text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="">Choose an option</option>
                {product.options.storage.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
            </div>
          </div>

          {/* Colour */}
          <div className="flex items-center gap-4 mb-4">
            <label className="w-32 text-sm font-medium text-gray-600 dark:text-gray-300 shrink-0">Select Colour</label>
            <div className="relative flex-1">
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 pr-8 appearance-none bg-white dark:bg-gray-800 text-black dark:text-white text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="">Choose an option</option>
                {product.options.colors.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
            </div>
          </div>

          {/* Condition */}
          <div className="flex items-start gap-4 mb-1">
            <label className="w-32 text-sm font-medium text-gray-600 dark:text-gray-300 shrink-0 pt-2">Condition</label>
            <div className="flex-1">
              <div className="relative">
                <select
                  value={selected.condition}
                  onChange={(e) => setSelected({ ...selected, condition: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 pr-8 appearance-none bg-white dark:bg-gray-800 text-black dark:text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="">Choose an option</option>
                  {product.options.condition.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
              </div>
              {selected.condition && (
                <button
                  onClick={() => setSelected({ ...selected, condition: "" })}
                  className="text-xs text-purple-500 mt-1 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Resolved price shown again after selection */}
          {variant && (
            <div className="flex items-center gap-3 my-4">
              {variant.originalPrice && (
                <span className="text-gray-400 line-through">${variant.originalPrice}</span>
              )}
              <span className="text-purple-600 text-xl font-bold">${variant.price}</span>
            </div>
          )}

          {/* Quantity + action buttons */}
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
              disabled={!variant}
              className={`px-5 py-2 rounded text-sm font-medium transition-colors ${
                variant
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              Add to cart
            </button>

            <button
              disabled={!variant}
              className={`px-5 py-2 rounded text-sm font-medium transition-colors ${
                variant
                  ? "bg-purple-800 hover:bg-purple-900 text-white"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
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

          {/* Description — renders product.description from the data object */}
          {activeTab === "description" && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Additional information — auto-renders options + extraInfo rows */}
          {activeTab === "additional" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Additional information</h2>
              <table className="w-full text-sm border border-gray-200 dark:border-gray-700">
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-4 font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 w-40">Storage</td>
                    <td className="py-3 px-4">{product.options.storage.join(", ")}</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-4 font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 w-40">Select Colour</td>
                    <td className="py-3 px-4">{product.options.colors.join(", ")}</td>
                  </tr>
                  <tr className={product.extraInfo?.length ? "border-b border-gray-200 dark:border-gray-700" : ""}>
                    <td className="py-3 px-4 font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 w-40">Condition</td>
                    <td className="py-3 px-4">{product.options.condition.join(", ")}</td>
                  </tr>
                  {product.extraInfo?.map((row, i) => (
                    <tr
                      key={row.label}
                      className={
  i < (product.extraInfo?.length ?? 0) - 1
    ? "border-b border-gray-200 dark:border-gray-700"
    : ""
}
                    >
                      <td className="py-3 px-4 font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 w-40">{row.label}</td>
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

      {/* Related Products */}
      <div className="px-10 pb-10">
        <h2 className="text-xl font-semibold mb-6">Related products</h2>
        <div className="grid grid-cols-4 gap-6">
          {relatedProducts.map((item) => {
            const prices     = item.variants.map((v) => v.price);
            const origPrices = item.variants.map((v) => v.originalPrice ?? v.price);
            const min        = Math.min(...prices);
            const max        = Math.max(...prices);
            const origMin    = Math.min(...origPrices);
            const origMax    = Math.max(...origPrices);

            return (
              // ✅ href uses /product/[id] — matches your actual Next.js route
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow relative flex flex-col"
              >
                <span className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full z-10">
                  Sale!
                </span>

                <Image
                  src={item.image}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="mx-auto object-contain h-44"
                />

                <h3 className="mt-3 font-medium text-sm">{item.name}</h3>

                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-gray-400 line-through text-xs">${origMin} – ${origMax}</span>
                  <span className="text-purple-600 text-sm font-semibold">${min} – ${max}</span>
                </div>

                <button className="mt-3 w-full border border-gray-300 dark:border-gray-600 text-sm py-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Select options
                </button>
              </Link>
            );
          })}
        </div>
      </div>

      

    </div>
  );
}
