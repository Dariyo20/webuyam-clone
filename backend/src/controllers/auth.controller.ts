import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUserDocument } from '../models/User';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { config } from '../config/env';
import type { RegisterInput, LoginInput } from '../schemas/auth.schemas';
import type { UserPublic, AuthPayload } from '../types';

const BCRYPT_ROUNDS = 10;
const JWT_EXPIRY = '7d';

function signToken(userId: string): string {
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

function toPublicUser(user: IUserDocument): UserPublic {
  return {
    _id: (user._id as { toString(): string }).toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

// POST /api/auth/register
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body as RegisterInput;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError('Email is already registered', 409, 'EMAIL_IN_USE');
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await User.create({ name, email, passwordHash });

  const token = signToken((user._id as { toString(): string }).toString());

  const payload: AuthPayload = { user: toPublicUser(user), token };

  res.status(201).json({ success: true, data: payload });
});

// POST /api/auth/login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginInput;

  const user = await User.findOne({ email });
  if (!user) {
    // Generic message — don't reveal whether email exists
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const token = signToken((user._id as { toString(): string }).toString());

  const payload: AuthPayload = { user: toPublicUser(user), token };

  res.json({ success: true, data: payload });
});

// GET /api/auth/me  (requires auth)
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, 'NOT_FOUND');
  }

  res.json({ success: true, data: toPublicUser(user) });
});
