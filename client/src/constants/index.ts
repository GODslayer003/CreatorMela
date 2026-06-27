export const ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  VIEWER: 'viewer',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  moderator: 'Moderator',
  viewer: 'Viewer',
};

export const SUBMISSION_STATUSES = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CHANGES_REQUESTED: 'changes_requested',
  ARCHIVED: 'archived',
} as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[keyof typeof SUBMISSION_STATUSES];

export const STATUS_LABELS: Record<SubmissionStatus, string> = {
  pending: 'Pending',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
  changes_requested: 'Changes Requested',
  archived: 'Archived',
};

export const STATUS_COLORS: Record<SubmissionStatus, string> = {
  pending: 'bg-white text-yellow-800 border-yellow-200 dark:bg-gray-900 dark:text-yellow-300 dark:border-yellow-800',
  under_review: 'bg-white text-blue-800 border-blue-200 dark:bg-gray-900 dark:text-blue-300 dark:border-blue-800',
  approved: 'bg-white text-green-800 border-green-200 dark:bg-gray-900 dark:text-green-300 dark:border-green-800',
  rejected: 'bg-white text-red-800 border-red-200 dark:bg-gray-900 dark:text-red-300 dark:border-red-800',
  changes_requested: 'bg-white text-orange-800 border-orange-200 dark:bg-gray-900 dark:text-orange-300 dark:border-orange-800',
  archived: 'bg-white text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700',
};

export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export type Priority = (typeof PRIORITIES)[keyof typeof PRIORITIES];

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'bg-white text-slate-700 border-slate-200 dark:bg-gray-900 dark:text-slate-300 dark:border-slate-700',
  medium: 'bg-white text-blue-700 border-blue-200 dark:bg-gray-900 dark:text-blue-300 dark:border-blue-800',
  high: 'bg-white text-orange-700 border-orange-200 dark:bg-gray-900 dark:text-orange-300 dark:border-orange-800',
  urgent: 'bg-white text-red-700 border-red-200 dark:bg-gray-900 dark:text-red-300 dark:border-red-800',
};

export const SUBMISSION_TYPES = {
  CREATOR_PROFILE: 'creator_profile',
  CAMPAIGN: 'campaign',
  CONTENT: 'content',
  BIO_UPDATE: 'bio_update',
  PORTFOLIO: 'portfolio',
} as const;

export type SubmissionType = (typeof SUBMISSION_TYPES)[keyof typeof SUBMISSION_TYPES];

export const SUBMISSION_TYPE_LABELS: Record<SubmissionType, string> = {
  creator_profile: 'Creator Profile',
  campaign: 'Campaign',
  content: 'Content',
  bio_update: 'Bio Update',
  portfolio: 'Portfolio',
};

export const ACTIVITY_ACTIONS = {
  CREATED: 'created',
  VIEWED: 'viewed',
  ASSIGNED: 'assigned',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CHANGES_REQUESTED: 'changes_requested',
  BULK_ACTION: 'bulk_action',
  LOGIN: 'login',
  LOGOUT: 'logout',
  PROFILE_UPDATE: 'profile_update',
} as const;

export type ActivityAction = (typeof ACTIVITY_ACTIONS)[keyof typeof ACTIVITY_ACTIONS];

export const PAGE_SIZES = [10, 20, 50, 100] as const;

export type PageSize = (typeof PAGE_SIZES)[number];

export const DEFAULT_PAGE_SIZE: PageSize = 20;
