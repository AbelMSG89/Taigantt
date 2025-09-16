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