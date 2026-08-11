import { httpClient } from "@/lib/httpClient";
import { SigninModel, SigninResponseModel, UserModel } from "@/types";

// ─── API ─────────────────────────────────────────────────────────────────────

export const authApi = {
  /**
   * POST /auth/signin
   * Body: { username, password }
   * Response: { _id, username, role, token }
   */
  signin: async (args: SigninModel): Promise<SigninResponseModel> => {
    const res = await httpClient.post<SigninResponseModel>("/auth/signin", args);
    return res.data;
  },

  /**
   * GET /auth/valid-token
   * Header: Authorization: Bearer <token>
   * Response: { valid: true }
   */
  checkToken: async (): Promise<{ valid: boolean }> => {
    const res = await httpClient.get<{ valid: boolean }>("/auth/valid-token");
    return res.data;
  },

  /**
   * GET /auth/me
   * Header: Authorization: Bearer <token>
   * Response: full profile of the current user
   */
  me: async (): Promise<UserModel> => {
    const res = await httpClient.get<UserModel>("/auth/me");
    return res.data;
  },
};
