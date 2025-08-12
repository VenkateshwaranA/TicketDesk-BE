export const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ROLE_TO_PERMISSIONS: Record<Role, string[]> = {
  [ROLES.ADMIN]: ['manage_users', 'manage_tickets', 'view_all_tickets'],
  [ROLES.USER]: ['manage_tickets']
};


