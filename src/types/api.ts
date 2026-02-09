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

export interface APIResponseWithPagination<T = unknown> {
  message: string
  data: T
  pagination: {
    total: number
    page: number
    limit: number
  }
  success: boolean
}