PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  compare_at_price INTEGER,
  image_url TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total INTEGER NOT NULL CHECK (total >= 0),
  shipping_address TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);

INSERT OR IGNORE INTO products (id, name, slug, description, category, price, compare_at_price, image_url, stock, featured) VALUES
  ('saree-kanjeevaram-001', 'Royal Kanjeevaram Silk Saree', 'royal-kanjeevaram-silk-saree', 'Pure silk saree with a traditional zari border, crafted for celebrations.', 'Silk Sarees', 18999, 22999, '/categories/silk.jpg', 12, 1),
  ('saree-cotton-001', 'Handloom Soft Cotton Saree', 'handloom-soft-cotton-saree', 'Breathable handloom cotton with a graceful everyday drape.', 'Cotton Sarees', 3499, 4499, '/categories/cotton.jpg', 24, 1),
  ('saree-bridal-001', 'Temple Bridal Silk Saree', 'temple-bridal-silk-saree', 'A rich bridal silk woven with temple-inspired motifs and heirloom zari.', 'Bridal Sarees', 24999, 29999, '/categories/bridal.jpg', 8, 1),
  ('saree-party-001', 'Midnight Party Organza Saree', 'midnight-party-organza-saree', 'Lightweight organza with a luminous finish for evening occasions.', 'Party Wear', 6999, 8499, '/categories/party.jpg', 15, 0),
  ('saree-festival-001', 'Festive Marigold Silk Saree', 'festive-marigold-silk-saree', 'A warm festive palette with a fine woven border and soft silk texture.', 'Festival Wear', 8999, 10999, '/categories/festival.jpg', 10, 1),
  ('saree-designer-001', 'Contemporary Designer Saree', 'contemporary-designer-saree', 'Modern pleats and a sculptural drape balanced with Indian craftsmanship.', 'Designer Sarees', 11999, 14999, '/categories/designer.jpg', 6, 0);
