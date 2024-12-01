import api from '@/lib/http';
import type { Session, SessionType } from '@/types/session';

export const getSessionTypes = async () => {
  const response = await api.get('/mentor/session-types');
  return response.data;
};

export const createSessionType = async (data: Partial<SessionType>) => {
  // Transform the data to match server expectations
  const sessionTypeData = {
    title: data.title?.trim(),
    description: data.description?.trim(),
    type: data.type || 'one-on-one',
    topics: typeof data.topics === 'string' 
      ? data.topics.split(',').map(t => t.trim()).filter(Boolean)
      : Array.isArray(data.topics) 
        ? data.topics 
        : [],
    maxParticipants: data.type === 'group' ? parseInt(data.maxParticipants as string) || 5 : undefined,
    duration: parseInt(data.duration as string) || 60,
    price: parseInt(data.price as string) || 0
  };

  const response = await api.post('/mentor/session-types', sessionTypeData);
  return response.data;
};

export const updateSessionType = async (id: string, data: Partial<SessionType>) => {
  const response = await api.put(`/mentor/session-types/${id}`, data);
  return response.data;
};

export const deleteSessionType = async (id: string) => {
  const response = await api.delete(`/mentor/session-types/${id}`);
  return response.data;
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