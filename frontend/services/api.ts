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

export type Customer = {
  id: string;
  name: string;
  email: string;
};

export type CategorySummary = {
  name: string;
  product_count: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

const AUTH_KEY = "anuvarnika_auth";

export function getStoredAuth(): { token: string; customer: Customer } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { token: string; customer: Customer };
  } catch {
    return null;
  }
}

export function storeAuth(auth: { token: string; customer: Customer } | null) {
  if (typeof window === "undefined") return;
  if (!auth) {
    localStorage.removeItem(AUTH_KEY);
    return;
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...init } = options;
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(new URL(path, API_URL), { ...init, headers });
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) {
    throw new Error(
      typeof data === "object" && data && "error" in data && data.error
        ? String(data.error)
        : "Request failed",
    );
  }
  return data;
}

export async function getProducts(params?: { category?: string; search?: string }) {
  const url = new URL("/api/products", API_URL);
  if (params?.category) url.searchParams.set("category", params.category);
  if (params?.search) url.searchParams.set("search", params.search);
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load products");
  return (await response.json()) as { products: Product[] };
}

export async function getCategories() {
  return apiFetch<{ categories: CategorySummary[] }>("/api/categories");
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  return apiFetch<{ token: string; customer: Customer }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function loginUser(input: { email: string; password: string }) {
  return apiFetch<{ token: string; customer: Customer }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchCurrentUser(token: string) {
  return apiFetch<{ customer: Customer }>("/api/auth/me", { token });
}

export async function submitContact(input: { name: string; email: string; message: string }) {
  return apiFetch<{ message: string }>("/api/contact", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function placeOrder(
  input: {
    email: string;
    shippingAddress: string;
    items: Array<{ productId: string; quantity: number }>;
    customerId?: string;
  },
  token?: string,
) {
  return apiFetch<{ order: { id: string; total: number; status: string } }>("/api/orders", {
    method: "POST",
    body: JSON.stringify(input),
    token,
  });
}

export function formatPrice(amountInRupees: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountInRupees);
}
