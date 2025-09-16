export const API_BASE_URL = 'https://api.taiga.io/api/v1';
export const API_TIMEOUT = 10000;

export const API_ENDPOINTS = {
  AUTH: '/auth',
  PROJECTS: '/projects',
  MILESTONES: '/milestones',
  USER_STORIES: '/userstories',
  CUSTOM_ATTRIBUTES: '/userstory-custom-attributes',
  CUSTOM_ATTRIBUTE_VALUES: '/userstories/custom-attributes-values'
} as const;