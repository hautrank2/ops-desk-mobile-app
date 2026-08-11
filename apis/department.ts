import { httpClient } from "@/lib/httpClient";
import {
  CreateDepartmentDto,
  DepartmentModel,
  UpdateDepartmentDto,
} from "@/types";

// ─── API ─────────────────────────────────────────────────────────────────────
// Server: DepartmentController. findAll returns active departments as an array.

export const departmentApis = {
  /** GET /department — returns an array of active departments */
  getList: async (): Promise<DepartmentModel[]> => {
    const res = await httpClient.get<DepartmentModel[]>("/department");
    return res.data;
  },

  /** GET /department/:id */
  getById: async (id: string): Promise<DepartmentModel> => {
    const res = await httpClient.get<DepartmentModel>(`/department/${id}`);
    return res.data;
  },

  /** POST /department */
  create: async (args: CreateDepartmentDto): Promise<DepartmentModel> => {
    const res = await httpClient.post<DepartmentModel>("/department", args);
    return res.data;
  },

  /** PATCH /department/:id */
  update: async (
    id: string,
    args: UpdateDepartmentDto,
  ): Promise<DepartmentModel> => {
    const res = await httpClient.patch<DepartmentModel>(
      `/department/${id}`,
      args,
    );
    return res.data;
  },

  /** DELETE /department/:id */
  remove: async (id: string): Promise<DepartmentModel> => {
    const res = await httpClient.delete<DepartmentModel>(`/department/${id}`);
    return res.data;
  },
};
