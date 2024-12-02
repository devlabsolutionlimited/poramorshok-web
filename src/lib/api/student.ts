import api from '@/lib/http';

export interface StudentDashboardData {
  totalSessions: number;
  hoursLearned: number;
  totalSpent: number;
  averageRating: number;
  upcomingSessions: Array<{
    id: string;
    mentorName: string;
    topic: string;
    date: string;
    time: string;
    duration: number;
    meetingLink?: string;
  }>;
  learningProgress: Array<{
    topic: string;
    progress: number;
    sessionsCompleted: number;
    totalSessions: number;
  }>;
  recentMentors: Array<{
    id: string;
    name: string;
    expertise: string[];
    avatar?: string;
    rating: number;
  }>;
}

export const getStudentDashboard = async (): Promise<StudentDashboardData> => {
  const response = await api.get('/api/student/dashboard');
  return response.data;
};