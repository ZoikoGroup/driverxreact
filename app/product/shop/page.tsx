"use client";

import React, { useState } from "react";
import Link from "next/link";

/* ✅ PRODUCT DATA */
const dummyProducts = [
  {
    
    id: 1,
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
];

/* ✅ CARD */
const ProductCard = ({ item }) => {
  const getMinPrice = (product) =>
    Math.min(...product.variants.map((v) => v.price));

  return (
    <div className="border rounded-xl p-4 shadow-sm dark:text-white dark:bg-gray-900">
      <img src={item.image} className="h-40 object-contain mx-auto dark:text-white dark:bg-gray-900" />

      <h3 className="font-semibold mt-2">{item.name}</h3>

      <p className="text-teal-600 font-bold">
        ${getMinPrice(item)}
      </p>

      {/* ✅ BUTTON */}
      <Link
  href={`/product/${item.id}`}
  className="mt-3 w-full bg-teal-500 dark:text-white dark:bg-teal-900 text-white py-2 rounded block text-center"
>
  Select Options
</Link>
    </div>
  );
};

/* ✅ MAIN */
export default function ProductPage() {
  const [sortType, setSortType] = useState("default");

  const getMinPrice = (p) =>
    Math.min(...p.variants.map((v) => v.price));

const sortedProducts = [...dummyProducts].sort((a, b) => {
  if (sortType === "low") return getMinPrice(a) - getMinPrice(b);
  if (sortType === "high") return getMinPrice(b) - getMinPrice(a);
  return a.id - b.id; 
  });

  return (
    <div className="p-6 max-w-6xl mx-auto dark:text-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4 dark:text-white dark:bg-gray-900">Products</h1>

      {/* SORT */}
      <select
        className="mb-6 border px-3 py-2 dark:text-white dark:bg-gray-900"
        onChange={(e) => setSortType(e.target.value)}
      >
        <option value="default">Sort</option>
        <option value="low">Low → High</option>
        <option value="high">High → Low</option>
      </select>

      <div className="grid grid-cols-3 gap-6">
        {sortedProducts.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}