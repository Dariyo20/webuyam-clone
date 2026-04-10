# WeBuyAm — Backend API

Express + TypeScript REST API. See the [top-level README](../README.md) for architecture details, API docs, ERD, and trade-offs.

## Setup

```bash
cp .env.example .env
# Fill in MONGODB_URI and JWT_SECRET
npm install
npm run seed   # seeds ~100 products
npm run dev    # http://localhost:5000
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start with hot-reload (ts-node-dev) |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Run compiled output (`node dist/index.js`) |
| `npm run seed` | Clear products + insert seed products |
| `npm run lint` | ESLint check |

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | JWT signing secret (32+ chars) |
| `PORT` | No | HTTP port (defaults to 5000) |
| `NODE_ENV` | No | `development` or `production` |
| `CLIENT_URL` | No | Allowed frontend origin(s), comma-separated |

The server **crashes on startup** if `MONGODB_URI` or `JWT_SECRET` are missing.
