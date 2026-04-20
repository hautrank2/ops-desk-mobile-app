import { parseJsonObject } from "~/utils/json";
import { AppUser } from "./type";
import { LOCAL_USER } from "~/constants/local";

export const getInitUser = (): AppUser | null => {
  const user = parseJsonObject(localStorage.getItem(LOCAL_USER), {});

  return Object.keys(user).length > 0 ? (user as AppUser) : null;
};
