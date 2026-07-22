"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppProvider";
import { formatPrice, getOrders, type OrderSummary } from "@/services/api";

export default function ProfilePage() {
  const { auth } = useApp();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    if (!auth.token) return;
    getOrders(auth.token)
      .then((result) => setOrders(result.orders))
      .catch(() => setOrdersError("Order history is temporarily unavailable."));
  }, [auth.token]);

  if (auth.loading) {
    return (
      <main className="min-h-[60vh] px-6 py-16 text-center text-gray-600">
        Loading your profile…
      </main>
    );
  }

  if (!auth.customer) {
    return (
      <main className="min-h-[60vh] bg-[#FFFDF8] px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-[#5A3A1B]">Your profile</h1>
        <p className="mt-4 text-gray-600">Sign in to view account details.</p>
        <Link href="/login" className="mt-6 inline-block rounded-full bg-[#8B5A2B] px-6 py-3 text-white">
          Sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFDF8] px-6 py-16">
      <div className="mx-auto max-w-lg rounded-2xl border border-[#E7D8C3] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[4px] text-[#8B5A2B]">Account</p>
        <h1 className="mt-2 text-3xl font-bold text-[#5A3A1B]">Hello, {auth.customer.name}</h1>
        <dl className="mt-8 space-y-4 text-sm">
          <div>
            <dt className="text-gray-500">Email</dt>
            <dd className="text-lg text-[#5A3A1B]">{auth.customer.email}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Member ID</dt>
            <dd className="font-mono text-xs text-gray-700">{auth.customer.id}</dd>
          </div>
        </dl>
        <section className="mt-10 border-t border-[#E7D8C3] pt-8">
          <h2 className="text-xl font-semibold text-[#5A3A1B]">Order history</h2>
          {ordersError && <p className="mt-3 text-sm text-red-700">{ordersError}</p>}
          {!ordersError && orders.length === 0 && (
            <p className="mt-3 text-sm text-gray-600">Your completed orders will appear here.</p>
          )}
          <ul className="mt-4 space-y-3">
            {orders.map((order) => (
              <li key={order.id} className="flex items-center justify-between rounded-xl bg-[#F8F3EA] p-4 text-sm">
                <span className="font-mono text-xs text-gray-600">#{order.id.slice(0, 8)}</span>
                <span className="capitalize text-[#8B5A2B]">{order.status}</span>
                <span className="font-medium text-[#5A3A1B]">{formatPrice(order.total)}</span>
              </li>
            ))}
          </ul>
        </section>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/products" className="rounded-full bg-[#8B5A2B] px-5 py-2 text-white">
            Continue shopping
          </Link>
          <Link href="/cart" className="rounded-full border border-[#8B5A2B] px-5 py-2 text-[#8B5A2B]">
            View bag
          </Link>
          <button
            type="button"
            onClick={auth.logout}
            className="rounded-full px-5 py-2 text-red-700"
          >
            Log out
          </button>
        </div>
      </div>
    </main>
  );
}
