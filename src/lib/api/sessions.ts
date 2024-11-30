import api from '@/lib/http';
import type { Session, SessionType } from '@/types/session';

export const getMentorSessions = async () => {
  const response = await api.get('/api/mentors/sessions');
  return response.data;
};

export const getSessionStats = async () => {
  const response = await api.get('/api/mentors/sessions/stats');
  return response.data;
};

export const createSessionType = async (data: Partial<SessionType>) => {
  const response = await api.post('/api/mentors/session-types', data);
  return response.data;
};

export const updateSessionType = async (id: string, data: Partial<SessionType>) => {
  const response = await api.put(`/api/mentors/session-types/${id}`, data);
  return response.data;
};

export const deleteSessionType = async (id: string) => {
  await api.delete(`/api/mentors/session-types/${id}`);
};

export const getSessionTypes = async () => {
  const response = await api.get('/api/mentors/session-types');
  return response.data;
};