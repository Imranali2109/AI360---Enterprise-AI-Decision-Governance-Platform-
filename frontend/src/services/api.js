import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Return response.data directly so callers get the backend's JSON object
// e.g. api.get('/dashboard') resolves to { totalUseCases, highPriorityCount, ... }
//      api.post('/auth/login') resolves to { success, token, user }
api.interceptors.response.use(
  (response) => {
    const body = response.data;
    // If the body has { success, data } shape, unwrap the data key
    if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
      return body.data;
    }
    // Otherwise return the body as-is (covers auth: { success, token, user })
    return body;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
