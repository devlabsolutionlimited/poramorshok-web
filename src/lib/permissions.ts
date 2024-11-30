import { AdminUser } from '@/contexts/AdminContext';

export type Permission = 
  // User Management
  | 'manage_users'
  | 'view_users'
  | 'delete_users'
  
  // Mentor Management  
  | 'manage_mentors'
  | 'verify_mentors'
  | 'suspend_mentors'
  
  // Session Management
  | 'manage_sessions'
  | 'view_sessions'
  | 'cancel_sessions'
  
  // Payment Management
  | 'manage_payments'
  | 'process_refunds'
  | 'view_payments'
  | 'manage_withdrawals'
  
  // Report Management
  | 'manage_reports'
  | 'view_reports'
  | 'resolve_reports'
  
  // Content Management
  | 'manage_content'
  | 'view_content'
  
  // System Settings
  | 'manage_settings'
  | 'view_settings'
  | 'manage_system';

export const PERMISSION_CATEGORIES = {
  user_management: [
    'manage_users',
    'view_users',
    'delete_users'
  ],
  mentor_management: [
    'manage_mentors',
    'verify_mentors',
    'suspend_mentors'
  ],
  session_management: [
    'manage_sessions',
    'view_sessions',
    'cancel_sessions'
  ],
  payment_management: [
    'manage_payments',
    'process_refunds',
    'view_payments',
    'manage_withdrawals'
  ],
  report_management: [
    'manage_reports',
    'view_reports',
    'resolve_reports'
  ],
  content_management: [
    'manage_content',
    'view_content'
  ],
  system_settings: [
    'manage_settings',
    'view_settings',
    'manage_system'
  ]
} as const;

export const ROLE_PERMISSIONS = {
  admin: [
    // Full System Access
    'manage_users',
    'view_users',
    'delete_users',
    'manage_mentors',
    'verify_mentors',
    'suspend_mentors',
    'manage_sessions',
    'view_sessions',
    'cancel_sessions',
    'manage_payments',
    'process_refunds',
    'view_payments',
    'manage_withdrawals',
    'manage_reports',
    'view_reports',
    'resolve_reports',
    'manage_content',
    'view_content',
    'manage_settings',
    'view_settings',
    'manage_system'
  ],
  moderator: [
    // Limited Access
    'view_users',
    'view_mentors',
    'verify_mentors',
    'view_sessions',
    'view_payments',
    'view_reports',
    'resolve_reports',
    'view_content',
    'view_settings'
  ]
} as const;

export function hasPermission(user: AdminUser | null, permission: Permission): boolean {
  if (!user) return false;
  return ROLE_PERMISSIONS[user.role].includes(permission);
}

export function checkPermissions(user: AdminUser | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.every(permission => hasPermission(user, permission));
}