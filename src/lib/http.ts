import axios, { AxiosError } from 'axios';
import { ApiError, NetworkError, AuthenticationError } from './errors';
import config from './config';

const http = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true,
  timeout: 60000 // 60 seconds timeout
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
      throw new NetworkError('Network error occurred. Please check your connection.');
    }

    const { status, data } = error.response;

    if (status === 401) {
      localStorage.removeItem('token');
      http.defaults.headers.common['Authorization'] = '';
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

export default http;