# AnuVarnika

Handcrafted saree storefront: **Next.js** static frontend on Cloudflare Pages and **Cloudflare Workers + D1** API.

## Project structure

| Path | Purpose |
|------|---------|
| `frontend/` | Next.js 16 app (static export → `out/`) |
| `backend/` | Worker API + D1 database schema |

## Step 1 — Backend (API + database)

```bash
cd backend
npm install
npm run db:local    # creates local D1 tables + seed products
npm run dev         # http://localhost:8787
```

Verify:

```bash
curl http://localhost:8787/health
curl http://localhost:8787/api/products
```

### Deploy API (optional)

```bash
cd backend
npm run db:remote   # apply schema to remote D1 (once)
npm run deploy
```

Set a strong `AUTH_SECRET` in the Cloudflare dashboard (Worker → Settings → Variables) for production auth tokens.

## Step 2 — Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev         # http://localhost:3000
```

`.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8787
```

For production builds, point this at your deployed Worker URL before `npm run build`.

### Deploy frontend (optional)

```bash
cd frontend
npm run deploy
```

## Features wired end-to-end

- **Products** — list, category filter, search, add to bag, wishlist
- **Cart & checkout** — local cart + `POST /api/orders`
- **Auth** — register, login, profile (`/api/auth/*`)
- **Contact** — form → `POST /api/contact`
- **Wishlist** — browser localStorage (no server table)

## Local CORS

The API allows `localhost` origins when `ALLOWED_ORIGIN` is set to your Pages URL in `wrangler.jsonc`, so local frontend dev works against `wrangler dev`.

## Root scripts

From the repo root:

```bash
npm run dev          # frontend only
npm run deploy:api   # deploy Worker
npm run db:remote    # remote D1 schema
```
