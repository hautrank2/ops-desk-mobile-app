import { httpClient } from '@/lib/httpClient';
import { AssetModel, CreateAssetPayload, UpdateAssetPayload } from '@/types';

export const assetService = {
  get: async () => {
    // This is probably get all, we can implement if needed or leave as is if not requested
    const response = await httpClient.get<AssetModel[]>('/assets');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await httpClient.get<AssetModel>(`/assets/${id}`);
    return response.data;
  },
  create: async (data: CreateAssetPayload) => {
    const response = await httpClient.post<AssetModel>('/assets', data);
    return response.data;
  },
  update: async (id: string, data: UpdateAssetPayload) => {
    const response = await httpClient.put<AssetModel>(`/assets/${id}`, data);
    return response.data;
  }
};