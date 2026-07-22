"use client";

import Link from "next/link";
import { NAVIGATION_LINKS } from "@/constants/navigation";
import { COMPANY } from "@/constants/theme";
import { useApp } from "@/context/AppProvider";

export default function Navbar() {
  const { auth, cart, wishlist } = useApp();

  return (
    <nav className="sticky top-0 z-50 border-b border-[#D8C3A5] bg-[#FFFDF8]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-8 sm:py-5">
        <Link href="/">
          <div>
            <h1 className="text-2xl font-bold text-[#8B5A2B] sm:text-3xl">{COMPANY.name}</h1>
            <p className="text-xs tracking-[4px] text-gray-500">{COMPANY.slogan}</p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {NAVIGATION_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-medium text-[#5A3A1B] transition hover:text-[#8B5A2B]"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/wishlist" className="text-sm text-[#5A3A1B] sm:text-base">
            ♡ Wishlist{wishlist.count > 0 ? ` (${wishlist.count})` : ""}
          </Link>

          <Link href="/cart" className="text-sm text-[#5A3A1B] sm:text-base">
            🛒 Cart{cart.count > 0 ? ` (${cart.count})` : ""}
          </Link>

          {auth.customer ? (
            <>
              <Link
                href="/profile"
                className="hidden text-sm text-[#5A3A1B] sm:inline sm:text-base"
              >
                {auth.customer.name.split(" ")[0]}
              </Link>
              <button
                type="button"
                onClick={auth.logout}
                className="rounded-lg border border-[#8B5A2B] px-4 py-2 text-sm text-[#8B5A2B] transition hover:bg-[#8B5A2B] hover:text-white"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-[#8B5A2B] px-4 py-2 text-sm text-white transition hover:bg-[#704214] sm:px-5"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
