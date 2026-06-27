import { api } from './api';

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  refresh: () => api.post('/auth/refresh'),
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
};

export const submissionsApi = {
  getAll: (params) =>
    api.get('/submissions', { params }),
  getById: (id) => api.get(`/submissions/${id}`),
  approve: (id, note) =>
    api.post(`/submissions/${id}/approve`, { note }),
  reject: (id, reason) =>
    api.post(`/submissions/${id}/reject`, { reason }),
  requestChanges: (id, reason) =>
    api.post(`/submissions/${id}/request-changes`, { reason }),
  assign: (id, reviewerId) =>
    api.post(`/submissions/${id}/assign`, { reviewerId }),
  bulkAction: (data) => api.post('/submissions/bulk', data),
};

export const reviewsApi = {
  getBySubmission: (submissionId) =>
    api.get(`/reviews`, { params: { submission: submissionId } }),
};

export const commentsApi = {
  getBySubmission: (submissionId) =>
    api.get(`/comments`, { params: { submission: submissionId } }),
  create: (data) =>
    api.post('/comments', data),
};

export const activityLogsApi = {
  getAll: (params) =>
    api.get('/activity-logs', { params }),
};

export const notificationsApi = {
  getAll: (params) =>
    api.get('/notifications', { params }),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};

export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
};
