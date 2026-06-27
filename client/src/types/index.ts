import type {
  SubmissionStatus,
  Priority,
  SubmissionType,
  Role,
  ActivityAction,
} from '@/constants';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Creator {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  category: string;
  followers: number;
  platforms: string[];
  isVerified: boolean;
  riskScore: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Campaign {
  _id: string;
  title: string;
  description: string;
  brand: string;
  creator: Creator;
  budget: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Submission {
  _id: string;
  title: string;
  description: string;
  type: SubmissionType;
  status: SubmissionStatus;
  priority: Priority;
  creator: Creator;
  campaign?: Campaign;
  submittedBy: User;
  assignedTo?: User;
  content: {
    text?: string;
    mediaUrls: string[];
    links: string[];
  };
  tags: string[];
  riskScore: number;
  reviewCount: number;
  lastReviewedAt?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Review {
  _id: string;
  submission: Submission;
  reviewer: User;
  action: 'approve' | 'reject' | 'request_changes';
  note?: string;
  reason?: string;
  previousStatus: SubmissionStatus;
  newStatus: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  submission: string;
  author: User;
  content: string;
  isInternal: boolean;
  parentComment?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface ActivityLog {
  _id: string;
  action: ActivityAction;
  entity: string;
  entityId: string;
  performedBy: User;
  details: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
    description: string;
  };
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  pendingApprovals: number;
  approvedToday: number;
  rejectedToday: number;
  changesRequested: number;
  approvalRate: number;
  averageReviewTime: number;
  activeModerators: number;
  pendingByCategory: Array<{ category: string; count: number }>;
  weeklyReviews: Array<{ date: string; approved: number; rejected: number; changesRequested: number }>;
  recentActivities: ActivityLog[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface FilterState {
  status: SubmissionStatus[];
  priority: Priority[];
  submissionType: SubmissionType[];
  category: string[];
  reviewer: string[];
  tags: string[];
  dateRange: { from: string; to: string } | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  hasAttachments: boolean | null;
  hasComments: boolean | null;
  search: string;
}
