import { api } from './api';
import type {
  Submission,
  Review,
  Comment,
  ActivityLog,
  DashboardStats,
  PaginatedResponse,
  ApiResponse,
  LoginRequest,
  LoginResponse,
  User,
} from '@/types';

export const authApi = {
  login: (data: LoginRequest) => api.post<ApiResponse<LoginResponse>>('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get<ApiResponse<User>>('/auth/me'),
  refresh: () => api.post('/auth/refresh'),
};

export const dashboardApi = {
  getStats: () => api.get<ApiResponse<DashboardStats>>('/dashboard/stats'),
};

export const submissionsApi = {
  getAll: (params: Record<string, unknown>) =>
    api.get<PaginatedResponse<Submission>>('/submissions', { params }),
  getById: (id: string) => api.get<ApiResponse<Submission>>(`/submissions/${id}`),
  approve: (id: string, note?: string) =>
    api.post<ApiResponse<Submission>>(`/submissions/${id}/approve`, { note }),
  reject: (id: string, reason: string) =>
    api.post<ApiResponse<Submission>>(`/submissions/${id}/reject`, { reason }),
  requestChanges: (id: string, reason: string) =>
    api.post<ApiResponse<Submission>>(`/submissions/${id}/request-changes`, { reason }),
  assign: (id: string, reviewerId: string) =>
    api.post<ApiResponse<Submission>>(`/submissions/${id}/assign`, { reviewerId }),
  bulkAction: (data: {
    ids: string[];
    action: string;
    reason?: string;
    reviewerId?: string;
  }) => api.post<ApiResponse<{ processed: number }>>('/submissions/bulk', data),
};

export const reviewsApi = {
  getBySubmission: (submissionId: string) =>
    api.get<PaginatedResponse<Review>>(`/reviews`, { params: { submission: submissionId } }),
};

export const commentsApi = {
  getBySubmission: (submissionId: string) =>
    api.get<PaginatedResponse<Comment>>(`/comments`, { params: { submission: submissionId } }),
  create: (data: { submission: string; content: string; isInternal: boolean }) =>
    api.post<ApiResponse<Comment>>('/comments', data),
};

export const activityLogsApi = {
  getAll: (params: Record<string, unknown>) =>
    api.get<PaginatedResponse<ActivityLog>>('/activity-logs', { params }),
};

export const notificationsApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Notification>>('/notifications', { params }),
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};

export const usersApi = {
  getAll: () => api.get<PaginatedResponse<User>>('/users'),
  getById: (id: string) => api.get<ApiResponse<User>>(`/users/${id}`),
};
