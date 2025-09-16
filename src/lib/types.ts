export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
}