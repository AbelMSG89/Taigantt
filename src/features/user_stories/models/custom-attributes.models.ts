export interface UserStoryCustomAttribute {
  created_date: string;
  description: string;
  extra: any | null;
  id: number;
  modified_date: string;
  name: string;
  order: number;
  project: number;
  type: 'text' | 'multiline' | 'richtext' | 'date' | 'url' | 'dropdown' | 'number' | 'checkbox';
}

export interface UserStoryCustomAttributeValues {
  attributes_values: Record<string, string>;
  user_story: number;
  version: number;
}

export interface UpdateCustomAttributeValuesRequest {
  attributes_values: Record<string, string>;
  version: number;
}