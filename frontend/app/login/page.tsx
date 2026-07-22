"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppProvider";

export default function LoginPage() {
  const { auth } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await auth.login(email, password);
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-[70vh] bg-[#FFFDF8] px-6 py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-[#E7D8C3] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[4px] text-[#8B5A2B]">Welcome back</p>
        <h1 className="mt-2 text-3xl font-bold text-[#5A3A1B]">Sign in</h1>
        <p className="mt-2 text-gray-600">Access your profile and faster checkout.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-medium text-[#5A3A1B]">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#D8C3A5] px-4 py-3 outline-none focus:ring-2 focus:ring-[#8B5A2B]"
            />
          </label>
          <label className="block text-sm font-medium text-[#5A3A1B]">
            Password
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#D8C3A5] px-4 py-3 outline-none focus:ring-2 focus:ring-[#8B5A2B]"
            />
          </label>
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#8B5A2B] py-3 font-medium text-white hover:bg-[#704214] disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          New here?{" "}
          <Link href="/register" className="font-medium text-[#8B5A2B] underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
