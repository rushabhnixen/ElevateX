import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('elevatex_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('elevatex_token');
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data).then((r) => r.data),
  login: (data) => api.post('/auth/login', data).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};

export const startupsAPI = {
  list: (params) => api.get('/startups', { params }).then((r) => r.data),
  get: (id) => api.get(`/startups/${id}`).then((r) => r.data),
  create: (formData) =>
    api.post('/startups', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  update: (id, data) => api.put(`/startups/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/startups/${id}`).then((r) => r.data),
  like: (id) => api.post(`/startups/${id}/like`).then((r) => r.data),
  bookmark: (id) => api.post(`/startups/${id}/bookmark`).then((r) => r.data),
  getComments: (id) => api.get(`/startups/${id}/comments`).then((r) => r.data),
  addComment: (id, text) => api.post(`/startups/${id}/comments`, { text }).then((r) => r.data),
};

export const usersAPI = {
  get: (id) => api.get(`/users/${id}`).then((r) => r.data),
  update: (id, data) => api.put(`/users/${id}`, data).then((r) => r.data),
  follow: (id) => api.post(`/users/${id}/follow`).then((r) => r.data),
  getBookmarks: (id) => api.get(`/users/${id}/bookmarks`).then((r) => r.data),
  bookmark: (userId, startupId) => api.post(`/users/${userId}/bookmark/${startupId}`).then((r) => r.data),
};

export const messagesAPI = {
  list: (roomId, params) => api.get(`/messages/${roomId}`, { params }).then((r) => r.data),
  send: (data) => api.post('/messages', data).then((r) => r.data),
};

export const matchesAPI = {
  list: (params) => api.get('/matches', { params }).then((r) => r.data),
  create: (data) => api.post('/matches', data).then((r) => r.data),
  update: (id, status) => api.put(`/matches/${id}`, { status }).then((r) => r.data),
};

export const notificationsAPI = {
  list: () => api.get('/notifications').then((r) => r.data),
  readAll: () => api.put('/notifications/read-all').then((r) => r.data),
  read: (id) => api.put(`/notifications/${id}/read`).then((r) => r.data),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats').then((r) => r.data),
  getStartups: (params) => api.get('/admin/startups', { params }).then((r) => r.data),
  reviewStartup: (id, data) => api.put(`/admin/startups/${id}/review`, data).then((r) => r.data),
  getUsers: (params) => api.get('/admin/users', { params }).then((r) => r.data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data).then((r) => r.data),
};

export default api;
