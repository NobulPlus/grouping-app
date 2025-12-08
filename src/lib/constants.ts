/**
 * Predefined name options for dropdown selection
 */

export const SURNAME_OPTIONS = [
  'Adebayo',
  'Chukwu',
  'Oyedele',
  'Okoro',
  'Ibrahim',
  'Olufemi',
  'Aliyu',
  'Nwosu',
  'Adamu',
  'Tunde',
  'Okafor',
  'Bello',
  'Eze',
  'Musa',
  'Okonkwo',
];

export const FIRST_NAME_OPTIONS = [
  'Chinwe',
  'Ifeoma',
  'Oluwatobi',
  'Amaka',
  'Isaac',
  'Fatima',
  'Kehinde',
  'Adesuwa',
  'Umar',
  'Bola',
  'Chioma',
  'Emeka',
  'Ngozi',
  'Yusuf',
  'Blessing',
];

export const MIDDLE_NAME_OPTIONS = [
  'Olufunke',
  'Abimbola',
  'Kambili',
  'Adebayo',
  'Aminu',
  'Chinedu',
  'Idris',
  'Funmilayo',
  'Taiwo',
  'Ezekiel',
  'Chiamaka',
  'Babatunde',
  'Nneka',
  'Abdullahi',
  'Chidinma',
];

/**
 * Group names
 */
export const GROUP_NAMES = ['Orange', 'Blue', 'Green', 'Purple'] as const;

/**
 * Application routes
 */
export const ROUTES = {
  HOME: '/',
  REGISTER: '/register',
  CONFIRM: '/confirm',
  DASHBOARD: '/dashboard',
  GROUP: (id: string) => `/group/${id}`,
} as const;

/**
 * API endpoints (relative to base URL)
 */
export const API_ENDPOINTS = {
  REGISTER: '/api/users/register',
  CHECK_NAME: '/api/users/check',
  GROUPS: '/api/groups',
  GROUP_BY_ID: (id: string) => `/api/groups/${id}`,
  GROUP_MEMBERS: (id: string) => `/api/users/group/${id}/members`,
  STATS: '/api/users/stats',
  USER_BY_ID: (id: string) => `/api/users/${id}`,
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/**
 * Query keys for React Query
 */
export const QUERY_KEYS = {
  GROUPS: ['groups'],
  GROUP: (id: string) => ['group', id],
  GROUP_MEMBERS: (id: string, page: number) => ['group-members', id, page],
  STATS: ['stats'],
  USER: (id: string) => ['user', id],
  CHECK_NAME: (surname: string, firstName: string, middleName: string) => [
    'check-name',
    surname,
    firstName,
    middleName,
  ],
} as const;
