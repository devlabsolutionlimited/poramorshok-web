import { z } from 'zod';

export const categorySchema = z.enum([
  'Programming',
  'Design',
  'Business',
  'Marketing',
  'Data Science',
  'Language',
  'Academic',
  'Career'
]);

export type Category = z.infer<typeof categorySchema>;

export interface Service {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  type: 'one-on-one' | 'group';
  maxParticipants?: number;
}

export interface SocialLink {
  platform: 'twitter' | 'linkedin' | 'github' | 'website';
  url: string;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  expertise: string[];
  rating: number;
  totalReviews: number;
  hourlyRate: number;
  about: string;
  experience: number;
  languages: string[];
  category: Category;
  education: {
    degree: string;
    institution: string;
    year: number;
  }[];
  customUrl?: string;
  services: Service[];
  socialLinks?: SocialLink[];
  achievements?: string[];
  featured?: boolean;
}