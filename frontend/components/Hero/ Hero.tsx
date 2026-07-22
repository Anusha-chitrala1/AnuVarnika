import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-[#FFFDF8]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-20">

        {/* Left Content */}
        <div className="max-w-xl">

          <p className="mb-4 text-sm font-semibold uppercase tracking-[6px] text-[#8B5A2B]">
            Twirl In Tradition
          </p>

          <h1 className="mb-6 text-6xl font-bold leading-tight text-[#5A3A1B]">
            Premium Sarees
            <br />
            Crafted For Every Occasion
          </h1>

          <p className="mb-8 text-lg leading-8 text-gray-600">
            Discover handpicked silk, cotton, bridal and designer sarees
            carefully selected to celebrate every beautiful moment.
          </p>

          <div className="flex gap-4">

            <Link
              href="/products"
              className="rounded-lg bg-[#8B5A2B] px-8 py-4 text-white transition hover:bg-[#704214]"
            >
              Shop Collection
            </Link>

            <Link
              href="/about"
              className="rounded-lg border border-[#8B5A2B] px-8 py-4 text-[#8B5A2B] transition hover:bg-[#8B5A2B] hover:text-white"
            >
              Explore Brand
            </Link>

          </div>

        </div>

        {/* Right Image */}

        <div>

          <Image
            src="/hero-saree.png"
            alt="AnuVarnika Sarees"
            width={520}
            height={620}
            priority
            className="w-[520px]"
          />

        </div>

      </div>
    </section>
  );
}