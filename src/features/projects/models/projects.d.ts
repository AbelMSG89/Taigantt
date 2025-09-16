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
  member?: string;
  order_by?: string;
  slight?: boolean;
}