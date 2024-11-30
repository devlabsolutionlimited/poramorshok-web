import axios from 'axios';
import type { Session, SessionFeedback } from '@/types/session';

export const createSession = async (data: Partial<Session>): Promise<Session> => {
  try {
    const response = await axios.post('/sessions', data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create session');
  }
};

export const getUserSessions = async (userId: string): Promise<Session[]> => {
  try {
    const response = await axios.get(`/sessions/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to get user sessions');
  }
};

export const addSessionFeedback = async (
  sessionId: string, 
  feedback: Partial<SessionFeedback>
): Promise<Session> => {
  try {
    const response = await axios.post(`/sessions/${sessionId}/feedback`, feedback);
    return response.data;
  } catch (error) {
    throw new Error('Failed to add session feedback');
  }
};

export const updateSessionStatus = async (
  sessionId: string, 
  status: Session['status']
): Promise<Session> => {
  try {
    const response = await axios.put(`/sessions/${sessionId}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update session status');
  }
};