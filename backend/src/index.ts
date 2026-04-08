import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// config/env must be imported first — it validates env vars and crashes fast
import { config } from './config/env';
import { connectDB } from './config/db';

import authRoutes from './routes/auth.routes';
import productRoutes from './routes/products.routes';
import cartRoutes from './routes/cart.routes';

import { errorMiddleware } from './middleware/error.middleware';
import { AppError } from './utils/AppError';

const app = express();

// ─── Global middleware ────────────────────────────────────────────────────────
app.use(
  cors({
    // Accepts a single origin or a comma-separated list set via CLIENT_URL
    origin: config.CLIENT_URL.length === 1 ? config.CLIENT_URL[0] : config.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', env: config.NODE_ENV });
});

// ─── API routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// ─── 404 for unknown routes ───────────────────────────────────────────────────
app.use((req, _res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404, 'NOT_FOUND'));
});

// ─── Global error handler (must be last) ─────────────────────────────────────
app.use(errorMiddleware);

// ─── Boot ─────────────────────────────────────────────────────────────────────
async function start(): Promise<void> {
  await connectDB();
  app.listen(config.PORT, () => {
    console.log(
      `Server running on http://localhost:${config.PORT} [${config.NODE_ENV}]`
    );
  });
}

start().catch((err: unknown) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
