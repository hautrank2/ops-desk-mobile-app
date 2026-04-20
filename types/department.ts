export interface DepartmentModel {
  _id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDepartmentDto {
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export type UpdateDepartmentDto = Partial<CreateDepartmentDto>;
