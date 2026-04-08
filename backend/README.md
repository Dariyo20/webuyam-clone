# WeBuyAm — Backend API

Express + TypeScript REST API for the WeBuyAm Clone assessment. Strict TypeScript, zero `any`, Zod validation on every endpoint, and a global error handler that returns a consistent response shape.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env — fill in MONGODB_URI and JWT_SECRET

# 3. Seed the database (~50 Nigerian products)
npm run seed

# 4. Start development server (hot-reload via ts-node-dev)
npm run dev
```

The server starts at `http://localhost:5000`.

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `MONGODB_URI` | **Yes** | — | MongoDB Atlas connection string |
| `JWT_SECRET` | **Yes** | — | JWT signing secret (32+ chars recommended) |
| `PORT` | No | `5000` | HTTP server port |
| `NODE_ENV` | No | `development` | `development` or `production` |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Allowed frontend origin |

The server **crashes on startup** if `MONGODB_URI` or `JWT_SECRET` are missing — no silent failures.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start with hot-reload (ts-node-dev) |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Run compiled output (`node dist/index.js`) |
| `npm run seed` | Clear products + insert 50 seed products |
| `npm run lint` | ESLint check |

## API Reference

All responses use this envelope:

```json
{ "success": true,  "data": { ... } }
{ "success": false, "error": { "message": "...", "code": "..." } }
```

Validation errors also include a `details` array with per-field messages.

---

### Auth — `/api/auth`

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| `POST` | `/register` | No | `{ name, email, password }` | `{ user, token }` |
| `POST` | `/login` | No | `{ email, password }` | `{ user, token }` |
| `GET` | `/me` | Bearer | — | `UserPublic` |

---

### Products — `/api/products`

| Method | Path | Auth | Query | Response |
|---|---|---|---|---|
| `GET` | `/` | No | `?page=1&limit=8` | `{ data: Product[], meta }` |
| `GET` | `/:slug` | No | — | `Product` |

Pagination meta: `{ page, limit, total, totalPages }`.

---

### Cart — `/api/cart` (all routes require `Authorization: Bearer <token>`)

| Method | Path | Body | Response |
|---|---|---|---|
| `GET` | `/` | — | `Cart` (auto-creates empty cart if none) |
| `POST` | `/items` | `{ productId, quantity }` | Updated `Cart` |
| `PATCH` | `/items/:productId` | `{ quantity }` | Updated `Cart` |
| `DELETE` | `/items/:productId` | — | Updated `Cart` |

---

## curl Test Cases

Replace `TOKEN` and `PRODUCT_ID` with values from your responses.

```bash
# ── Health ──────────────────────────────────────────────────────────────────
curl http://localhost:5000/health

# ── Auth ────────────────────────────────────────────────────────────────────
# Register
curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Adaeze Obi","email":"adaeze@example.com","password":"secret123"}' | jq

# Login
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"adaeze@example.com","password":"secret123"}' | jq

# Me (copy token from login response)
curl -s http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN" | jq

# ── Validation errors ────────────────────────────────────────────────────────
# Missing fields → 400 with details
curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"bad-email"}' | jq

# ── Products ─────────────────────────────────────────────────────────────────
# Page 1, 8 per page
curl -s "http://localhost:5000/api/products?page=1&limit=8" | jq

# Page 2
curl -s "http://localhost:5000/api/products?page=2&limit=8" | jq

# Single product by slug
curl -s http://localhost:5000/api/products/long-grain-parboiled-rice | jq

# 404 for unknown slug
curl -s http://localhost:5000/api/products/does-not-exist | jq

# ── Cart ──────────────────────────────────────────────────────────────────────
# Get cart (auto-creates if empty)
curl -s http://localhost:5000/api/cart \
  -H "Authorization: Bearer TOKEN" | jq

# Add item (replace PRODUCT_ID with a real _id from the products response)
curl -s -X POST http://localhost:5000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"productId":"PRODUCT_ID","quantity":2}' | jq

# Update quantity
curl -s -X PATCH http://localhost:5000/api/cart/items/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"quantity":5}' | jq

# Remove item
curl -s -X DELETE http://localhost:5000/api/cart/items/PRODUCT_ID \
  -H "Authorization: Bearer TOKEN" | jq

# ── Error cases ───────────────────────────────────────────────────────────────
# No auth header → 401
curl -s http://localhost:5000/api/cart | jq

# Bad token → 401
curl -s http://localhost:5000/api/cart \
  -H "Authorization: Bearer notavalidtoken" | jq

# Unknown route → 404
curl -s http://localhost:5000/api/nonexistent | jq
```

## Folder Structure

```
src/
├── config/         # env validation (crashes on missing vars), DB connection
├── controllers/    # auth, products, cart — pure business logic, no try/catch
├── middleware/     # requireAuth, validate (Zod), global error handler
├── models/         # User, Product, Cart Mongoose schemas
├── routes/         # auth, products, cart routers
├── schemas/        # Zod schemas for every endpoint that accepts input
├── types/          # Shared TS interfaces + Express Request augmentation
├── utils/          # AppError, asyncHandler, slugify
├── seed.ts         # Idempotent seed script (~50 Nigerian products)
└── index.ts        # App entry point
```

## Architecture Notes

- **asyncHandler** — wraps every async controller so errors propagate to the global error middleware without try/catch in each handler.
- **AppError** — operational errors carry `statusCode` and `code`; the error middleware treats these as safe to expose to clients.
- **Validation middleware** — Zod `parseAsync` validates `req.body`, `req.params`, and `req.query` together; returns 400 with per-field `details` on failure.
- **Cart subdocument** — cart items are embedded in the Cart document rather than a separate collection. Faster reads at this scale; avoids a join.
- **JWT in response body** — the frontend stores the token in Zustand + localStorage. For production, httpOnly cookies with CSRF protection would be preferred (documented in the top-level README).
