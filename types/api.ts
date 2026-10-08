export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string | { code: string; message: string; details?: any };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page?: number;
  pageSize?: number;
}
