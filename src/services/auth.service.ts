import api from '@/lib/api';
import type { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    const { token } = response.data;
    localStorage.setItem('token', token);
    return response.data;
  }

  static async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    const { token } = response.data;
    localStorage.setItem('token', token);
    return response.data;
  }

  static async getCurrentUser(): Promise<AuthResponse['user']> {
    const response = await api.get('/auth/me');
    return response.data.user;
  }

  static logout(): void {
    localStorage.removeItem('token');
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}