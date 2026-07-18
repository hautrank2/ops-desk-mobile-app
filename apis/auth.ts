import { httpClient } from "@/lib/httpClient";
import { SigninModel, SigninResponseModel } from "@/types";

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
};
