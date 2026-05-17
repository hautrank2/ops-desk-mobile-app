import { LOCAL_KEYS } from "@/constants/local";
import { httpClient } from "@/lib/httpClient";
import { AssetModel, CreateAssetPayload, UpdateAssetPayload } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    const token = await AsyncStorage.getItem(LOCAL_KEYS.TOKEN);
    let jwtToken = token;
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        jwtToken = parsedToken.token || token;
      } catch {
        jwtToken = token;
      }
    }

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

    console.log("Payload:", JSON.stringify(payload));

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwtToken ? `Bearer ${jwtToken}` : "",
        },
        body: JSON.stringify(payload),
      });

      console.log("Fetch response status:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload error:", response.status, errorText);
        throw new Error(
          errorText || `Upload failed: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("Upload success:", result);
      return result;
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
