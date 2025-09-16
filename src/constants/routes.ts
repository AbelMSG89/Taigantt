export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROJECT_MILESTONES: '/projects/:projectId/milestones',
  GANTT_VIEW: '/projects/:projectId/milestones/:milestoneId/gantt'
} as const;