export const PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_TICKETS: 'manage_tickets',
  VIEW_ALL_TICKETS: 'view_all_tickets'
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];


