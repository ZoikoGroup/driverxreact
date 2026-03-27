"use client";

import React, { useState } from "react";

// Dummy product data
const dummyProducts = [
  {
    id: 1,
    name: "iPhone 13 Pro",
    price: 482,
    rating: 4.8,
    sales: 120,
    createdAt: "2024-01-10",
    image: "https://via.placeholder.com/200",
  },
  {
    id: 2,
    name: "iPhone 12",
    price: 311,
    rating: 4.5,
    sales: 200,
    createdAt: "2023-12-01",
    image: "https://via.placeholder.com/200",
  },
  {
    id: 3,
    name: "Galaxy Z Flip 4",
    price: 305,
    rating: 4.3,
    sales: 150,
    createdAt: "2024-02-15",
    image: "https://via.placeholder.com/200",
  },
];

const sortOptions = [
  { label: "Default sorting", value: "default" },
  { label: "Sort by popularity", value: "popularity" },
  { label: "Sort by average rating", value: "rating" },
  { label: "Sort by latest", value: "latest" },
  { label: "Sort by price: low to high", value: "price_low" },
  { label: "Sort by price: high to low", value: "price_high" },
];

const sortProducts = (products: typeof dummyProducts, sortType: string) => {
  const sorted = [...products];

  switch (sortType) {
    case "price_low":
      return sorted.sort((a, b) => a.price - b.price);

    case "price_high":
      return sorted.sort((a, b) => b.price - a.price);

    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);

    case "latest":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

    case "popularity":
      return sorted.sort((a, b) => b.sales - a.sales);

    default:
      return products;
  }
};

export default function ProductSortPage() {
  const [sortType, setSortType] = useState("default");
  const [products, setProducts] = useState(dummyProducts);

  const handleSortChange = (value: string) => {
    setSortType(value);
    const sorted = sortProducts(dummyProducts, value);
    setProducts(sorted);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">Showing {products.length} results</p>

        <select
          value={sortType}
          onChange={(e) => handleSortChange(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover mb-4 rounded-md"
            />

            <h3 className="font-semibold text-lg">{item.name}</h3>

            <p className="text-gray-500 text-sm mb-2">
              ⭐ {item.rating} | Sold: {item.sales}
            </p>

            <p className="text-orange-600 font-bold text-lg">
              ${item.price}
            </p>

            <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600">
              Select options
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}