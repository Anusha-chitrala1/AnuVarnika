"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppProvider";
import { productImageUrl } from "@/lib/productImage";
import { formatPrice, placeOrder } from "@/services/api";

export default function CartPage() {
  const { auth, cart } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState(auth.customer?.email ?? "");
  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (auth.customer?.email && !email) {
      queueMicrotask(() => setEmail(auth.customer?.email ?? ""));
    }
  }, [auth.customer?.email, email]);

  const handleCheckout = async (event: FormEvent) => {
    event.preventDefault();
    if (cart.items.length === 0) return;
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const result = await placeOrder(
        {
          email,
          shippingAddress,
          items: cart.items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        },
        auth.token ?? undefined,
      );
      cart.clear();
      setSuccess(
        `Order ${result.order.id.slice(0, 8)} placed successfully. Total ${formatPrice(result.order.total)}.`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFDF8] px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-[#5A3A1B]">Your bag</h1>
        <p className="mt-2 text-gray-600">Review items and complete your order.</p>

        {cart.items.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-[#D8C3A5] p-12 text-center">
            <p className="text-gray-600">Your bag is empty.</p>
            <Link
              href="/products"
              className="mt-6 inline-block rounded-full bg-[#8B5A2B] px-6 py-3 text-white"
            >
              Browse collection
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
            <ul className="space-y-6">
              {cart.items.map((item) => (
                <li
                  key={item.product.id}
                  className="flex flex-col gap-4 rounded-2xl border border-[#E7D8C3] bg-white p-4 sm:flex-row sm:items-center"
                >
                  <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-[#F8F3EA] sm:w-36">
                    <Image
                      src={productImageUrl(item.product.image_url)}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-[#5A3A1B]">{item.product.name}</h2>
                    <p className="text-sm text-gray-500">{item.product.category}</p>
                    <p className="mt-1 font-medium">{formatPrice(item.product.price)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={item.product.stock}
                      value={item.quantity}
                      onChange={(event) => {
                        const quantity = Number.parseInt(event.target.value, 10);
                        if (Number.isInteger(quantity) && quantity > 0) {
                          cart.updateQuantity(item.product.id, quantity);
                        }
                      }}
                      className="w-16 rounded-lg border border-[#D8C3A5] px-2 py-1 text-center"
                    />
                    <button
                      type="button"
                      onClick={() => cart.removeItem(item.product.id)}
                      className="text-sm text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-2xl border border-[#E7D8C3] bg-white p-6">
              <h2 className="text-xl font-semibold text-[#5A3A1B]">Order summary</h2>
              <p className="mt-4 flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">Shipping calculated at confirmation.</p>

              <form onSubmit={handleCheckout} className="mt-6 space-y-4">
                <label className="block text-sm font-medium text-[#5A3A1B]">
                  Email
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#D8C3A5] px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-medium text-[#5A3A1B]">
                  Shipping address
                  <textarea
                    required
                    rows={3}
                    value={shippingAddress}
                    onChange={(event) => setShippingAddress(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#D8C3A5] px-3 py-2"
                  />
                </label>
                {!auth.customer && (
                  <p className="text-xs text-gray-500">
                    <button
                      type="button"
                      className="text-[#8B5A2B] underline"
                      onClick={() => router.push("/login")}
                    >
                      Sign in
                    </button>{" "}
                    to link this order to your account.
                  </p>
                )}
                {error && <p className="text-sm text-red-700">{error}</p>}
                {success && <p className="text-sm text-green-800">{success}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-[#8B5A2B] py-3 font-medium text-white disabled:opacity-60"
                >
                  {submitting ? "Placing order…" : "Place order"}
                </button>
              </form>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
