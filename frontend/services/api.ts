export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  compare_at_price: number | null;
  image_url: string;
  stock: number;
  featured: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export async function getProducts(params?: { category?: string; search?: string }) {
  const url = new URL("/api/products", API_URL);
  if (params?.category) url.searchParams.set("category", params.category);
  if (params?.search) url.searchParams.set("search", params.search);
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load products");
  return (await response.json()) as { products: Product[] };
}

export function formatPrice(priceInPaise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(priceInPaise);
}
