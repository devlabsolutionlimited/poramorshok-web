import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_STRIPE_PUBLIC_KEY: z.string()
});

// Validate environment variables
const env = envSchema.safeParse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY
});

if (!env.success) {
  console.error('❌ Invalid environment variables:', env.error.format());
  throw new Error('Invalid environment variables');
}

export const config = {
  apiUrl: env.data.VITE_API_URL,
  stripePublicKey: env.data.VITE_STRIPE_PUBLIC_KEY
} as const;

export default config;