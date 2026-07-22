import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-[#FFFDF8]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 px-8 py-20 lg:flex-row">
        <div className="max-w-xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[6px] text-[#8B5A2B]">
            Twirl In Tradition
          </p>

          <h1 className="mb-6 text-5xl font-bold leading-tight text-[#5A3A1B] sm:text-6xl">
            Premium Sarees
            <br />
            Crafted For Every Occasion
          </h1>

          <p className="mb-8 text-lg leading-8 text-gray-600">
            Discover handpicked silk, cotton, bridal and designer sarees carefully selected to
            celebrate every beautiful moment.
          </p>

          <div className="flex flex-wrap gap-4">
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

        <div className="relative shrink-0">
          <Image
            src="https://placehold.co/520x620/E7D8C3/5A3A1B?text=AnuVarnika"
            alt="AnuVarnika Sarees"
            width={520}
            height={620}
            priority
            className="w-full max-w-[520px] rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
