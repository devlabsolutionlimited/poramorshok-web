import axios, { AxiosError } from 'axios';
import { ApiError, NetworkError, AuthenticationError } from './errors';
import config from './config';

const http = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 30000 // 30 second timeout
});

// Request interceptor
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      console.error('Network error:', error.message);
      throw new NetworkError('Network error occurred. Please check your connection.');
    }

    const { status, data } = error.response;

    // Log detailed error information
    console.error('API error:', {
      status,
      data,
      url: error.config?.url,
      method: error.config?.method
    });

    if (status === 401) {
      localStorage.removeItem('token');
      throw new AuthenticationError(
        data?.message || 'Authentication failed. Please log in again.'
      );
    }

    throw new ApiError(
      status,
      data?.message || 'An unexpected error occurred',
      data?.errors || []
    );
  }
);

export default http;