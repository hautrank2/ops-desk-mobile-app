import { AiEngineInforBell, AiEngineInforType } from "~/types/ai-engine";
import { RoleModel } from "~/types/auth";

export type AppTheme = "light" | "dark" | "system" | "blueDark";
export const APP_THEMES: AppTheme[] = ["system", "light", "dark", "blueDark"];
export type AppFont =
  | "Roboto"
  | "Lexend"
  | "Inter"
  | "Open Sans"
  | "Quicksand"
  | "Manrope"
  | "Nunito"
  | "Fira";

export type AppAiEngineResposne = {
  id: string;
  name: AiEngineInforType;
  has_clip: boolean;
  tags: (string | null)[];
  data: {
    level: 0 | 1 | 2;
    bell: AiEngineInforBell;
    isAlert?: boolean;
    isAbnormal?: boolean;
    type: string;
  };
};

export type AppUser = {
  user_id: string;
  username: string;
  token: string;
};

export type AppUserDataModel = {
  id: string;
  fullname: string;
  email: string;
  is_active: boolean;
  role: RoleModel;
  roleLevel: number; // From 1 to 3
  last_access?: string;
};
