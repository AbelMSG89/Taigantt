import { apiClient } from "@/lib/api";
import type { 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest,
  GetTasksOptions,
  TasksListResponse 
} from "../models/tasks";

export class TasksService {
  private static readonly BASE_URL = "/tasks";

  /**
   * Get all tasks with optional filters
   */
  static async getTasks(options: GetTasksOptions = {}): Promise<Task[]> {
    const params = new URLSearchParams();
    
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`${this.BASE_URL}?${params.toString()}`);
    return response.data;
  }

  /**
   * Get tasks with pagination support
   */
  static async getTasksWithPagination(options: GetTasksOptions = {}): Promise<TasksListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`${this.BASE_URL}?${params.toString()}`);
    return response.data;
  }

  /**
   * Get a specific task by ID
   */
  static async getTask(id: number): Promise<Task> {
    const response = await apiClient.get(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  /**
   * Create a new task
   */
  static async createTask(task: CreateTaskRequest): Promise<Task> {
    const response = await apiClient.post(this.BASE_URL, task);
    return response.data;
  }

  /**
   * Update a task (PATCH)
   */
  static async updateTask(id: number, task: UpdateTaskRequest): Promise<Task> {
    const response = await apiClient.patch(`${this.BASE_URL}/${id}`, task);
    return response.data;
  }

  /**
   * Replace a task completely (PUT)
   */
  static async replaceTask(id: number, task: Task): Promise<Task> {
    const response = await apiClient.put(`${this.BASE_URL}/${id}`, task);
    return response.data;
  }

  /**
   * Delete a task
   */
  static async deleteTask(id: number): Promise<void> {
    await apiClient.delete(`${this.BASE_URL}/${id}`);
  }

  /**
   * Get tasks for a specific project
   */
  static async getProjectTasks(projectId: number, options: Omit<GetTasksOptions, 'project'> = {}): Promise<Task[]> {
    return this.getTasks({ ...options, project: projectId });
  }

  /**
   * Get tasks for a specific user story
   */
  static async getUserStoryTasks(userStoryId: number, options: Omit<GetTasksOptions, 'user_story'> = {}): Promise<Task[]> {
    return this.getTasks({ ...options, user_story: userStoryId });
  }

  /**
   * Get tasks for a specific milestone
   */
  static async getMilestoneTasks(milestoneId: number, options: Omit<GetTasksOptions, 'milestone'> = {}): Promise<Task[]> {
    return this.getTasks({ ...options, milestone: milestoneId });
  }

  /**
   * Get tasks assigned to a specific user
   */
  static async getAssignedTasks(userId: number, options: Omit<GetTasksOptions, 'assigned_to'> = {}): Promise<Task[]> {
    return this.getTasks({ ...options, assigned_to: userId });
  }

  /**
   * Get tasks owned by a specific user
   */
  static async getOwnedTasks(userId: number, options: Omit<GetTasksOptions, 'owner'> = {}): Promise<Task[]> {
    return this.getTasks({ ...options, owner: userId });
  }

  /**
   * Get closed tasks
   */
  static async getClosedTasks(options: Omit<GetTasksOptions, 'status__is_closed'> = {}): Promise<Task[]> {
    return this.getTasks({ ...options, status__is_closed: true });
  }

  /**
   * Get open tasks
   */
  static async getOpenTasks(options: Omit<GetTasksOptions, 'status__is_closed'> = {}): Promise<Task[]> {
    return this.getTasks({ ...options, status__is_closed: false });
  }

  /**
   * Get tasks with specific tags
   */
  static async getTasksByTags(tags: string[], options: Omit<GetTasksOptions, 'tags'> = {}): Promise<Task[]> {
    return this.getTasks({ ...options, tags: tags.join(',') });
  }

  /**
   * Search tasks by query
   */
  static async searchTasks(query: string, options: Omit<GetTasksOptions, 'q'> = {}): Promise<Task[]> {
    return this.getTasks({ ...options, q: query });
  }
}