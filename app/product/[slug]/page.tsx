"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetailPage() {
  const { slug } = useParams();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  const [selected, setSelected] = useState({
    storage: "",
    color: "",
    condition: "",
  });

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // ✅ Fetch product
  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://api.driverxmobile.com/api/products/${slug}/`
        );
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
  const fetchRelated = async () => {
    try {
      const res = await fetch("https://api.driverxmobile.com/api/products/");
      const data = await res.json();

      // exclude current product
      const filtered = data.results.filter(
        (p: any) => p.slug !== slug
      );

      setRelatedProducts(filtered);
    } catch (err) {
      console.error("Related API error:", err);
    }
  };

  fetchRelated();
}, [slug]);

  // ✅ Loading / error
  if (loading) return <div className="p-10">Loading...</div>;
  if (!product) return <div className="p-10">Product not found</div>;

  // ✅ FIXED IMAGE LOGIC
  const mainImage =
    product.images?.find((img: any) => img.is_primary)?.image ||
    product.images?.[0]?.image ||
    "/images/placeholder.png";


  // ✅ Extract options dynamically
  const getOptions = (slug: string) => {
    return (
      product.attribute_options.find((a: any) => a.slug === slug)?.options || []
    );
  };

  const storageOptions = getOptions("storage");
  const colorOptions = getOptions("color");
  const conditionOptions = getOptions("condition");

  // ✅ Map variants
  const variants = product.variants.map((v: any) => ({
    storage: v.attributes_dict?.Storage,
    color: v.attributes_dict?.Color,
    condition: v.attributes_dict?.Condition,
    price: Number(v.price),
  }));

  // ✅ Get selected variant
  const getVariant = () => {
    return variants.find(
      (v: any) =>
        v.storage === selected.storage &&
        v.color === selected.color &&
        v.condition === selected.condition
    );
  };

  const variant = getVariant();

  const range = {
    min: product.price_min,
    max: product.price_max,
  };

  const isValid =
    selected.storage && selected.color && selected.condition;

  const tabs = [
    { key: "description", label: "Description" },
    { key: "additional", label: "Additional information" },
    { key: "reviews", label: "Reviews (0)" },
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

      {/* Main */}
      <div className="px-10 py-8 grid grid-cols-2 gap-12">

        {/* Image */}
        <div className="flex items-center justify-center border rounded-lg h-[480px] bg-white dark:bg-gray-800">
          {(product?.images?.find((img: any) => img.is_primary)?.image ||
  product?.images?.[0]?.image) ? (
  <Image
    src={
      product.images.find((img: any) => img.is_primary)?.image ||
      product.images[0]?.image
    }
    alt={product.name}
    width={380}
    height={380}
    className="object-contain max-h-[440px]"
  />
) : (
  <Image
    src="/images/placeholder.png"
    alt="placeholder"
    width={380}
    height={380}
  />
)}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          {/* Price */}
          <div className="mb-6">
            {variant ? (
              <span className="text-purple-600 text-2xl font-semibold">
                ${variant.price}
              </span>
            ) : (
              <span className="text-purple-600 text-2xl font-semibold">
                ${range.min} – ${range.max}
              </span>
            )}
          </div>

          {/* Storage */}
          <div className="mb-4">
            <label className="block mb-1 text-sm">Storage</label>
            <select
              value={selected.storage}
              onChange={(e) =>
                setSelected({ ...selected, storage: e.target.value })
              }
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="">Choose</option>
              {storageOptions.map((s: string) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div className="mb-4">
            <label className="block mb-1 text-sm">Color</label>
            <select
              value={selected.color}
              onChange={(e) =>
                setSelected({ ...selected, color: e.target.value })
              }
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="">Choose</option>
              {colorOptions.map((c: string) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div className="mb-4">
            <label className="block mb-1 text-sm">Condition</label>
            <select
              value={selected.condition}
              onChange={(e) =>
                setSelected({ ...selected, condition: e.target.value })
              }
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="">Choose</option>
              {conditionOptions.map((c: string) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-1 border"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-1 border"
            >
              +
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              disabled={!isValid}
              className={`px-5 py-2 rounded ${
                isValid
                  ? "bg-purple-600 text-white"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              Add to cart
            </button>

            <button
              disabled={!isValid}
              className={`px-5 py-2 rounded ${
                isValid
                  ? "bg-purple-800 text-white"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-10 mt-6">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 ${
                activeTab === tab.key
                  ? "border-b-2 border-purple-600"
                  : ""
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-6">
          {activeTab === "description" && (
            <p className="text-sm text-gray-600">
              {product.description || "No description available"}
            </p>
          )}

          {activeTab === "additional" && (
            <table className="w-full text-sm border">
              <tbody>
                <tr>
                  <td className="p-2 font-medium">Brand</td>
                  <td className="p-2">{product.category?.name}</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Network</td>
                  <td className="p-2">{product.network || "-"}</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">OS</td>
                  <td className="p-2">{product.os || "-"}</td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === "reviews" && (
            <div>
              <p>No reviews yet</p>

              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={`text-2xl ${
                      star <= (hoverRating || rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
<div className="px-10 py-10">
  <h2 className="text-2xl font-semibold mb-6">Related Products</h2>

  <div className="grid grid-cols-4 gap-6">
    {relatedProducts.map((item: any) => (
      <Link
        key={item.id}
        href={`/product/${item.slug}`}
        className="border rounded-lg p-4 hover:shadow-lg transition bg-white dark:bg-gray-800"
      >
        {/* Image */}
        <div className="flex items-center justify-center h-[200px] mb-4">
          {item.primary_image ? (
            <Image
              src={item.primary_image}
              alt={item.name}
              width={200}
              height={200}
              className="object-contain max-h-[180px]"
            />
          ) : (
            <Image
              src="/images/placeholder.png"
              alt="placeholder"
              width={200}
              height={200}
            />
          )}
        </div>

        {/* Name */}
        <h3 className="text-sm font-medium mb-2">{item.name}</h3>

        {/* Price */}
        <p className="text-purple-600 font-semibold text-sm">
          ${item.price_min} – ${item.price_max}
        </p>
      </Link>
    ))}
  </div>
</div>

    </div>
  );
}