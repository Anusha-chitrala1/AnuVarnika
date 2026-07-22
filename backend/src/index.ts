export interface Env {
  DB: D1Database;
  ALLOWED_ORIGIN: string;
}

type Product = {
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

const json = (data: unknown, status = 200, origin = "*") =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    },
  });

const id = () => crypto.randomUUID();

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = env.ALLOWED_ORIGIN || "*";
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return json(null, 204, origin);

    try {
      if (url.pathname === "/" && request.method === "GET") {
        return json({
          name: "AnuVarnika API",
          status: "online",
          endpoints: ["/health", "/api/products", "/api/categories", "/api/contact", "/api/orders"],
        }, 200, origin);
      }

      if (url.pathname === "/health" && request.method === "GET") {
        return json({ ok: true, service: "anuvarnika-api" }, 200, origin);
      }

      if (url.pathname === "/api/products" && request.method === "GET") {
        const category = url.searchParams.get("category");
        const search = url.searchParams.get("search");
        const result = await env.DB.prepare(
          `SELECT id, name, slug, description, category, price, compare_at_price,
             image_url, stock, featured FROM products
           WHERE (? IS NULL OR category = ?)
             AND (? IS NULL OR name LIKE '%' || ? || '%' OR description LIKE '%' || ? || '%')
           ORDER BY featured DESC, created_at DESC`,
        )
          .bind(category, category, search, search, search)
          .all<Product>();
        return json({ products: result.results }, 200, origin);
      }

      if (url.pathname === "/api/categories" && request.method === "GET") {
        const result = await env.DB.prepare(
          "SELECT category AS name, COUNT(*) AS product_count FROM products GROUP BY category ORDER BY category",
        ).all();
        return json({ categories: result.results }, 200, origin);
      }

      if (url.pathname === "/api/contact" && request.method === "POST") {
        const body = await request.json<{
          name?: string;
          email?: string;
          message?: string;
        }>();
        if (!body.name?.trim() || !body.email?.includes("@") || !body.message?.trim()) {
          return json({ error: "Name, valid email, and message are required." }, 400, origin);
        }
        await env.DB.prepare(
          "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
        ).bind(body.name.trim(), body.email.trim().toLowerCase(), body.message.trim()).run();
        return json({ message: "Thank you. We will get back to you shortly." }, 201, origin);
      }

      if (url.pathname === "/api/orders" && request.method === "POST") {
        const body = await request.json<{
          email?: string;
          customerId?: string;
          shippingAddress?: string;
          items?: Array<{ productId?: string; quantity?: number }>;
        }>();
        if (!body.email?.includes("@") || !body.shippingAddress?.trim() || !body.items?.length) {
          return json({ error: "Email, shipping address, and at least one item are required." }, 400, origin);
        }

        const orderItems: Array<{ productId: string; quantity: number; unitPrice: number }> = [];
        for (const item of body.items) {
          if (!item.productId || !Number.isInteger(item.quantity) || item.quantity < 1) {
            return json({ error: "Each item needs a valid product and quantity." }, 400, origin);
          }
          const product = await env.DB.prepare("SELECT id, price, stock FROM products WHERE id = ?")
            .bind(item.productId).first<{ id: string; price: number; stock: number }>();
          if (!product || product.stock < item.quantity) {
            return json({ error: `Product ${item.productId} is unavailable.` }, 409, origin);
          }
          orderItems.push({ productId: product.id, quantity: item.quantity, unitPrice: product.price });
        }

        const total = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
        const orderId = id();
        const statements = [
          env.DB.prepare(
            "INSERT INTO orders (id, customer_id, email, total, shipping_address) VALUES (?, ?, ?, ?, ?)",
          ).bind(orderId, body.customerId || null, body.email.trim().toLowerCase(), total, body.shippingAddress.trim()),
          ...orderItems.flatMap((item) => [
            env.DB.prepare("INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)")
              .bind(orderId, item.productId, item.quantity, item.unitPrice),
            env.DB.prepare("UPDATE products SET stock = stock - ? WHERE id = ?")
              .bind(item.quantity, item.productId),
          ]),
        ];
        await env.DB.batch(statements);
        return json({ order: { id: orderId, total, status: "pending" } }, 201, origin);
      }

      return json({ error: "Not found" }, 404, origin);
    } catch (error) {
      console.error(error);
      return json({ error: "Internal server error" }, 500, origin);
    }
  },
} satisfies ExportedHandler<Env>;
