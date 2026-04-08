import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../utils/AppError';
import { config } from '../config/env';

// Minimal shape we use to detect Mongo duplicate-key errors (code 11000)
interface MongoErrorLike extends Error {
  code?: number | string;
  keyValue?: Record<string, unknown>;
}

/**
 * Global Express error handler.
 * Must have exactly 4 parameters so Express recognises it as an error handler.
 * Returns a consistent { success: false, error: { message, code } } shape.
 */
export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // 1. Operational errors we threw intentionally
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: { message: err.message, code: err.code },
    });
    return;
  }

  // 2. Mongoose cast error — e.g. invalid ObjectId in a route param
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      error: {
        message: `Invalid value for field '${err.path}': ${String(err.value)}`,
        code: 'INVALID_FIELD',
      },
    });
    return;
  }

  // 3. Mongoose schema validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    res.status(400).json({
      success: false,
      error: { message, code: 'VALIDATION_ERROR' },
    });
    return;
  }

  // 4. MongoDB duplicate key (unique index violated)
  const mongoErr = err as MongoErrorLike;
  if (mongoErr.code === 11000) {
    const field = mongoErr.keyValue ? Object.keys(mongoErr.keyValue)[0] : 'field';
    res.status(409).json({
      success: false,
      error: {
        message: `A record with that ${field ?? 'value'} already exists`,
        code: 'DUPLICATE_KEY',
      },
    });
    return;
  }

  // 5. Unknown / programming errors — log the full stack, hide details in prod
  console.error('[Unhandled error]', err);
  res.status(500).json({
    success: false,
    error: {
      message:
        config.NODE_ENV === 'production'
          ? 'Internal server error'
          : err.message,
      code: 'INTERNAL_ERROR',
    },
  });
};
