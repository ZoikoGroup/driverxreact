"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

const productData: any = {
  "galaxy-s21-5g": {
    name: "Galaxy S21 5G",
    price: "$176.47 – $235.29",
    image: "/images/s21.png",
    storage: ["128GB", "256GB"],
    color: ["Black", "White", "Pink"],
    condition: ["New", "Refurbished"],
  },
  "galaxy-s21-ultra": {
    name: "Galaxy S21 Ultra 5G",
    price: "$247.06 – $305.88",
    image: "/images/s21-ultra.png",
    storage: ["256GB", "512GB"],
    color: ["Black", "Silver"],
    condition: ["New", "Refurbished"],
  },
  "galaxy-s22": {
    name: "Galaxy S22",
    price: "$188.24 – $247.06",
    image: "/images/s22.png",
    storage: ["128GB", "256GB"],
    color: ["Green", "Black", "White"],
    condition: ["New", "Refurbished"],
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const product = productData[params.id as string];

  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

  if (!product) return <div className="p-10">Product not found</div>;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      
      {/* IMAGE */}
      <div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full max-w-md mx-auto"
        />
      </div>

      {/* DETAILS */}
      <div>
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-orange-500 text-lg mb-6">{product.price}</p>

        {/* STORAGE */}
        <div className="mb-4">
          <label className="text-sm font-semibold">Storage</label>
          <select
            value={selectedStorage}
            onChange={(e) => setSelectedStorage(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg mt-1"
          >
            <option value="">Choose an option</option>
            {product.storage.map((s: string, i: number) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* COLOR */}
        <div className="mb-4">
          <label className="text-sm font-semibold">Select Colour</label>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg mt-1"
          >
            <option value="">Choose an option</option>
            {product.color.map((c: string, i: number) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* CONDITION */}
        <div className="mb-6">
          <label className="text-sm font-semibold">Condition</label>
          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg mt-1"
          >
            <option value="">Choose an option</option>
            {product.condition.map((c: string, i: number) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* BUTTON */}
        <button
          disabled={!selectedStorage || !selectedColor || !selectedCondition}
          className={`w-full py-3 rounded-xl text-white font-semibold transition ${
            selectedStorage && selectedColor && selectedCondition
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Add to Cart
        </button>
      </div>
    </section>
  );
}