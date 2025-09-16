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