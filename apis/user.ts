import { httpClient } from "@/lib/httpClient";
import { CreateUserDto, UpdateUserDto, UserModel } from "@/types";

// ─── API ─────────────────────────────────────────────────────────────────────
// Admin-only user management. Server: UserController (@UseGuards(AdminGuard)).

export const userApis = {
  /** GET /user — returns an array of users */
  getList: async (): Promise<UserModel[]> => {
    const res = await httpClient.get<UserModel[]>("/user");
    return res.data;
  },

  /** GET /user/:id */
  getById: async (id: string): Promise<UserModel> => {
    const res = await httpClient.get<UserModel>(`/user/${id}`);
    return res.data;
  },

  /** POST /user */
  create: async (args: CreateUserDto): Promise<UserModel> => {
    const res = await httpClient.post<UserModel>("/user", args);
    return res.data;
  },

  /** PATCH /user/:id */
  update: async (id: string, args: UpdateUserDto): Promise<UserModel> => {
    const res = await httpClient.patch<UserModel>(`/user/${id}`, args);
    return res.data;
  },

  /** DELETE /user/:id */
  remove: async (id: string): Promise<UserModel> => {
    const res = await httpClient.delete<UserModel>(`/user/${id}`);
    return res.data;
  },
};
