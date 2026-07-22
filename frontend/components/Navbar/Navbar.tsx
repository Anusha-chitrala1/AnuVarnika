import Link from "next/link";
import { NAVIGATION_LINKS } from "@/constants/navigation";
import { COMPANY } from "@/constants/theme";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#D8C3A5] bg-[#FFFDF8]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        {/* Logo */}
        <Link href="/">
          <div>
            <h1 className="text-3xl font-bold text-[#8B5A2B]">
              {COMPANY.name}
            </h1>

            <p className="text-xs tracking-[4px] text-gray-500">
              {COMPANY.slogan}
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8">
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

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button className="text-[#5A3A1B]">♡ Wishlist</button>

          <button className="text-[#5A3A1B]">🛒 Cart</button>

          <button className="rounded-lg bg-[#8B5A2B] px-5 py-2 text-white transition hover:bg-[#704214]">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}