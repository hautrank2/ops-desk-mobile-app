export interface TableResponse<T> {
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  items: T[];
}
