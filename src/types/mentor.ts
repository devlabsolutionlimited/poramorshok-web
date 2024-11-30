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

export interface SocialLinks {
  platform: 'twitter' | 'linkedin' | 'github' | 'website';
  url: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
  description?: string;
}

export interface MentorProfile {
  name: string;
  title: string;
  company: string;
  avatar?: string;
  about: string;
  hourlyRate: number;
  expertise: string[];
  languages: string[];
  education: Education[];
  socialLinks: SocialLinks[];
  customUrl?: string;
}

export interface Mentor extends MentorProfile {
  id: string;
  rating: number;
  totalReviews: number;
  experience: number;
  category: Category;
  services: Service[];
  achievements?: string[];
  featured?: boolean;
}

export interface MentorSearchFilters {
  category?: Category;
  expertise?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  language?: string[];
  search?: string;
}