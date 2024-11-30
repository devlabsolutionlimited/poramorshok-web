import axios from 'axios';
import type { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth';

const API_URL ='http://127.0.0.1:5173/api';

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post('/auth/login', credentials);
    const { token } = response.data;
    
    // Set token in axios defaults
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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
    const response = await axios.post('/auth/register', data);
    const { token } = response.data;
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    }
    throw new Error('Registration failed');
  }
};

export const getCurrentUser = async (): Promise<AuthResponse['user']> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axios.get('/auth/me');
    return response.data.user;
  } catch (error) {
    localStorage.removeItem('token');
    throw new Error('Failed to get current user');
  }
};