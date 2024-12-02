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
    // Check for admin token first
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
      return config;
    }

    // Fall back to regular user token
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
      // Check if this is an admin route
      if (error.config?.url?.includes('/admin')) {
        localStorage.removeItem('adminToken');
        delete http.defaults.headers.common['Authorization'];
        window.location.href = '/admin/login';
      } else {
        localStorage.removeItem('token');
        delete http.defaults.headers.common['Authorization'];
        window.location.href = '/login';
      }
      throw new AuthenticationError(
        (data && (data as any).message) || 'Authentication failed. Please log in again.'
      );
    }

    throw new ApiError(
      status,
      (data && (data as any).message) || 'An unexpected error occurred',
      (data && (data as any).errors) || []
    );
  }
);

export default http;