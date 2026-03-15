import axios from 'axios';
import { DEMO_MODE, handleMockRequest } from './mockData';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ssipmt-full-stack.onrender.com',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// ── DEMO MODE INTERCEPTOR ─────────────────────────────────────────────────
if (DEMO_MODE) {
  // Intercept all requests and return mock data
  api.interceptors.request.use(async (config) => {
    const method = config.method?.toUpperCase() || 'GET';
    const url = config.url || '';
    const body = config.data;

    // Parse body if it's a string
    let parsedBody = body;
    if (typeof body === 'string') {
      try { parsedBody = JSON.parse(body); } catch { parsedBody = body; }
    }

    const mockResponse = await handleMockRequest(method, url, parsedBody, config);

    // Throw a "cancel" with mock data to skip the actual HTTP request
    const error = new axios.Cancel('DEMO_MODE');
    error.mockResponse = mockResponse;
    throw error;
  });

  // Intercept the "cancel" error and return mock as a successful response
  api.interceptors.response.use(
    (res) => res,
    (error) => {
      if (axios.isCancel(error) && error.mockResponse) {
        return Promise.resolve(error.mockResponse);
      }
      return Promise.reject(error);
    }
  );
} else {
  // ── REAL MODE: Original interceptors ───────────────────────────────────
  // Attach access token to every request
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('ssipmt_access');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // On 401: try refresh once, then redirect to login
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config;
      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;
        try {
          const refreshToken = localStorage.getItem('ssipmt_refresh');
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL || 'https://ssipmt-full-stack.onrender.com'}/api/auth/refresh`,
            { refreshToken },
            { withCredentials: true }
          );
          localStorage.setItem('ssipmt_access', data.accessToken);
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(original);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
}

export default api;
