import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${window.location.protocol}//${window.location.hostname}:4000/api/v1`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Required for better-auth cookies/sessions
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for error handling (optional, but good practice)
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // You can handle global errors here like 401 Unauthorized
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
