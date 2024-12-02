import api from '@/lib/http';
import type { StudentProfile } from '@/types/student';

export const getStudentProfile = async (): Promise<StudentProfile> => {
  const response = await api.get('/api/student/profile');
  return response.data;
};

export const updateStudentProfile = async (data: Partial<StudentProfile>): Promise<StudentProfile> => {
  const response = await api.put('/api/student/profile', data);
  return response.data;
};

export const updateNotificationPreferences = async (preferences: {
  email: boolean;
  sessionReminders: boolean;
  marketingUpdates: boolean;
}): Promise<StudentProfile['notificationPreferences']> => {
  const response = await api.put('/api/student/profile/notifications', preferences);
  return response.data;
};