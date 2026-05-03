export type DepartmentModel = {
  _id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateDepartmentDto = {
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
};

export type UpdateDepartmentDto = Partial<CreateDepartmentDto>;
