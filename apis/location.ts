import { httpClient } from "@/lib/httpClient";
import {
  CreateLocationModel,
  LocationModel,
  LocationQueryModel,
  TableResponse,
  UpdateLocationModel,
} from "@/types";

// ─── API ─────────────────────────────────────────────────────────────────────

export const locationApis = {
  /**
   * GET /location
   * Query: LocationQueryModel
   */
  getList: async (
    params?: LocationQueryModel,
  ): Promise<TableResponse<LocationModel>> => {
    const res = await httpClient.get<TableResponse<LocationModel>>(
      "/location",
      { params },
    );
    return res.data;
  },

  /**
   * GET /location/:id
   */
  getById: async (id: string): Promise<LocationModel> => {
    const res = await httpClient.get<LocationModel>(`/location/${id}`);
    return res.data;
  },

  /**
   * POST /location
   */
  create: async (args: CreateLocationModel): Promise<LocationModel> => {
    const res = await httpClient.post<LocationModel>("/location", args);
    return res.data;
  },

  /**
   * PATCH /location/:id
   */
  update: async (
    id: string,
    args: UpdateLocationModel,
  ): Promise<LocationModel> => {
    const res = await httpClient.patch<LocationModel>(
      `/location/${id}`,
      args,
    );
    return res.data;
  },

  /**
   * DELETE /location/:id
   */
  remove: async (id: string): Promise<LocationModel> => {
    const res = await httpClient.delete<LocationModel>(`/location/${id}`);
    return res.data;
  },
};
