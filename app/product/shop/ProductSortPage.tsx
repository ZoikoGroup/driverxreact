"use client";

import React, { useState } from "react";


/* ✅ PRODUCT DATA WITH VARIANTS */
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

/* ✅ PRODUCT CARD COMPONENT */
const ProductCard = ({ item }) => {
  const [selected, setSelected] = useState({
    storage: "",
    color: "",
    condition: "",
  });

  const handleChange = (type, value) => {
    setSelected((prev) => ({ ...prev, [type]: value }));
  };

  /* ✅ GET PRICE BASED ON SELECTION */
  const getPrice = () => {
    const match = item.variants.find(
      (v) =>
        v.storage === selected.storage &&
        v.condition === selected.condition
    );

    return match ? match.price : null;
  };

  const price = getPrice();

  return (
    <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
      
      {/* IMAGE FIXED */}
      <div className="w-full aspect-square mb-4 bg-gray-100 flex items-center justify-center rounded-md">
        <img
          src={item.image}
          alt={item.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <h3 className="font-semibold text-lg mb-2">{item.name}</h3>

      {/* PRICE */}
      <p className="text-orange-600 font-bold text-lg mb-3">
        {price ? `$${price}` : "Select options"}
      </p>

      {/* STORAGE */}
      <div className="mb-3">
        <label className="text-sm font-medium">Storage</label>
        <select
          className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
          onChange={(e) => handleChange("storage", e.target.value)}
        >
          <option value="">Choose an option</option>
          {item.options.storage.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* COLOR */}
      <div className="mb-3">
        <label className="text-sm font-medium">Select Colour</label>
        <select
          className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
          onChange={(e) => handleChange("color", e.target.value)}
        >
          <option value="">Choose an option</option>
          {item.options.colors.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* CONDITION */}
      <div className="mb-4">
        <label className="text-sm font-medium">Condition</label>
        <select
          className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
          onChange={(e) => handleChange("condition", e.target.value)}
        >
          <option value="">Choose an option</option>
          {item.options.condition.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* BUTTON */}
      <button
        disabled={!price}
        className={`w-full py-2 rounded-md ${
          price
            ? "bg-orange-500 text-white hover:bg-orange-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Add to cart
      </button>
    </div>
  );
};

/* ✅ MAIN PAGE */
export default function ProductSortPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {dummyProducts.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}