import { LOCAL_KEYS } from "@/constants/local";
import { httpClient } from "@/lib/httpClient";
import {
  AddTicketImageModel,
  AssetItemModel,
  CreateTicketModel,
  TableResponse,
  TicketModel,
  TicketQueryModel,
  UpdateTicketModel,
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

// ─── API ─────────────────────────────────────────────────────────────────────

export const ticketApis = {
  /**
   * GET /ticket
   * Query: TicketQueryModel
   */
  getList: async (
    params?: TicketQueryModel,
  ): Promise<TableResponse<TicketModel>> => {
    const res = await httpClient.get<TableResponse<TicketModel>>("/ticket", {
      params,
    });
    return res.data;
  },

  /**
   * GET /ticket/:id
   */
  getById: async (id: string): Promise<TicketModel> => {
    const res = await httpClient.get<TicketModel>(`/ticket/${id}`);
    return res.data;
  },

  /**
   * POST /ticket  — multipart/form-data
   * Field "images" (max 2 files), rest as JSON-like form fields
   * NOTE: assetItemIds phải append từng item (server dùng @IsArray)
   */
  create: async (args: CreateTicketModel): Promise<TicketModel> => {
    const fd = new FormData();
    fd.append("code", args.code);
    fd.append("title", args.title);
    fd.append("type", args.type);
    args.assetItemIds.forEach((id) => fd.append("assetItemIds", id));
    if (args.description) fd.append("description", args.description);
    if (args.priority) fd.append("priority", args.priority);
    if (args.status) fd.append("status", args.status);
    if (args.cause) fd.append("cause", args.cause);
    if (args.note) fd.append("note", args.note);
    if (args.locationId) fd.append("locationId", args.locationId);
    if (args.assigneeId) fd.append("assigneeId", args.assigneeId);
    if (args.teamId) fd.append("teamId", args.teamId);
    if (args.dueAt) fd.append("dueAt", args.dueAt);
    if (args.closedAt) fd.append("closedAt", args.closedAt);
    if (args.images?.length) {
      args.images.slice(0, 2).forEach((img, i) => {
        fd.append("images", {
          uri: img.uri,
          name: img.fileName ?? `image${i}.jpg`,
          type: img.mimeType ?? "image/jpeg",
        } as any);
      });
    }
    return fetchMultipart<TicketModel>("/ticket", fd);
  },

  /**
   * PATCH /ticket/:id  — JSON body
   */
  update: async (id: string, args: UpdateTicketModel): Promise<TicketModel> => {
    const res = await httpClient.patch<TicketModel>(`/ticket/${id}`, args);
    return res.data;
  },

  /**
   * POST /ticket/:id/images  — multipart/form-data, field "images", max 2
   */
  addImages: async ({
    id,
    images,
  }: AddTicketImageModel): Promise<TicketModel> => {
    const fd = new FormData();
    images.slice(0, 2).forEach((img, i) => {
      fd.append("images", {
        uri: img.uri,
        name: img.fileName ?? `image${i}.jpg`,
        type: img.mimeType ?? "image/jpeg",
      } as any);
    });
    return fetchMultipart<TicketModel>(`/ticket/${id}/images`, fd);
  },

  /**
   * DELETE /ticket/:id/images/:imgIndex
   * imgIndex: vị trí (0-based) của ảnh trong mảng images
   */
  removeImage: async (id: string, imgIndex: number): Promise<TicketModel> => {
    const res = await httpClient.delete<TicketModel>(
      `/ticket/${id}/images/${imgIndex}`,
    );
    return res.data;
  },

  /**
   * GET /ticket/:id/items
   */
  getItems: async (id: string): Promise<AssetItemModel[]> => {
    const res = await httpClient.get<AssetItemModel[]>(`/ticket/${id}/items`);
    return res.data;
  },

  /**
   * POST /ticket/:id/items
   */
  addItems: async (id: string, itemIds: string[]): Promise<any> => {
    const res = await httpClient.post<any>(`/ticket/${id}/items`, { itemIds });
    return res.data;
  },

  /**
   * POST /ticket/:id/remove-items
   */
  removeItems: async (id: string, itemIds: string[]): Promise<any> => {
    const res = await httpClient.post<any>(`/ticket/${id}/remove-items`, {
      itemIds,
    });
    return res.data;
  },
};
