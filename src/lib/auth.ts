import axios from 'axios';
import api from './api';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/auth';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { token } = response.data;
    
    // Set token in axios defaults and localStorage
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Login failed');
  }
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/register', data);
    const { token } = response.data;
    
    // Set token in axios defaults and localStorage
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    }
    throw new Error('Registration failed');
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    // Set token in axios defaults
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    const response = await api.get('/auth/me');
    return response.data.user;
  } catch (error) {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    throw new Error('Failed to get current user');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  delete api.defaults.headers.common['Authorization'];
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};