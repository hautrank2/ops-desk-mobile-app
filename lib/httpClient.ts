import { LOCAL_KEYS } from "@/constants/local";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const getBaseUrl = () => {
  return `${BASE_URL}/api`;
};

export const httpClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => {
    const parts: string[] = [];
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        value.forEach((v) =>
          parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`),
        );
      } else {
        parts.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`,
        );
      }
    }
    return parts.join("&");
  },
});

httpClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(LOCAL_KEYS.TOKEN);
  if (typeof window !== "undefined") {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
