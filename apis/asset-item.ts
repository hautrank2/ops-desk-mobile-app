import { httpClient } from "@/lib/httpClient";
import {
  AssetItemModel,
  AssetItemPopulation,
  AssetItemQueryModel,
  TableResponse,
  UpdateAssetItemModel,
} from "@/types";

// ─── API ─────────────────────────────────────────────────────────────────────

export const assetItemApis = {
  /**
   * GET /asset-item
   * Query: AssetItemQueryModel
   */
  getList: async (
    params?: AssetItemQueryModel,
  ): Promise<TableResponse<AssetItemModel>> => {
    const res = await httpClient.get<TableResponse<AssetItemModel>>(
      "/asset-item",
      { params },
    );
    return res.data;
  },

  /**
   * GET /asset-item/:id
   * Query: populations[] — populate assetId, createdBy, updatedBy
   */
  getById: async (
    id: string,
    populations?: AssetItemPopulation[],
  ): Promise<AssetItemModel> => {
    const res = await httpClient.get<AssetItemModel>(`/asset-item/${id}`, {
      params: populations?.length ? { populations } : undefined,
    });
    return res.data;
  },

  /**
   * PATCH /asset-item/:id
   * Body: UpdateAssetItemModel (partial)
   */
  update: async (
    id: string,
    args: UpdateAssetItemModel,
  ): Promise<AssetItemModel> => {
    const res = await httpClient.patch<AssetItemModel>(
      `/asset-item/${id}`,
      args,
    );
    return res.data;
  },
};
