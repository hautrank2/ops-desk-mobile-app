import { LOCAL_KEYS } from "@/constants/local";
import { httpClient } from "@/lib/httpClient";
import {
  AddAssetImageModel,
  AssetModel,
  AssetQueryModel,
  CreateAssetItemModel,
  CreateAssetModel,
  TableResponse,
  UpdateAssetModel,
} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// ─── Helper ───────────────────────────────────────────────────────────────────

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

const fetchMultipart = async <T>(
  url: string,
  formData: FormData,
  method: "POST" | "PUT" = "POST",
): Promise<T> => {
  const token = await getAuthToken();
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers,
    body: formData as any,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
};

const buildFormData = (args: CreateAssetModel): FormData => {
  const fd = new FormData();
  fd.append("code", args.code);
  fd.append("name", args.name);
  fd.append("type", args.type);
  if (args.vendor) fd.append("vendor", args.vendor);
  if (args.model) fd.append("model", args.model);
  if (args.purchaseUrl) fd.append("purchaseUrl", args.purchaseUrl);
  if (args.description) fd.append("description", args.description);
  if (args.images?.length) {
    args.images.slice(0, 2).forEach((img, i) => {
      fd.append("images", {
        uri: img.uri,
        name: img.fileName ?? `image${i}.jpg`,
        type: img.mimeType ?? "image/jpeg",
      } as any);
    });
  }
  return fd;
};

// ─── API ─────────────────────────────────────────────────────────────────────

export const assetApis = {
  /**
   * GET /asset
   * Query: AssetQueryModel
   */
  getList: async (
    params?: AssetQueryModel,
  ): Promise<TableResponse<AssetModel>> => {
    const res = await httpClient.get<TableResponse<AssetModel>>("/asset", {
      params,
    });
    return res.data;
  },

  /**
   * GET /asset/:id
   */
  getById: async (id: string): Promise<AssetModel> => {
    const res = await httpClient.get<AssetModel>(`/asset/${id}`);
    return res.data;
  },

  /**
   * POST /asset  — multipart/form-data
   * Field: images (max 2 files, field name "images")
   * Dùng fetch native vì axios override Content-Type của FormData
   */
  create: async (args: CreateAssetModel): Promise<AssetModel> => {
    return fetchMultipart<AssetModel>("/asset", buildFormData(args));
  },

  /**
   * PATCH /asset/:id  — JSON body
   */
  update: async (id: string, args: UpdateAssetModel): Promise<AssetModel> => {
    const res = await httpClient.patch<AssetModel>(`/asset/${id}`, args);
    return res.data;
  },

  /**
   * DELETE /asset/:id  — soft delete (active = false)
   */
  remove: async (id: string): Promise<{ message: string }> => {
    const res = await httpClient.delete<{ message: string }>(`/asset/${id}`);
    return res.data;
  },

  /**
   * POST /asset/:id/images  — multipart/form-data, field "images", max 2
   */
  addImages: async ({
    id,
    images,
  }: AddAssetImageModel): Promise<AssetModel> => {
    const fd = new FormData();
    images.slice(0, 2).forEach((img, i) => {
      fd.append("images", {
        uri: img.uri,
        name: img.fileName ?? `image${i}.jpg`,
        type: img.mimeType ?? "image/jpeg",
      } as any);
    });
    return fetchMultipart<AssetModel>(`/asset/${id}/images`, fd);
  },

  /**
   * DELETE /asset/:id/images/:imgIndex
   * imgIndex: vị trí (0-based) của ảnh trong mảng imageUrls
   */
  removeImage: async (id: string, imgIndex: number): Promise<AssetModel> => {
    const res = await httpClient.delete<AssetModel>(
      `/asset/${id}/images/${imgIndex}`,
    );
    return res.data;
  },

  /**
   * POST /asset/:id/items  — JSON body (tạo asset items hàng loạt)
   */
  createItems: async (
    id: string,
    args: CreateAssetItemModel,
  ): Promise<unknown> => {
    const res = await httpClient.post(`/asset/${id}/items`, args);
    return res.data;
  },
};
