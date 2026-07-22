import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  name: string;
  description: string;
  image: string;
}

export default function CategoryCard({ name, description, image }: CategoryCardProps) {
  const href = `/products?category=${encodeURIComponent(name)}`;

  return (
    <Link
      href={href}
      className="block overflow-hidden rounded-xl border border-[#D8C3A5] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <Image
        src={image}
        alt={name}
        width={300}
        height={220}
        className="h-56 w-full object-cover"
      />

      <div className="p-5">
        <h3 className="mb-2 text-xl font-semibold text-[#5A3A1B]">{name}</h3>
        <p className="text-gray-600">{description}</p>
        <p className="mt-3 text-sm font-medium text-[#8B5A2B]">Shop this collection →</p>
      </div>
    </Link>
  );
}
