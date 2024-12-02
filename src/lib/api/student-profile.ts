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

export const updateAvatar = async (file: File): Promise<{ avatar: string }> => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await api.put('/api/student/profile/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
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