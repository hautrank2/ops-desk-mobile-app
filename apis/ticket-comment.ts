import { LOCAL_KEYS } from "@/constants/local";
import {
  CreateTicketCommentModel,
  TicketCommentModel,
  UpdateTicketCommentImagesModel,
  UpdateTicketCommentModel,
} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { httpClient } from "@/lib/httpClient";

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

export const ticketCommentApis = {
  /**
   * GET /ticket-comment?ticketId={ticketId}
   */
  getList: async (ticketId: string): Promise<TicketCommentModel[]> => {
    const res = await httpClient.get<TicketCommentModel[]>("/ticket-comment", {
      params: { ticketId },
    });
    return res.data;
  },

  /**
   * POST /ticket-comment — multipart/form-data
   */
  create: async (args: CreateTicketCommentModel): Promise<TicketCommentModel> => {
    const fd = new FormData();
    fd.append("ticketId", args.ticketId);
    fd.append("content", args.content);
    if (args.parentId) fd.append("parentId", args.parentId);

    if (args.images?.length) {
      args.images.forEach((img, i) => {
        fd.append("images", {
          uri: img.uri,
          name: img.fileName ?? `image${i}.jpg`,
          type: img.mimeType ?? "image/jpeg",
        } as any);
      });
    }
    return fetchMultipart<TicketCommentModel>("/ticket-comment", fd, "POST");
  },

  /**
   * PATCH /ticket-comment/:id — JSON body
   */
  update: async (
    id: string,
    args: UpdateTicketCommentModel,
  ): Promise<TicketCommentModel> => {
    const res = await httpClient.patch<TicketCommentModel>(
      `/ticket-comment/${id}`,
      args,
    );
    return res.data;
  },

  /**
   * PUT /ticket-comment/:id/images — multipart/form-data
   */
  updateImages: async (
    id: string,
    args: UpdateTicketCommentImagesModel,
  ): Promise<TicketCommentModel> => {
    const fd = new FormData();
    args.keepUrls?.forEach((url) => fd.append("keepUrls", url));

    if (args.images?.length) {
      args.images.forEach((img, i) => {
        fd.append("images", {
          uri: img.uri,
          name: img.fileName ?? `image${i}.jpg`,
          type: img.mimeType ?? "image/jpeg",
        } as any);
      });
    }
    return fetchMultipart<TicketCommentModel>(
      `/ticket-comment/${id}/images`,
      fd,
      "PUT",
    );
  },

  /**
   * DELETE /ticket-comment/:id
   */
  remove: async (id: string): Promise<any> => {
    const res = await httpClient.delete<any>(`/ticket-comment/${id}`);
    return res.data;
  },
};
