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

  const CART_KEY = "driverx_checkout";

  // ================= FETCH PRODUCT =================
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

  // ================= RELATED =================
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(
          "https://api.driverxmobile.com/api/products/"
        );
        const data = await res.json();

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

  if (loading) return <div className="p-10">Loading...</div>;
  if (!product) return <div className="p-10">Product not found</div>;

  // ================= IMAGE =================
  const mainImage =
    product.images?.find((img: any) => img.is_primary)?.image ||
    product.images?.[0]?.image ||
    "/images/placeholder.png";

  // ================= OPTIONS =================
  const getOptions = (slug: string) => {
    return (
      product.attribute_options.find((a: any) => a.slug === slug)?.options || []
    );
  };

  const storageOptions = getOptions("storage");
  const colorOptions = getOptions("color");

  // ================= VARIANTS =================
  const variants = product.variants.map((v: any) => ({
    storage: v.attributes_dict?.Storage,
    color: v.attributes_dict?.Color,
    condition: v.attributes_dict?.Condition,
    price: Number(v.price),
  }));

  // ================= CONDITION FILTER (FIX) =================
  const conditionOptions = variants
    .filter(
      (v: any) =>
        (!selected.storage || v.storage === selected.storage) &&
        (!selected.color || v.color === selected.color)
    )
    .map((v: any) => v.condition)
    .filter((v: any, i: number, arr: any[]) => arr.indexOf(v) === i);

  // ================= GET VARIANT =================
  const getVariant = () => {
    return variants.find(
      (v: any) =>
        v.storage === selected.storage &&
        v.color === selected.color &&
        v.condition === selected.condition
    );
  };

  const variant = getVariant();

  const isValid =
    selected.storage && selected.color && selected.condition;

  // ================= CART =================
  const saveToCart = (item: any) => {
    const existing = localStorage.getItem(CART_KEY);
    const cart = existing ? JSON.parse(existing) : [];

    cart.push(item);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  };


  const buildCartItem = () => ({
  // ✅ MUST MATCH CHECKOUT STRUCTURE
  planId: product.id,
  bqPlanID: product.id, // fallback if not available
  planSlug: product.slug,

  // ✅ IMPORTANT (THIS FIXES "Unnamed Plan")
  planName: product.name,

  // ✅ pricing
  price: variant?.price || product.price_min,
  salePrice: null,
  price24: null,
  finalPrice: variant?.price || product.price_min,

  //durationDays: 30, // default if not available
  isPopular: false,

  // ✅ category (avoid N/A)
  category: {
    id: product.category?.id || 0,
    name: product.category?.name || "Phones",
    slug: product.category?.slug || "phones",
  },

  // ✅ VERY IMPORTANT → this replaces "features"
  features: [
    { id: 1, title: `Storage: ${selected.storage}` },
    { id: 2, title: `Color: ${selected.color}` },
    { id: 3, title: `Condition: ${selected.condition}` },
  ],

  // ✅ required by checkout UI
  simType: "NA",
  setupType: "NA",

  // optional
  quantity,
  image: mainImage,

  timestamp: Date.now(),
});



  const handleAddToCart = () => {
  if (!isValid) return;

  saveToCart(buildCartItem());
  alert("Added to cart ✅");
};

const handleCheckout = () => {
  if (!isValid) return;

  saveToCart(buildCartItem());
  window.location.href = "/checkout";
};

  const handleCheckout99 = () => {
    if (!isValid) return;

    saveToCart(buildCartItem());
    window.location.href = "/checkout";
  };

  // ================= UI =================
  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">

      {/* Breadcrumb */}
      <div className="px-10 pt-6 text-sm text-gray-500">
        <Link href="/">Home</Link> » <Link href="/shop">Shop</Link> » {product.name}
      </div>

      {/* Main */}
      <div className="px-10 py-8 grid grid-cols-2 gap-12">

        {/* Image */}
        <div className="flex items-center justify-center border rounded-lg h-[480px]">
          <Image src={mainImage} alt={product.name} width={380} height={380} />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="mb-6 text-purple-600 text-2xl font-semibold">
            ${variant?.price || `${product.price_min} – ${product.price_max}`}
          </div>

          {/* Storage */}
          <select
            value={selected.storage}
            onChange={(e) =>
              setSelected({
                storage: e.target.value,
                color: "",
                condition: "",
              })
            }
            className="w-full mb-3 border p-2"
          >
            <option value="">Storage</option>
            {storageOptions.map((s: string) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          {/* Color */}
          <select
            value={selected.color}
            onChange={(e) =>
              setSelected({
                ...selected,
                color: e.target.value,
                condition: "",
              })
            }
            className="w-full mb-3 border p-2"
          >
            <option value="">Color</option>
            {colorOptions.map((c: string) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* Condition */}
          <select
            value={selected.condition}
            onChange={(e) =>
              setSelected({ ...selected, condition: e.target.value })
            }
            className="w-full mb-3 border p-2"
          >
            <option value="">Condition</option>
            {conditionOptions.map((c: string) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* Quantity */}
          <div className="flex gap-3 mt-4">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              disabled={!isValid}
              onClick={handleAddToCart}
              className="px-5 py-2 bg-purple-600 text-white rounded disabled:bg-gray-300"
            >
              Add to Cart
            </button>

            <button
              disabled={!isValid}
              onClick={handleCheckout}
              className="px-5 py-2 bg-purple-800 text-white rounded disabled:bg-gray-300"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Related */}
      <div className="px-10 py-10">
        <h2 className="text-xl mb-4">Related Products</h2>

        <div className="grid grid-cols-4 gap-4">
          {relatedProducts.map((item: any) => (
            <Link key={item.id} href={`/product/${item.slug}`}>
              <div className="border p-3 rounded">
                <Image
                  src={item.primary_image || "/images/placeholder.png"}
                  alt={item.name}
                  width={200}
                  height={200}
                />
                <p>{item.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}