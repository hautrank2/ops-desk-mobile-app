import { httpClient } from "@/lib/httpClient";
import { AssetModel, CreateAssetPayload, UpdateAssetPayload } from "@/types";

export const assetService = {
  get: async () => {
    const response = await httpClient.get<AssetModel[]>("/assets");
    return response.data;
  },
  getById: async (id: string) => {
    const response = await httpClient.get<AssetModel>(`/asset/${id}`);
    return response.data;
  },
  create: async (data: CreateAssetPayload) => {
    const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/asset`;
    console.log("API URL:", apiUrl);

    const payload = {
      code: data.code,
      name: data.name,
      type: data.type,
      vendor: data.vendor || undefined,
      model: data.model || undefined,
      purchaseUrl: data.purchaseUrl || undefined,
      description: data.description || undefined,
    };
    const formData = new FormData();
    formData.append("code", payload.code);
    formData.append("name", payload.name);
    formData.append("type", payload.type);
    if (payload.vendor) formData.append("vendor", payload.vendor);
    if (payload.model) formData.append("model", payload.model);
    if (payload.purchaseUrl)
      formData.append("purchaseUrl", payload.purchaseUrl);
    if (payload.description)
      formData.append("description", payload.description);

    if (data.images) {
      data.images.forEach((image, index) => {
        formData.append("images", {
          uri: image.uri,
          name: `image${index}.jpg`,
          type: "image/jpeg",
        } as any);
      });
    }

    console.log("Payload:", JSON.stringify(payload));

    try {
      const response = await httpClient.post<AssetModel>("/asset", payload);
      return response.data;
    } catch (error: any) {
      console.error("Create asset error:", error.message || error);
      throw error;
    }
  },
  update: async (id: string, data: UpdateAssetPayload) => {
    const response = await httpClient.put<AssetModel>(`/asset/${id}`, data);
    return response.data;
  },
};
