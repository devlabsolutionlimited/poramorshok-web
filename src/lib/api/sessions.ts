import api from '@/lib/http';
import type { Session, SessionType } from '@/types/session';

// Session Types
export const getSessionTypes = async () => {
  const response = await api.get('/mentor/session-types');
  return response.data;
};

export const createSessionType = async (data: Partial<SessionType>) => {
  const sessionTypeData = {
    ...data,
    topics: data.topics ? (data.topics as string).split(',').map(t => t.trim()) : []
  };

  const response = await api.post('/mentor/session-types', sessionTypeData);
  return response.data;
};

export const updateSessionType = async (id: string, data: Partial<SessionType>) => {
  const response = await api.put(`/mentor/session-types/${id}`, data);
  return response.data;
};

export const deleteSessionType = async (id: string) => {
  await api.delete(`/mentor/session-types/${id}`);
};

// Sessions
export const getMentorSessions = async () => {
  const response = await api.get('/mentor/sessions');
  return response.data;
};

export const getSessionStats = async () => {
  const response = await api.get('/mentor/sessions/stats');
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