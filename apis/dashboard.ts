import { httpClient } from "@/lib/httpClient";
import {
  AdminDashboardModel,
  ManagerDashboardModel,
  UserDashboardModel,
} from "@/types";

// ─── API ─────────────────────────────────────────────────────────────────────
// Each role has its own endpoint returning a role-specific shape.

export const dashboardApi = {
  /** GET /dashboard/admin — full system overview (admin only) */
  getAdminOverview: async (): Promise<AdminDashboardModel> => {
    const res = await httpClient.get<AdminDashboardModel>("/dashboard/admin");
    return res.data;
  },

  /** GET /dashboard/manager — operational overview (admin/manager) */
  getManagerOverview: async (): Promise<ManagerDashboardModel> => {
    const res = await httpClient.get<ManagerDashboardModel>(
      "/dashboard/manager",
    );
    return res.data;
  },

  /** GET /dashboard/user — personal overview (my tickets) */
  getUserOverview: async (): Promise<UserDashboardModel> => {
    const res = await httpClient.get<UserDashboardModel>("/dashboard/user");
    return res.data;
  },
};
