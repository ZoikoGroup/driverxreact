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
];

/* PAGE */
export default function ProductDetailPage() {
  const { id } = useParams();

  const product = dummyProducts.find(
    (p) => p.id === Number(id)
  );

  const [selected, setSelected] = useState({
    storage: "",
    condition: "",
  });

  const getPrice = () => {
    const match = product?.variants.find(
      (v) =>
        v.storage === selected.storage &&
        v.condition === selected.condition
    );
    return match?.price;
  };

  const price = getPrice();

  if (!product) return <div>Product not found</div>;

  return (
    <div className="p-10 grid grid-cols-2 gap-10  dark:text-white dark:bg-gray-900 ">
      

      {/* IMAGE */}
      <img src={product.image} className="w-full" />

      {/* DETAILS */}
      <div>
        <h1 className="text-2xl font-bold dark:text-white dark:bg-gray-900">{product.name}</h1>

        <p className="text-teal-600 text-xl mt-2">
          {price ? `$${price}` : "Select options"}
        </p>

        {/* STORAGE */}
     <select
  onChange={(e) =>
    setSelected({ ...selected, storage: e.target.value })
  }
  className="border p-2 mt-4 w-full dark:text-white dark:bg-gray-900"
>
  <option value="">Select Storage</option> {/* ✅ FIX */}
  {product.options.storage.map((s) => (
    <option key={s} value={s}> {/* ✅ ADD value */}
      {s}
    </option>
  ))}
</select>

        {/* CONDITION */}
        <select
  onChange={(e) =>
    setSelected({ ...selected, condition: e.target.value })
  }
  className="border p-2 mt-4 w-full dark:text-white dark:bg-gray-900" 
>
  <option value="">Select Condition</option> {/* ✅ FIX */}
  {product.options.condition.map((c) => (
    <option key={c} value={c}> {/* ✅ ADD value */}
      {c}
    </option>
  ))}
</select> 

        <button
          disabled={!price}
          className="mt-6 bg-teal-300 dark:text-white dark:bg-teal-900 text-white px-6 py-2 rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}