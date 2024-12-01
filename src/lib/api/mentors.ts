import api from '@/lib/http';
import type { Mentor, MentorSearchFilters } from '@/types/mentor';

export const getMentorDashboard = async () => {
  const response = await api.get('/mentors/dashboard');
  return response.data;
};

export const getMentorAnalytics = async () => {
  const response = await api.get('/mentors/analytics');
  return response.data;
};

interface MentorSearchResponse {
  mentors: Mentor[];
  total: number;
}

export const searchMentors = async (filters?: MentorSearchFilters): Promise<MentorSearchResponse> => {
  const response = await api.get('/api/mentors', { params: filters });
  return response.data;
};

export const getMentorById = async (id: string): Promise<Mentor> => {
  const response = await api.get(`/api/mentors/${id}`);
  return response.data;
};

export const getMentorReviews = async (id: string) => {
  const response = await api.get(`/api/mentors/${id}/reviews`);
  return response.data;
};