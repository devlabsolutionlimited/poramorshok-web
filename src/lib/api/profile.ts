import api from '@/lib/api';
import type { MentorProfile } from '@/types/mentor';

export const getMentorProfile = async () => {
  const response = await api.get('/mentor/profile');
  return response.data;
};

export const updateBasicInfo = async (data: Partial<MentorProfile>) => {
  const response = await api.put('/mentor/profile/basic', data);
  return response.data;
};

export const updateExpertise = async (data: { expertise: string[]; languages: string[] }) => {
  const response = await api.put('/mentor/profile/expertise', data);
  return response.data;
};

export const updateEducation = async (data: { education: MentorProfile['education'] }) => {
  const response = await api.put('/mentor/profile/education', data);
  return response.data;
};

export const updateSocialLinks = async (data: { socialLinks: MentorProfile['socialLinks'] }) => {
  const response = await api.put('/mentor/profile/social', data);
  return response.data;
};

export const updateCustomUrl = async (customUrl: string) => {
  const response = await api.put('/mentor/profile/custom-url', { customUrl });
  return response.data;
};

export const updateAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await api.put('/api/mentor/profile/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};