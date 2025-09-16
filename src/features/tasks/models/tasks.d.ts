export interface TaskUserInfo {
  big_photo: string | null;
  full_name_display: string;
  gravatar_id: string;
  id: number;
  is_active: boolean;
  photo: string | null;
  username: string;
}

export interface TaskProjectInfo {
  id: number;
  logo_small_url: string | null;
  name: string;
  slug: string;
}

export interface TaskStatusInfo {
  color: string;
  is_closed: boolean;
  name: string;
}

export interface TaskEpicInfo {
  color: string;
  id: number;
  project: {
    id: number;
    name: string;
    slug: string;
  };
  ref: number;
  subject: string;
}

export interface TaskUserStoryInfo {
  epics: TaskEpicInfo[];
  id: number;
  ref: number;
  subject: string;
}

export interface TaskAttachment {
  id: number;
  name: string;
  attached_file: string;
  size: number;
  url: string;
  thumbnail_card_url: string | null;
  created_date: string;
  modified_date: string;
  is_deprecated: boolean;
  from_comment: boolean;
  description: string;
  order: number;
}

export interface Task {
  assigned_to: number | null;
  assigned_to_extra_info: TaskUserInfo | null;
  attachments: TaskAttachment[];
  blocked_note: string;
  created_date: string;
  custom_attributes_values?: Record<string, string>;
  due_date: string | null;
  due_date_reason: string;
  due_date_status: 'not_set' | 'set' | 'due_soon' | 'past_due';
  external_reference: string | null;
  finished_date: string | null;
  id: number;
  is_blocked: boolean;
  is_closed: boolean;
  is_iocaine: boolean;
  is_voter: boolean;
  is_watcher: boolean;
  milestone: number | null;
  milestone_slug: string | null;
  modified_date: string;
  owner: number;
  owner_extra_info: TaskUserInfo;
  project: number;
  project_extra_info: TaskProjectInfo;
  ref: number;
  status: number;
  status_extra_info: TaskStatusInfo;
  subject: string;
  tags: Array<[string, string | null]>;
  taskboard_order: number;
  total_comments: number;
  total_voters: number;
  total_watchers: number;
  us_order: number;
  user_story: number | null;
  user_story_extra_info: TaskUserStoryInfo | null;
  version: number;
  watchers: number[];
}

export interface CreateTaskRequest {
  subject: string;
  project: number;
  status?: number;
  user_story?: number;
  milestone?: number;
  assigned_to?: number;
  description?: string;
  tags?: string[];
  due_date?: string;
  is_blocked?: boolean;
  blocked_note?: string;
  is_iocaine?: boolean;
  external_reference?: string;
  taskboard_order?: number;
  us_order?: number;
  custom_attributes_values?: Record<string, string>;
}

export interface UpdateTaskRequest {
  subject?: string;
  description?: string;
  status?: number;
  user_story?: number;
  milestone?: number;
  assigned_to?: number;
  tags?: string[];
  due_date?: string;
  due_date_reason?: string;
  is_blocked?: boolean;
  blocked_note?: string;
  is_iocaine?: boolean;
  external_reference?: string;
  taskboard_order?: number;
  us_order?: number;
  version: number;
  custom_attributes_values?: Record<string, string>;
}

export interface GetTasksOptions {
  project?: number;
  status?: number;
  tags?: string;
  user_story?: number;
  role?: number;
  owner?: number;
  milestone?: number;
  watchers?: number;
  assigned_to?: number;
  status__is_closed?: boolean;

  exclude_status?: number;
  exclude_tags?: string;
  exclude_role?: number;
  exclude_owner?: number;
  exclude_assigned_to?: number;

  page?: number;
  page_size?: number;
  order_by?: string;

  q?: string;
  include_attachments?: boolean;
}

export interface TasksListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Task[];
}