import { LoginResult } from "@/components/auth/LoginForm";
import { LOCAL_KEYS } from "@/constants/local";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  payload: AuthPayload | null;
  onAuthticate: (token: AuthPayload) => Promise<void>;
  onLogout: () => void;
  token: string | null;
};

export type AuthPayload = LoginResult;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AUTH_PAYLOAD_LOCAL = LOCAL_KEYS.TOKEN;

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [payload, setPayload] = useState<AuthPayload | null>(null);

  const token: string | null = useMemo(() => payload?.token ?? null, [payload]);

  const onAuthticate = useCallback(async (payload: AuthPayload) => {
    setPayload(payload);
    await AsyncStorage.setItem(AUTH_PAYLOAD_LOCAL, JSON.stringify(payload));
  }, []);

  const onLogout = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_PAYLOAD_LOCAL);
    setPayload(null);
  }, []);

  const fetchAuthLocal = async () => {
    try {
      const res = await AsyncStorage.getItem(AUTH_PAYLOAD_LOCAL);
      if (typeof res !== "string") return;
      const result = JSON.parse(res) as AuthPayload;
      setPayload(result);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAuthLocal();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated: !!payload,
      payload,
      onAuthticate,
      onLogout,
      token,
    }),
    [onAuthticate, onLogout, payload, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthCtx = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }

  return context;
};
