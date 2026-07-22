"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { formatPrice, getProducts, type Product } from "@/services/api";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        getProducts(category ? { category } : undefined)
            .then((result) => {
                if (active) setProducts(result.products);
            })
            .catch(() => {
                if (active) setError("We could not load the collection. Please try again.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [category]);

    const handleCategoryChange = (value: string) => {
        setLoading(true);
        setError("");
        setCategory(value);
    };

    return (
        <main className="min-h-screen bg-[#FFFDF8] px-6 py-16 sm:px-10">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[5px] text-[#8B5A2B]">The edit</p>
                        <h1 className="text-5xl font-bold text-[#5A3A1B]">Our collection</h1>
                        <p className="mt-4 max-w-xl text-gray-600">Timeless drapes, thoughtfully chosen for every celebration and everyday ritual.</p>
                    </div>
                    <label className="text-sm font-medium text-[#5A3A1B]">
                        <span className="sr-only">Filter by category</span>
                        <select value={category} onChange={(event) => handleCategoryChange(event.target.value)} className="rounded-full border border-[#D8C3A5] bg-white px-5 py-3 outline-none focus:ring-2 focus:ring-[#8B5A2B]">
                            <option value="">All collections</option>
                            <option>Silk Sarees</option>
                            <option>Cotton Sarees</option>
                            <option>Bridal Sarees</option>
                            <option>Party Wear</option>
                            <option>Festival Wear</option>
                            <option>Designer Sarees</option>
                        </select>
                    </label>
                </div>

                {loading && <p className="py-16 text-center text-gray-600">Loading the collection…</p>}
                {error && <p className="rounded-xl bg-red-50 p-5 text-center text-red-700">{error}</p>}
                {!loading && !error && (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <article key={product.id} className="overflow-hidden rounded-2xl border border-[#E7D8C3] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                                <div className="relative aspect-[4/3] bg-[#F8F3EA]">
                                    <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                                    {product.featured === 1 && <span className="absolute left-4 top-4 rounded-full bg-[#FFFDF8] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#8B5A2B]">Featured</span>}
                                </div>
                                <div className="p-6">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[#8B5A2B]">{product.category}</p>
                                    <h2 className="mt-2 text-2xl font-semibold text-[#5A3A1B]">{product.name}</h2>
                                    <p className="mt-3 text-sm leading-6 text-gray-600">{product.description}</p>
                                    <div className="mt-6 flex items-center justify-between">
                                        <span className="text-lg font-semibold text-[#5A3A1B]">{formatPrice(product.price)}</span>
                                        <button className="rounded-full bg-[#8B5A2B] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#704214]">Add to bag</button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}