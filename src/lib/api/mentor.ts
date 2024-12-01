import api from '@/lib/http';
import type { Mentor } from '@/types/mentor';

export const getMentorProfile = async () => {
  const response = await api.get('/api/mentor/profile');
  return response.data;
};

export const updateBasicInfo = async (data: Partial<Mentor>) => {
  const response = await api.put('/api/mentor/profile/basic', data);
  return response.data;
};

export const updateExpertise = async (data: { expertise: string[]; languages: string[] }) => {
  const response = await api.put('/api/mentor/profile/expertise', data);
  return response.data;
};

export const updateEducation = async (data: { education: Mentor['education'] }) => {
  const response = await api.put('/api/mentor/profile/education', data);
  return response.data;
};

export const updateSocialLinks = async (data: { socialLinks: Mentor['socialLinks'] }) => {
  const response = await api.put('/api/mentor/profile/social', data);
  return response.data;
};

export const updateCustomUrl = async (customUrl: string) => {
  const response = await api.put('/api/mentor/profile/custom-url', { customUrl });
  return response.data;
};