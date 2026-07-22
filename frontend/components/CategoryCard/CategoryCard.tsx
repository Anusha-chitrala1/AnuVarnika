import Image from "next/image";

interface CategoryCardProps {
  name: string;
  description: string;
  image: string;
}

export default function CategoryCard({
  name,
  description,
  image,
}: CategoryCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#D8C3A5] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Image
        src={image}
        alt={name}
        width={300}
        height={220}
        className="h-56 w-full object-cover"
      />

      <div className="p-5">
        <h3 className="mb-2 text-xl font-semibold text-[#5A3A1B]">
          {name}
        </h3>

        <p className="text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
}