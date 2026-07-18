import { LOCAL_KEYS } from "@/constants/local";
import { httpClient } from "@/lib/httpClient";
import {
  AssetModel,
  CreateAssetPayload,
  TableResponse,
  UpdateAssetPayload,
} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Lấy JWT token từ AsyncStorage (dùng cho fetch native)
 */
const getAuthToken = async (): Promise<string | null> => {
  const raw = await AsyncStorage.getItem(LOCAL_KEYS.TOKEN);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed.token ?? raw;
  } catch {
    return raw;
  }
};

export const assetApi = {
  getList: async (params: { page: number; pageSize: number }) => {
    const response = await httpClient.get<TableResponse<AssetModel>>("/asset", {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await httpClient.get<AssetModel>(`/asset/${id}`);
    return response.data;
  },

  /**
   * Dùng fetch native thay vì axios để upload multipart/form-data.
   * Axios + React Native Hermes không tự set đúng Content-Type boundary
   * khi dùng FormData polyfill → fetch xử lý đúng 100%.
   */
  create: async (data: CreateAssetPayload): Promise<AssetModel> => {
    const formData = new FormData();
    formData.append("code", data.code);
    formData.append("name", data.name);
    formData.append("type", data.type);
    if (data.vendor) formData.append("vendor", data.vendor);
    if (data.model) formData.append("model", data.model);
    if (data.purchaseUrl) formData.append("purchaseUrl", data.purchaseUrl);
    if (data.description) formData.append("description", data.description);

    // Server nhận tối đa 2 ảnh (FilesInterceptor('images', 2))
    if (data.images && data.images.length > 0) {
      data.images.slice(0, 2).forEach((image, index) => {
        formData.append("images", {
          uri: image.uri,
          name: image.fileName ?? `image${index}.jpg`,
          type: image.mimeType ?? "image/jpeg",
        } as any);
      });
    }

    const token = await getAuthToken();
    const headers: Record<string, string> = {
      Accept: "application/json",
      // KHÔNG set Content-Type — fetch tự set multipart/form-data với boundary
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}/asset`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const message =
        errBody?.message ?? `Request failed with status ${res.status}`;
      throw new Error(message);
    }

    return res.json() as Promise<AssetModel>;
  },

  /**
   * Thêm ảnh cho asset.
   * Server: POST /asset/:id/images — multipart, field "images", max 2 file/request.
   * Dùng fetch native (cùng lý do với create).
   */
  addImages: async (
    id: string,
    images: Array<{ uri: string; fileName?: string | null; mimeType?: string | null }>,
  ): Promise<AssetModel> => {
    const formData = new FormData();
    images.slice(0, 2).forEach((image, index) => {
      formData.append("images", {
        uri: image.uri,
        name: image.fileName ?? `image${index}.jpg`,
        type: image.mimeType ?? "image/jpeg",
      } as any);
    });

    const token = await getAuthToken();
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}/asset/${id}/images`, {
      method: "POST",
      headers,
      body: formData as any,
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody?.message ?? `Request failed with status ${res.status}`);
    }
    return res.json() as Promise<AssetModel>;
  },

  /**
   * Xoá ảnh theo index trong mảng imageUrls.
   * Server: DELETE /asset/:id/images/:imgIndex
   */
  removeImage: async (id: string, imgIndex: number): Promise<AssetModel> => {
    const response = await httpClient.delete<AssetModel>(
      `/asset/${id}/images/${imgIndex}`,
    );
    return response.data;
  },

  update: async (id: string, data: UpdateAssetPayload) => {
    const response = await httpClient.patch<AssetModel>(`/asset/${id}`, data);
    return response.data;
  },

  remove: async (id: string) => {
    const response = await httpClient.delete(`/asset/${id}`);
    return response.data;
  },
};
