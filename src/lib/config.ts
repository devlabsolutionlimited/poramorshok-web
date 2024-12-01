import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url().default('http://localhost:3000/api'),
  VITE_STRIPE_PUBLIC_KEY: z.string().default('pk_test_TYooMQauvdEDq54NiTphI7jx')
});

// Validate environment variables
const env = envSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  VITE_STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY
});

export const config = {
  apiUrl: env.VITE_API_URL,
  stripePublicKey: env.VITE_STRIPE_PUBLIC_KEY
} as const;

export default config;