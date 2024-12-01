import axios from 'axios';
import { ApiError, NetworkError, AuthenticationError } from './errors';
import config from './config';

// Create axios instance with base URL from config
const api = axios.create({
  baseURL: `${config.apiUrl}/api`,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 10000 // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      throw new NetworkError('Network error occurred. Please check your connection.');
    }

    const { status, data } = error.response;

    if (status === 401) {
      // Clear auth state on 401 responses
      localStorage.removeItem('token');
      api.defaults.headers['Authorization'] = '';
      window.location.href = '/login';
      throw new AuthenticationError(data?.message || 'Authentication failed');
    }

    throw new ApiError(
      status,
      data?.message || 'An error occurred',
      data?.errors
    );
  }
);

export default api;