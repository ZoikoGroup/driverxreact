"use client";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  brand: string;
  name: string;
  image: string;
  options: {
    storage: string[];
    colors: string[];
    condition: string[];
  };
  variants: {
    storage: string;
    condition: string;
    price: number;
  }[];
};

/* ✅ PRODUCT DATA */
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

/* ✅ CARD */
const ProductCard = ({ item }: { item: Product }) => {
const getMinPrice = (product: Product) =>
  Math.min(...product.variants.map((v) => v.price));

  return (
    <div className="border rounded-xl p-4 shadow-sm dark:text-white dark:bg-gray-900">
      <img
        src={item.image}
        className="h-40 object-contain mx-auto"
      />

      <h3 className="font-semibold mt-2">{item.name}</h3>

      <p className="text-teal-600 font-bold">
        ${getMinPrice(item)}
      </p>

      <Link
        href={`/product/${item.id}`}
        className="mt-3 w-full bg-teal-500 dark:bg-teal-900 text-white py-2 rounded block text-center"
      >
        Select Options
      </Link>
    </div>
  );
};

/* ✅ MAIN */
export default function ProductPage() {
  const [sortType, setSortType] = useState("default");

  /* ✅ MOVED HOOKS INSIDE */
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
const [selectedColor, setSelectedColor] = useState<string[]>([]);
const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(1000);

const getMinPrice = (p: Product) =>
  Math.min(...p.variants.map((v) => v.price));

  /* ✅ FILTER */
  const filteredProducts = dummyProducts.filter((p) => {
    const minPrice = getMinPrice(p);

    return (
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
 p.brand.toLowerCase().includes(search.toLowerCase())) &&
      (selectedBrand
        ? p.brand.toLowerCase() === selectedBrand.toLowerCase()
        : true) &&
      (selectedColor.length
        ? p.options.colors.some((c) => selectedColor.includes(c))
        : true) &&
      (selectedCondition.length
        ? p.options.condition.some((c) =>
            selectedCondition.includes(c)
          )
        : true) &&
      minPrice <= Number(priceRange)
    );
  });

  /* ✅ SORT */
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortType === "low") return getMinPrice(a) - getMinPrice(b);
    if (sortType === "high") return getMinPrice(b) - getMinPrice(a);
    return a.id - b.id;
  });

  return (
    <div className="w-full dark:text-white dark:bg-gray-900">

      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* BRAND IMAGES */}
      <div className="p-4">
        <div className="flex justify-center gap-8">
          <Image src="/images/samsung.png" alt="Samsung" width={120} height={60} />
          <Image src="/images/apple.png" alt="Apple" width={120} height={60} />
          <Image src="/images/oneplus.png" alt="OnePlus" width={120} height={60} />
          <Image src="/images/motorola.png" alt="Motorola" width={120} height={60} />
          <Image src="/images/google.png" alt="Google" width={120} height={60} />
          <Image src="/images/nokia-1.png" alt="Nokia" width={120} height={60} />
        </div>
      </div>

      <div className="flex gap-6">

        {/* LEFT FILTER */}
        <div className="w-1/4 p-4 border rounded-xl bg-gray-100 dark:bg-gray-800">

          <h2 className="text-xl font-bold mb-4">Filter Product</h2>

        <input
  type="text"
  placeholder="Search products..."
  value={search}
  className="w-full mb-4 p-2 border rounded text-gray-950"
  onChange={(e) => setSearch(e.target.value)}
/>
          <h3 className="font-semibold mt-4">Brand</h3>
          {["Apple", "Samsung"].map((b) => (
            <div key={b}>
              <input
                type="radio"
                name="brand"
                onChange={() => setSelectedBrand(b)}
              />{" "}
              {b}
            </div>
          ))}

          <h3 className="font-semibold mt-4">Price</h3>
          <input
            type="range"
            min="100"
            max="1000"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full"
          />
          <p>Up to ${priceRange}</p>

          <h3 className="font-semibold mt-4">Select Color</h3>
          {["Black", "Blue", "Gold", "Purple"].map((c) => (
            <div key={c}>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedColor([...selectedColor, c]);
                  } else {
                    setSelectedColor(
                      selectedColor.filter((x) => x !== c)
                    );
                  }
                }}
              />{" "}
              {c}
            </div>
          ))}

          <h3 className="font-semibold mt-4">Condition</h3>
          {["A1", "A2", "B1", "B2", "C1"].map((c) => (
            <div key={c}>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCondition([...selectedCondition, c]);
                  } else {
                    setSelectedCondition(
                      selectedCondition.filter((x) => x !== c)
                    );
                  }
                }}
              />{" "}
              {c}
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
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>

        {/* RIGHT PRODUCTS */}
        <div className="w-3/4">

         <div className="flex justify-end mb-6">
  <select
    className="border px-3 py-2 dark:bg-gray-900"
    onChange={(e) => setSortType(e.target.value)}
  >
    <option value="default">Sort</option>
    <option value="low">Low → High</option>
    <option value="high">High → Low</option>
  </select>
</div>

          <h1 className="text-3xl mb-4">All Product</h1>

          <div className="grid grid-cols-3 gap-6">
            {sortedProducts.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}