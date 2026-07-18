import { LOCAL_KEYS } from "@/constants/local";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const getBaseUrl = () => {
  return `${BASE_URL}`;
};

export const httpClient = axios.create({
  baseURL: getBaseUrl(),
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
  if (token) {
    try {
      const parsedToken = typeof token === "string" ? JSON.parse(token) : token;
      const jwtToken =
        parsedToken.token || (typeof token === "string" ? token : "");
      if (jwtToken) {
        config.headers.Authorization = `Bearer ${jwtToken}`;
      }
    } catch {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});
