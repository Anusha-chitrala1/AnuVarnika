"use client";

import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppProvider";
import { productImageUrl } from "@/lib/productImage";
import { formatPrice } from "@/services/api";

export default function WishlistPage() {
  const { cart, wishlist } = useApp();

  return (
    <main className="min-h-screen bg-[#FFFDF8] px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-[#5A3A1B]">Wishlist</h1>
        <p className="mt-2 text-gray-600">Sarees you have saved for later.</p>

        {wishlist.items.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-[#D8C3A5] p-12 text-center">
            <p className="text-gray-600">No saved sarees yet.</p>
            <Link href="/products" className="mt-6 inline-block text-[#8B5A2B] underline">
              Explore the collection
            </Link>
          </div>
        ) : (
          <ul className="mt-10 space-y-6">
            {wishlist.items.map((product) => (
              <li
                key={product.id}
                className="flex flex-col gap-4 rounded-2xl border border-[#E7D8C3] bg-white p-4 sm:flex-row sm:items-center"
              >
                <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl sm:w-40">
                  <Image
                    src={productImageUrl(product.image_url)}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-[#5A3A1B]">{product.name}</h2>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <p className="mt-2 font-medium">{formatPrice(product.price)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={product.stock < 1}
                    onClick={() => cart.addItem(product)}
                    className="rounded-full bg-[#8B5A2B] px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {product.stock > 0 ? "Add to bag" : "Out of stock"}
                  </button>
                  <button
                    type="button"
                    onClick={() => wishlist.remove(product.id)}
                    className="rounded-full border border-[#8B5A2B] px-4 py-2 text-sm text-[#8B5A2B]"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
