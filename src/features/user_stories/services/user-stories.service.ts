import { apiClient } from "@/lib/api";
import type { UserStory } from "../models/user-stories.models";
import { UserStoryCustomAttributesService } from "./custom-attributes.service";

export interface GetUserStoriesOptions {
  project?: number;
  milestone?: number;
  status?: number;
  assigned_to?: number;
  tags?: string;
  watchers?: number;
  epic?: number;
  role?: number;
  owner?: number;
  q?: string;
  page?: number;
  page_size?: number;
  order_by?: string;
}

export class UserStoriesService {
  private static readonly BASE_URL = "/userstories";

  /**
   * Get all user stories with optional filters
   */
  static async getUserStories(
    options: GetUserStoriesOptions = {}
  ): Promise<UserStory[]> {
    const params = new URLSearchParams();

    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(
      `${this.BASE_URL}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Get a specific user story by ID
   */
  static async getUserStory(id: number): Promise<UserStory> {
    const response = await apiClient.get(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  /**
   * Create a new user story
   */
  static async createUserStory(
    userStory: Partial<UserStory>
  ): Promise<UserStory> {
    const response = await apiClient.post(this.BASE_URL, userStory);
    return response.data;
  }

  /**
   * Update a user story (PATCH)
   */
  static async updateUserStory(
    id: number,
    userStory: Partial<UserStory>
  ): Promise<UserStory> {
    const response = await apiClient.patch(`${this.BASE_URL}/${id}`, userStory);
    return response.data;
  }

  /**
   * Replace a user story (PUT)
   */
  static async replaceUserStory(
    id: number,
    userStory: UserStory
  ): Promise<UserStory> {
    const response = await apiClient.put(`${this.BASE_URL}/${id}`, userStory);
    return response.data;
  }

  /**
   * Delete a user story
   */
  static async deleteUserStory(id: number): Promise<void> {
    await apiClient.delete(`${this.BASE_URL}/${id}`);
  }

  /**
   * Get user stories for a specific project
   */
  static async getProjectUserStories(projectId: number): Promise<UserStory[]> {
    return this.getUserStories({ project: projectId });
  }

  /**
   * Get user stories for a specific milestone
   */
  static async getMilestoneUserStories(
    milestoneId: number
  ): Promise<UserStory[]> {
    return this.getUserStories({ milestone: milestoneId });
  }

  static readonly CustomAttributes = UserStoryCustomAttributesService;
}
