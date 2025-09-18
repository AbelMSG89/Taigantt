import type { UserStory } from "../../user_stories/models/user-stories.models";

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