"use client";
import Image from "next/image";


import { useParams } from "next/navigation";
import { useState } from "react";

/* SAME DATA (you can later move to separate file) */
const dummyProducts = [
  {
    id: 1,
    brand: "apple",
    name: "iPhone 13 Pro",
    image: "/images/iphone-13-pro-mlvw3hn-a-apple-original-imag6vpcvspnzyfy.png",
    options: {
      storage: ["128GB", "256GB", "512GB"],
      colors: ["Silver", "Gold", "Graphite"],
      condition: ["A1", "A2", "A3", "B1", "B2", "C1"],
    },
    variants: [
      { storage: "128GB", condition: "A1", price: 500 },
      { storage: "128GB", condition: "A2", price: 480 },
      { storage: "256GB", condition: "A1", price: 550 },
      { storage: "512GB", condition: "A1", price: 600 },
    ],
  },
  {
    id: 2,
    brand: "apple",
    name: "iPhone 12",
    image: "/images/apple-iphone-12-dummyapplefsn-original-imafwg8dkyh2zgrh.png",
    options: {
      storage: ["64GB", "128GB", "256GB"],
      colors: ["Black", "Blue", "White"],
      condition: ["A1", "A2", "B1", "B2", "C1"],
    },
    variants: [
      { storage: "64GB", condition: "A1", price: 300 },
      { storage: "128GB", condition: "A1", price: 340 },
      { storage: "128GB", condition: "B1", price: 310 },
      { storage: "256GB", condition: "A1", price: 380 },
    ],
  },
  {
    id: 3,
    brand: "samsung",
    name: "Galaxy Z Flip 4",
    image: "/images/original-imahfay2yzrfjggn.png",
    options: {
      storage: ["128GB", "256GB", "512GB"],
      colors: ["Purple", "Black"],
      condition: ["A1", "A2", "B1", "C1"],
    },
    variants: [
      { storage: "128GB", condition: "A1", price: 400 },
      { storage: "256GB", condition: "A1", price: 450 },
      { storage: "256GB", condition: "B1", price: 420 },
      { storage: "512GB", condition: "A1", price: 500 },
    ],
  },
  {
    id: 4,
    brand: "samsung",
    name: "Galaxy S21 ultra",
    image: "/images/Galaxy-S21-600x817.jpg",
    options: {
      storage: ["128GB", "256GB", "512GB"],
      colors: ["Purple", "Black"],
      condition: ["A1", "A2", "B1", "C1"],
    },
    variants: [
      { storage: "128GB", condition: "A1", price: 450 },
      { storage: "256GB", condition: "A1", price: 500 },
      { storage: "256GB", condition: "B1", price: 480 },
      { storage: "512GB", condition: "A1", price: 500 },
    ],
  },
   {
    id: 5,
    brand: "apple",
    name:  "iPhone 12 mini",
    image: "/images/iPhone_12-600x817.jpg",
    options: {
      storage: ["64GB", "128GB", "256GB"],
      colors: ["Black", "Blue", "White"],
      condition: ["A1", "A2", "B1", "B2", "C1"],
    },
    variants: [
      { storage: "64GB", condition: "A1", price: 250 },
      { storage: "128GB", condition: "A1", price: 340 },
      { storage: "128GB", condition: "B1", price: 310 },
      { storage: "256GB", condition: "A1", price: 380 },
    ],
  },
];
/* SAME DATA */

export default function ProductDetailPage() {
  const { id } = useParams();

  const product = dummyProducts.find(
    (p) => p.id === Number(id)
  );

  const relatedProducts = dummyProducts.filter(
  (p) => p.id !== product.id && p.brand === product.brand
);

  const [selected, setSelected] = useState({
    storage: "",
    condition: "",
  });

  const [color, setColor] = useState("");

  // ✅ FIX: prevent crash
  if (!product) return <div>Product not found</div>;

  const getPriceRange = () => {
    const prices = product.variants.map((v) => v.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  };

  const getPrice = () => {
    if (!selected.storage || !selected.condition) return null;

    const match = product.variants.find(
      (v) =>
        v.storage === selected.storage &&
        v.condition === selected.condition
    );

    return match?.price || null;
  };

  const price = getPrice();
  const range = getPriceRange();

  return (
    <>
   <div className="w-full p-10 grid grid-cols-2 gap-10 bg-white text-black dark:bg-gray-900 dark:text-white">
      {/* IMAGE */}
      <div className="flex items-center justify-center h-[500px]">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={400}
          className="object-contain"
        />
      </div>

      {/* DETAILS */}
      <div>
        <h1 className="text-2xl font-bold">
          {product.name}
        </h1>

        <p className="text-orange-500 text-xl mt-2">
          {price ? `$${price}` : `$${range.min} - $${range.max}`}
        </p>

        {/* STORAGE */}
        <select
          onChange={(e) =>
            setSelected({ ...selected, storage: e.target.value })
          }
          className="border p-2 mt-4 w-full bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
        >
          <option value="">Select Storage</option>
          {product.options.storage.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* COLOR */}
        <select
          onChange={(e) => setColor(e.target.value)}
          className="border p-2 mt-4 w-full bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
        >
          <option value="">Select Color</option>
          {product.options.colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* CONDITION */}
        <select
          onChange={(e) =>
            setSelected({ ...selected, condition: e.target.value })
          }
          className="border p-2 mt-4 w-full bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
        >
          <option value="">Select Condition</option>
          {product.options.condition.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          disabled={!price}
          className={`mt-6 px-6 py-2 rounded ${
            price
              ? "bg-orange-500 text-white"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Add to Cart
        </button>
      </div>
    </div>

{/* RELATED PRODUCTS */}
<div className="mt-20  dark:text-white dark:bg-gray-900">
  <h2 className="text-xl font-semibold mb-6  dark:text-white dark:bg-gray-900">
    You may also like
  </h2>

  <div className="grid grid-cols-4 gap-6  dark:text-white dark:bg-gray-900">
    {relatedProducts.map((item) => {
      const prices = item.variants.map(v => v.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);

      return (
        <div
          key={item.id}
          className="border p-4 rounded  dark:text-white dark:bg-gray-900 bg-white dark:bg-gray-800 dark:border-gray-700"
        >
          <Image
            src={item.image}
            alt={item.name}
            width={200}
            height={200}
            className="mx-auto object-contain  dark:text-white dark:bg-gray-900"
          />

          <h3 className="mt-4 font-medium text-sm  dark:text-white dark:bg-gray-900">
            {item.name}
          </h3>

          <p className="text-orange-500 text-sm">
            ${min} - ${max}
          </p>
        </div>
      );
    })}
  </div>
</div>

</>
  );
}