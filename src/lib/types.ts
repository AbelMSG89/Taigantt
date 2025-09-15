export interface LoginRequest {
  type: 'normal';
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  full_name_display: string;
  bio: string;
  photo: string | null;
  big_photo: string | null;
  color: string;
  lang: string;
  theme: string;
  timezone: string;
  is_active: boolean;
  date_joined: string;
  gravatar_id: string;
  accepted_terms: boolean;
  read_new_terms: boolean;
  max_memberships_private_projects: number | null;
  max_memberships_public_projects: number | null;
  max_private_projects: number | null;
  max_public_projects: number | null;
  total_private_projects: number;
  total_public_projects: number;
  roles: string[];
  uuid: string;
}

export interface LoginResponse extends AuthUser {
  auth_token: string;
  refresh: string;
}

export interface ProjectOwner {
  big_photo: string | null;
  full_name_display: string;
  gravatar_id: string;
  id: number;
  is_active: boolean;
  photo: string | null;
  username: string;
}

export interface Project {
  anon_permissions: string[];
  blocked_code: string | null;
  created_date: string;
  creation_template: number | null;
  default_epic_status: number;
  default_issue_status: number;
  default_issue_type: number;
  default_points: number;
  default_priority: number;
  default_severity: number;
  default_task_status: number;
  default_us_status: number;
  description: string;
  i_am_admin: boolean;
  i_am_member: boolean;
  i_am_owner: boolean;
  id: number;
  is_backlog_activated: boolean;
  is_contact_activated: boolean;
  is_epics_activated: boolean;
  is_fan: boolean;
  is_featured: boolean;
  is_issues_activated: boolean;
  is_kanban_activated: boolean;
  is_looking_for_people: boolean;
  is_private: boolean;
  is_watcher: boolean;
  is_wiki_activated: boolean;
  logo_big_url: string | null;
  logo_small_url: string | null;
  looking_for_people_note: string;
  members: number[];
  modified_date: string;
  my_homepage: boolean;
  my_permissions: string[];
  name: string;
  notify_level: number;
  owner: ProjectOwner;
  public_permissions: string[];
  slug: string;
  tags: string[];
  tags_colors: Record<string, string>;
  total_activity: number;
  total_activity_last_month: number;
  total_activity_last_week: number;
  total_activity_last_year: number;
  total_closed_milestones: number;
  total_fans: number;
  total_fans_last_month: number;
  total_fans_last_week: number;
  total_fans_last_year: number;
  total_milestones: number | null;
  total_story_points: number | null;
  total_watchers: number;
  totals_updated_datetime: string;
  videoconferences: string | null;
  videoconferences_extra_data: string | null;
}

export interface ProjectsListParams {
  member?: number;
  order_by?: string;
  slight?: boolean;
}

export interface UserStory {
  assigned_to: number | null;
  assigned_to_extra_info: {
    big_photo: string | null;
    full_name_display: string;
    gravatar_id: string;
    id: number;
    is_active: boolean;
    photo: string | null;
    username: string;
  } | null;
  backlog_order: number;
  blocked_note: string;
  client_requirement: boolean;
  created_date: string;
  due_date: string | null;
  due_date_reason: string;
  due_date_status: string;
  epics: Array<{
    color: string;
    id: number;
    project: {
      id: number;
      name: string;
      slug: string;
    };
    ref: number;
    subject: string;
  }>;
  external_reference: string | null;
  finish_date: string | null;
  id: number;
  is_blocked: boolean;
  is_closed: boolean;
  kanban_order: number;
  milestone: number;
  modified_date: string;
  points: Record<string, number>;
  project: number;
  project_extra_info: {
    id: number;
    logo_small_url: string | null;
    name: string;
    slug: string;
  };
  ref: number;
  sprint_order: number;
  status: number;
  status_extra_info: {
    color: string;
    is_closed: boolean;
    name: string;
  };
  subject: string;
  team_requirement: boolean;
  total_points: number;
  version: number;
}

export interface Milestone {
  id: number;
  name: string;
  slug: string;
  owner: number;
  project: number;
  project_extra_info: {
    id: number;
    logo_small_url: string | null;
    name: string;
    slug: string;
  };
  estimated_start: string | null;
  estimated_finish: string | null;
  created_date: string;
  modified_date: string;
  closed: boolean;
  disponibility: number;
  order: number;
  closed_points: number | null;
  total_points: number | null;
  user_stories: UserStory[];
}

export interface MilestonesListParams {
  project: number;
  closed?: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
}