import dotenv from 'dotenv';

dotenv.config();

/**
 * Reads a required environment variable.
 * Crashes the process with a clear message if it is missing.
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    console.error(
      `\n[FATAL] Missing required environment variable: ${key}\n` +
        `Copy .env.example to .env and fill in the value, then restart.\n`
    );
    process.exit(1);
  }
  return value;
}

export const config = {
  MONGODB_URI: requireEnv('MONGODB_URI'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  PORT: parseInt(process.env['PORT'] ?? '5000', 10),
  NODE_ENV: process.env['NODE_ENV'] ?? 'development',
  CORS_ORIGIN: process.env['CORS_ORIGIN'] ?? 'http://localhost:5173',
} as const;
