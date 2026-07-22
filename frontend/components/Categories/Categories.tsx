import CategoryCard from "@/components/CategoryCard";
import { CATEGORIES } from "@/constants/categories";

export default function Categories() {
  return (
    <section className="bg-[#FFFDF8] py-20">
      <div className="mx-auto max-w-7xl px-8">

        <h2 className="mb-3 text-center text-4xl font-bold text-[#5A3A1B]">
          Shop By Category
        </h2>

        <p className="mb-12 text-center text-gray-600">
          Explore our premium saree collections.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              description={category.description}
              image={category.image}
            />
          ))}

        </div>
      </div>
    </section>
  );
}