export interface APIResponse<T = unknown> {
  message: string;
  data: T;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}
