import api from '@/lib/api';
import type { Session, SessionFeedback } from '@/types/session';

export class SessionService {
  static async create(data: Partial<Session>): Promise<Session> {
    const response = await api.post('/sessions', data);
    return response.data;
  }

  static async getUserSessions(userId: string): Promise<Session[]> {
    const response = await api.get(`/sessions/user/${userId}`);
    return response.data;
  }

  static async addFeedback(sessionId: string, feedback: Partial<SessionFeedback>): Promise<Session> {
    const response = await api.post(`/sessions/${sessionId}/feedback`, feedback);
    return response.data;
  }

  static async updateStatus(sessionId: string, status: Session['status']): Promise<Session> {
    const response = await api.put(`/sessions/${sessionId}/status`, { status });
    return response.data;
  }

  static async getSessionById(id: string): Promise<Session> {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  }
}