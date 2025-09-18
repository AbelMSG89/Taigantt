import { apiClient } from '../../../lib/api.ts';
import type { Milestone, MilestonesListParams } from '@/features/milestones/models/milestones.models.ts';

export class MilestonesService {
  static async getMilestones(params?: MilestonesListParams): Promise<Milestone[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.project) {
        queryParams.append('project', params.project.toString());
      }
      
      if (params?.closed !== undefined) {
        queryParams.append('closed', params.closed.toString());
      }

      const queryString = queryParams.toString();
      const url = `/milestones${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get<Milestone[]>(url);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Unauthorized access. Please login again.');
      } else if (error.response?.data) {
        throw new Error('Error fetching milestones. Please try again.');
      }
      throw new Error('Connection error. Please try again.');
    }
  }

  static async getProjectMilestones(projectId: number, includeClosed: boolean = false): Promise<Milestone[]> {
    return this.getMilestones({
      project: projectId,
      closed: includeClosed,
    });
  }

  static async getMilestoneById(milestoneId: number): Promise<Milestone> {
    try {
      const response = await apiClient.get<Milestone>(`/milestones/${milestoneId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Unauthorized access. Please login again.');
      } else if (error.response?.status === 404) {
        throw new Error('Milestone not found.');
      } else if (error.response?.data) {
        throw new Error('Error fetching milestone. Please try again.');
      }
      throw new Error('Connection error. Please try again.');
    }
  }

  static async getActiveMilestones(projectId: number): Promise<Milestone[]> {
    return this.getProjectMilestones(projectId, false);
  }

  static async getAllMilestones(projectId: number): Promise<Milestone[]> {
    return this.getProjectMilestones(projectId, true);
  }
}

export const getMilestones = MilestonesService.getMilestones;
export const getProjectMilestones = MilestonesService.getProjectMilestones;
export const getMilestoneById = MilestonesService.getMilestoneById;
export const getActiveMilestones = MilestonesService.getActiveMilestones;
export const getAllMilestones = MilestonesService.getAllMilestones;