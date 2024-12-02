import api from '@/lib/http';

export interface AnalyticsData {
  totalEarnings: number;
  totalSessions: number;
  averageRating: number;
  completionRate: number;
  sessionsByDay: Array<{
    date: string;
    sessions: number;
  }>;
  topTopics: Array<{
    topic: string;
    sessions: number;
    rating: number;
  }>;
}

export const getMentorAnalytics = async (): Promise<AnalyticsData> => {
  const response = await api.get('/api/mentors/analytics'); // Updated endpoint
  return response.data;
};

export const getSessionStats = async () => {
  const response = await api.get('/api/mentors/sessions/stats'); // Updated endpoint
  return response.data;
};

export const getEarningsStats = async () => {
  const response = await api.get('/api/mentors/earnings/stats'); // Updated endpoint
  return response.data;
};