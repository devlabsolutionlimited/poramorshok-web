import en from './en';
import bn from './bn';

export const translations = {
  en,
  bn
} as const;

export type Language = keyof typeof translations;