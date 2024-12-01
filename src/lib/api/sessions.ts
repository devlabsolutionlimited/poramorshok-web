import api from '@/lib/api';
import type { Session, SessionType } from '@/types/session';

// Session Types
export const getSessionTypes = async () => {
  const response = await api.get('/mentors/session-types');
  return response.data;
};

export const createSessionType = async (data: Partial<SessionType>) => {
  const response = await api.post('/mentors/session-types', data);
  return response.data;
};

export const updateSessionType = async (id: string, data: Partial<SessionType>) => {
  const response = await api.put(`/mentors/session-types/${id}`, data);
  return response.data;
};

export const deleteSessionType = async (id: string) => {
  const response = await api.delete(`/mentors/session-types/${id}`);
  return response.data;
};

// Sessions
export const getMentorSessions = async () => {
  const response = await api.get('/mentors/sessions');
  return response.data;
};

export const getSessionStats = async () => {
  const response = await api.get('/mentors/sessions/stats');
  return response.data;
};

export const updateSessionStatus = async (id: string, status: Session['status']) => {
  const response = await api.put(`/sessions/${id}/status`, { status });
  return response.data;
};

export const addSessionFeedback = async (id: string, feedback: { rating: number; review: string }) => {
  const response = await api.post(`/sessions/${id}/feedback`, feedback);
  return response.data;
};