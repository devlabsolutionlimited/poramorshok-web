import dotenv from 'dotenv';
import { z } from 'zod';
import { logger } from '../utils/logger.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
const envPath = join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  logger.warn('No .env file found in server directory');
  dotenv.config(); // Try loading from root directory
}

// Environment variable validation schema
const envSchema = z.object({
  PORT: z.coerce.number().default(5300),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  CLIENT_URL: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  STRIPE_SECRET_KEY: z.string().min(1),
  MONGODB_RETRY_INTERVAL: z.coerce.number().default(5000),
  MONGODB_MAX_RETRIES: z.coerce.number().default(5)
});

// Validate environment variables
const envValidation = envSchema.safeParse(process.env);

if (!envValidation.success) {
  logger.error('❌ Invalid environment variables:', envValidation.error.format());
  throw new Error('Invalid environment variables');
}

// Export validated environment variables
export const env = envValidation.data;

// Export environment checks
export const isDev = env.NODE_ENV === 'development';
export const isProd = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';