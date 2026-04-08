import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config/env';
import { AppError } from '../utils/AppError';

interface TokenPayload extends JwtPayload {
  userId: string;
}

function isTokenPayload(value: unknown): value is TokenPayload {
  return (
    typeof value === 'object' &&
    value !== null &&
    'userId' in value &&
    typeof (value as TokenPayload).userId === 'string'
  );
}

/**
 * Reads the Authorization: Bearer <token> header, verifies the JWT,
 * and attaches { userId } to req.user for downstream controllers.
 * Calls next(AppError) on any failure so the global handler responds cleanly.
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];

  if (!authHeader?.startsWith('Bearer ')) {
    next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    return;
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);

    if (!isTokenPayload(decoded)) {
      next(new AppError('Invalid token payload', 401, 'UNAUTHORIZED'));
      return;
    }

    req.user = { userId: decoded.userId };
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401, 'UNAUTHORIZED'));
  }
};
