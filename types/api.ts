export type TableResponse<T> = {
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  items: T[];
};

export type ApiError = {
  statusCode: number;
  timestamp: string;
  path: string;
  error: string;
  message: string;
};
