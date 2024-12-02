import api from '@/lib/http';
import type { Session, SessionType } from '@/types/session';

export const getMentorDashboard = async () => {
  const response = await api.get('/api/mentor/dashboard');
  return response.data;
};

export const getMentorSessions = async (filters?: {
  status?: string;
  date?: string;
}) => {
  const response = await api.get('/api/mentor/sessions', { params: filters });
  return response.data;
};

export const getSessionStats = async () => {
  const response = await api.get('/api/mentor/sessions/stats');
  return response.data;
};

export const updateSessionStatus = async (id: string, status: Session['status']) => {
  const response = await api.put(`/api/sessions/${id}/status`, { status });
  return response.data;
};

export const addSessionFeedback = async (id: string, feedback: { rating: number; review: string }) => {
  const response = await api.post(`/api/sessions/${id}/feedback`, feedback);
  return response.data;
};