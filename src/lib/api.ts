import axios from 'axios';
import { ApiError, NetworkError, AuthenticationError } from './errors';
import config from './config';

// Create axios instance with base URL from config
const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 30000 // 30 second timeout
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
      // Network error
      console.error('Network Error:', error);
      throw new NetworkError(
        'Unable to connect to the server. Please check your internet connection and try again.'
      );
    }

    const { status, data } = error.response;

    if (status === 401) {
      // Clear auth state on 401 responses
      localStorage.removeItem('token');
      api.defaults.headers['Authorization'] = '';
      window.location.href = '/login';
      throw new AuthenticationError('Your session has expired. Please log in again.');
    }

    if (status === 400) {
      // Validation error
      const message = data?.message || 'Invalid input data';
      const errors = data?.errors || {};
      throw new ApiError(status, message, errors);
    }

    if (status === 404) {
      throw new ApiError(status, 'The requested resource was not found');
    }

    if (status === 500) {
      throw new ApiError(
        status,
        'An unexpected error occurred on the server. Please try again later.'
      );
    }

    throw new ApiError(
      status,
      data?.message || 'An error occurred',
      data?.errors
    );
  }
);

export default api;