import { apiClient } from '../api';
import type { Project, ProjectsListParams } from '../types';
import { AuthService } from './auth';

export class ProjectsService {
  static async getProjects(params?: ProjectsListParams): Promise<Project[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.member) {
        queryParams.append('member', params.member.toString());
      }
      
      if (params?.order_by) {
        queryParams.append('order_by', params.order_by);
      }
      
      if (params?.slight !== undefined) {
        queryParams.append('slight', params.slight.toString());
      }

      const queryString = queryParams.toString();
      const url = `/projects${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get<Project[]>(url);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Error fetching projects');
      }
      throw new Error('Connection error. Please try again.');
    }
  }

  static async getMyUserProjects(options?: Omit<ProjectsListParams, 'member'>): Promise<Project[]> {
    const myUserId = AuthService.getCurrentUserId();
    if (!myUserId) {
      throw new Error('No user ID available');
    }
    
    return this.getProjects({
      member: myUserId,
      order_by: options?.order_by || 'user_order',
      slight: options?.slight !== undefined ? options.slight : true,
    });
  }
}

export const getProjects = ProjectsService.getProjects;
export const getUserProjects = ProjectsService.getMyUserProjects;