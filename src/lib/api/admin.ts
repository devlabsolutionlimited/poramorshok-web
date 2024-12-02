import api from '@/lib/http';

export interface AdminLoginCredentials {
  email: string;
  password: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator';
  permissions: string[];
}

export interface AdminAuthResponse {
  admin: AdminUser;
  token: string;
}

export const adminLogin = async (credentials: AdminLoginCredentials): Promise<AdminAuthResponse> => {
  const response = await api.post('/api/admin/auth/login', credentials);
  return response.data;
};

export const getAdminUser = async (): Promise<AdminUser> => {
  const response = await api.get('/api/admin/auth/me');
  return response.data;
};