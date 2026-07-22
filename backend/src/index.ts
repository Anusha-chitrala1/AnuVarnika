import {
  bearerToken,
  createSessionToken,
  hashPassword,
  verifyPassword,
  verifySessionToken,
} from "./auth";

export interface Env {
  DB: D1Database;
  ALLOWED_ORIGIN: string;
  AUTH_SECRET?: string;
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
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    },
  });

const id = () => crypto.randomUUID();

function corsOrigin(request: Request, env: Env): string {
  const configured = env.ALLOWED_ORIGIN?.trim();
  if (!configured || configured === "*") return "*";
  const origin = request.headers.get("Origin");
  if (!origin) return configured;
  if (origin === configured) return origin;
  if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return origin;
  if (/^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) return origin;
  return configured;
}

function authSecret(env: Env): string {
  return env.AUTH_SECRET?.trim() || "anuvarnika-dev-secret-change-in-production";
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = corsOrigin(request, env);
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return json(null, 204, origin);

    try {
      if (url.pathname === "/" && request.method === "GET") {
        return json(
          {
            name: "AnuVarnika API",
            status: "online",
            endpoints: [
              "/health",
              "/api/products",
              "/api/categories",
              "/api/contact",
              "/api/orders",
              "/api/auth/register",
              "/api/auth/login",
              "/api/auth/me",
            ],
          },
          200,
          origin,
        );
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

      if (url.pathname === "/api/auth/register" && request.method === "POST") {
        const body = await request.json<{ name?: string; email?: string; password?: string }>();
        const name = body.name?.trim();
        const email = body.email?.trim().toLowerCase();
        const password = body.password ?? "";
        if (!name || !email?.includes("@") || password.length < 6) {
          return json(
            { error: "Name, valid email, and a password of at least 6 characters are required." },
            400,
            origin,
          );
        }
        const existing = await env.DB.prepare("SELECT id FROM customers WHERE email = ?")
          .bind(email)
          .first<{ id: string }>();
        if (existing) {
          return json({ error: "An account with this email already exists." }, 409, origin);
        }
        const customerId = id();
        const passwordHash = await hashPassword(password);
        await env.DB.prepare(
          "INSERT INTO customers (id, name, email, password_hash) VALUES (?, ?, ?, ?)",
        )
          .bind(customerId, name, email, passwordHash)
          .run();
        const token = await createSessionToken(customerId, authSecret(env));
        return json(
          {
            token,
            customer: { id: customerId, name, email },
          },
          201,
          origin,
        );
      }

      if (url.pathname === "/api/auth/login" && request.method === "POST") {
        const body = await request.json<{ email?: string; password?: string }>();
        const email = body.email?.trim().toLowerCase();
        const password = body.password ?? "";
        if (!email?.includes("@") || !password) {
          return json({ error: "Email and password are required." }, 400, origin);
        }
        const customer = await env.DB.prepare(
          "SELECT id, name, email, password_hash FROM customers WHERE email = ?",
        )
          .bind(email)
          .first<{ id: string; name: string; email: string; password_hash: string }>();
        if (!customer || !(await verifyPassword(password, customer.password_hash))) {
          return json({ error: "Invalid email or password." }, 401, origin);
        }
        const token = await createSessionToken(customer.id, authSecret(env));
        return json(
          {
            token,
            customer: { id: customer.id, name: customer.name, email: customer.email },
          },
          200,
          origin,
        );
      }

      if (url.pathname === "/api/auth/me" && request.method === "GET") {
        const token = bearerToken(request);
        if (!token) return json({ error: "Unauthorized" }, 401, origin);
        const session = await verifySessionToken(token, authSecret(env));
        if (!session) return json({ error: "Invalid or expired session." }, 401, origin);
        const customer = await env.DB.prepare("SELECT id, name, email FROM customers WHERE id = ?")
          .bind(session.customerId)
          .first<{ id: string; name: string; email: string }>();
        if (!customer) return json({ error: "Account not found." }, 404, origin);
        return json({ customer }, 200, origin);
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
        )
          .bind(body.name.trim(), body.email.trim().toLowerCase(), body.message.trim())
          .run();
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
          return json(
            { error: "Email, shipping address, and at least one item are required." },
            400,
            origin,
          );
        }

        let customerId = body.customerId ?? null;
        const token = bearerToken(request);
        if (token) {
          const session = await verifySessionToken(token, authSecret(env));
          if (session) customerId = session.customerId;
        }

        const orderItems: Array<{ productId: string; quantity: number; unitPrice: number }> = [];
        for (const item of body.items) {
          if (!item.productId || !Number.isInteger(item.quantity) || item.quantity < 1) {
            return json({ error: "Each item needs a valid product and quantity." }, 400, origin);
          }
          const product = await env.DB.prepare("SELECT id, price, stock FROM products WHERE id = ?")
            .bind(item.productId)
            .first<{ id: string; price: number; stock: number }>();
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
          ).bind(
            orderId,
            customerId,
            body.email.trim().toLowerCase(),
            total,
            body.shippingAddress.trim(),
          ),
          ...orderItems.flatMap((item) => [
            env.DB.prepare(
              "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
            ).bind(orderId, item.productId, item.quantity, item.unitPrice),
            env.DB.prepare("UPDATE products SET stock = stock - ? WHERE id = ?").bind(
              item.quantity,
              item.productId,
            ),
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
