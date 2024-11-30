import api from '@/lib/http';
import type { SessionType } from '@/types/session';

export const getSessionTypes = async (mentorId: string) => {
  const response = await api.get(`/api/session-types/${mentorId}`);
  return response.data;
};

export const createSessionType = async (data: Partial<SessionType>) => {
  const response = await api.post('/api/session-types', data);
  return response.data;
};

export const updateSessionType = async (id: string, data: Partial<SessionType>) => {
  const response = await api.put(`/api/session-types/${id}`, data);
  return response.data;
};

export const deleteSessionType = async (id: string) => {
  await api.delete(`/api/session-types/${id}`);
};