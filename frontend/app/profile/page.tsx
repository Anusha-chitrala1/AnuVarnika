"use client";

import Link from "next/link";
import { useApp } from "@/context/AppProvider";

export default function ProfilePage() {
  const { auth } = useApp();

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
