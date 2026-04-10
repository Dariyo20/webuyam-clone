# WeBuyAm — Frontend

React 18 + Vite + TypeScript client. See the [top-level README](../README.md) for architecture details, feature list, and trade-offs.

## Setup

```bash
cp .env.example .env
# Set VITE_API_URL to your backend URL (default: http://localhost:5000)
npm install
npm run dev    # http://localhost:5173
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check + compile to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint check |

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend API base URL |
