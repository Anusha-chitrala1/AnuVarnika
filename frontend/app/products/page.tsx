"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppProvider";
import { productImageUrl } from "@/lib/productImage";
import { formatPrice, getProducts, type Product } from "@/services/api";

export default function ProductsPage() {
  const { cart, wishlist } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("category");
    if (fromUrl) setCategory(fromUrl);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getProducts({
      category: category || undefined,
      search: query || undefined,
    })
      .then((result) => {
        if (active) setProducts(result.products);
      })
      .catch(() => {
        if (active) setError("We could not load the collection. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [category, query]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setQuery(search.trim());
  };

  return (
    <main className="min-h-screen bg-[#FFFDF8] px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-7xl">
        {toast && (
          <p className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#5A3A1B] px-6 py-3 text-sm text-white shadow-lg">
            {toast}
          </p>
        )}

        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[5px] text-[#8B5A2B]">
              The edit
            </p>
            <h1 className="text-5xl font-bold text-[#5A3A1B]">Our collection</h1>
            <p className="mt-4 max-w-xl text-gray-600">
              Timeless drapes, thoughtfully chosen for every celebration and everyday ritual.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search sarees…"
                className="rounded-full border border-[#D8C3A5] bg-white px-5 py-3 outline-none focus:ring-2 focus:ring-[#8B5A2B]"
              />
              <button
                type="submit"
                className="rounded-full bg-[#8B5A2B] px-5 py-3 text-sm font-medium text-white"
              >
                Search
              </button>
            </form>
            <label className="text-sm font-medium text-[#5A3A1B]">
              <span className="sr-only">Filter by category</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-full border border-[#D8C3A5] bg-white px-5 py-3 outline-none focus:ring-2 focus:ring-[#8B5A2B] sm:w-auto"
              >
                <option value="">All collections</option>
                <option>Silk Sarees</option>
                <option>Cotton Sarees</option>
                <option>Bridal Sarees</option>
                <option>Party Wear</option>
                <option>Festival Wear</option>
                <option>Designer Sarees</option>
              </select>
            </label>
          </div>
        </div>

        {loading && <p className="py-16 text-center text-gray-600">Loading the collection…</p>}
        {error && <p className="rounded-xl bg-red-50 p-5 text-center text-red-700">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="py-16 text-center text-gray-600">No sarees match your filters.</p>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-[#E7D8C3] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] bg-[#F8F3EA]">
                  <Image
                    src={productImageUrl(product.image_url)}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {product.featured === 1 && (
                    <span className="absolute left-4 top-4 rounded-full bg-[#FFFDF8] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#8B5A2B]">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8B5A2B]">
                    {product.category}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#5A3A1B]">{product.name}</h2>
                  <p className="mt-3 text-sm leading-6 text-gray-600">{product.description}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-lg font-semibold text-[#5A3A1B]">
                      {formatPrice(product.price)}
                    </span>
                    {product.compare_at_price && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.compare_at_price)}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={product.stock < 1}
                      onClick={() => {
                        cart.addItem(product);
                        showToast(`${product.name} added to bag`);
                      }}
                      className="rounded-full bg-[#8B5A2B] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#704214] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Add to bag
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const wasSaved = wishlist.has(product.id);
                        wishlist.toggle(product);
                        showToast(wasSaved ? "Removed from wishlist" : "Saved to wishlist");
                      }}
                      className="rounded-full border border-[#8B5A2B] px-4 py-2 text-sm font-medium text-[#8B5A2B]"
                    >
                      {wishlist.has(product.id) ? "♥ Saved" : "♡ Wishlist"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="mt-12 text-center text-sm text-gray-500">
          Need styling advice?{" "}
          <Link href="/contact" className="font-medium text-[#8B5A2B] underline">
            Contact our team
          </Link>
        </p>
      </div>
    </main>
  );
}
