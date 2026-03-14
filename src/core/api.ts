import axios from 'axios';
import { useAppStore } from '../store';

const RAW_API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
const API_URL = RAW_API_URL.replace(/\/+$/, '');
const API_V1_URL = API_URL.endsWith('/api/v1') ? API_URL : `${API_URL}/api/v1`;

export const api = axios.create({
  baseURL: API_V1_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = useAppStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    const { refreshToken, setTokens, logout } = useAppStore.getState();
    if (!refreshToken) {
      logout();
      return Promise.reject(error);
    }

    try {
      const refreshResponse = await axios.post(
        `${API_V1_URL}/auth/refresh`,
        { refresh_token: refreshToken },
        { timeout: 10000 }
      );
      const newAccessToken = refreshResponse.data?.access_token as string | undefined;
      if (!newAccessToken) {
        logout();
        return Promise.reject(error);
      }

      setTokens(newAccessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      originalRequest.headers = {
        ...(originalRequest.headers || {}),
        Authorization: `Bearer ${newAccessToken}`,
      };

      return api(originalRequest);
    } catch (err) {
      logout();
      return Promise.reject(err);
    }
  }
);
