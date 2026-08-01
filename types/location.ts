export type FloorType = "B2" | "B1" | 0 | 1 | 2 | 3;

export type LocationModel = {
  _id: string;
  code: string;
  name: string;
  floor?: FloorType | null;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type LocationQueryModel = {
  page?: number;
  pageSize?: number;
  code?: string;
  name?: string;
  floor?: FloorType;
  isActive?: boolean;
};

export type CreateLocationModel = {
  code: string;
  name: string;
  floor?: FloorType | null;
  description?: string;
  isActive?: boolean;
};

export type UpdateLocationModel = Partial<CreateLocationModel>;
