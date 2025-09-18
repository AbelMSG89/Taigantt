import { apiClient } from "@/lib/api";
import type {
  UserStoryCustomAttribute,
  UserStoryCustomAttributeValues,
  UpdateCustomAttributeValuesRequest,
} from "../models/custom-attributes.models";

export class UserStoryCustomAttributesService {
  private static readonly CAV_URL = "/userstories/custom-attributes-values";
  private static readonly CA_URL = "/userstory-custom-attributes";

  /**
   * Get user story custom attribute values by ID
   */
  static async getCustomAttributeValues(
    id: number
  ): Promise<UserStoryCustomAttributeValues> {
    const response = await apiClient.get(`${this.CAV_URL}/${id}`);
    return response.data;
  }

  /**
   * Update user story custom attribute values (PATCH)
   */
  static async updateCustomAttributeValues(
    id: number,
    data: UpdateCustomAttributeValuesRequest
  ): Promise<UserStoryCustomAttributeValues> {
    const response = await apiClient.patch(`${this.CAV_URL}/${id}`, data);
    return response.data;
  }

  /**
   * Replace user story custom attribute values (PUT)
   */
  static async replaceCustomAttributeValues(
    id: number,
    data: UserStoryCustomAttributeValues
  ): Promise<UserStoryCustomAttributeValues> {
    const response = await apiClient.put(`${this.CAV_URL}/${id}`, data);
    return response.data;
  }

  /**
   * Get all custom attributes for a project
   */
  static async getProjectCustomAttributes(
    projectId: number
  ): Promise<UserStoryCustomAttribute[]> {
    const response = await apiClient.get(`${this.CA_URL}?project=${projectId}`);
    return response.data;
  }

  /**
   * Get a specific custom attribute by ID
   */
  static async getCustomAttribute(
    id: number
  ): Promise<UserStoryCustomAttribute> {
    const response = await apiClient.get(`${this.CA_URL}/${id}`);
    return response.data;
  }
}
