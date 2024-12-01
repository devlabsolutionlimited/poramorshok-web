import axios, { AxiosError } from 'axios';
import { ApiError, NetworkError, AuthenticationError } from './errors';
import config from './config';

const http = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 30000 // Increase timeout to 30 seconds
});

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

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      throw new NetworkError();
    }

    const { status, data } = error.response;

    if (status === 401) {
      localStorage.removeItem('token');
      throw new AuthenticationError(data?.message);
    }

    throw new ApiError(
      status,
      data?.message || 'An error occurred',
      data?.errors
    );
  }
);

export default http;