//로그아웃

import { LogoutResponse } from "../types/profile";
import instance from "./axios";

export const postLogout = async () => {
  const { data } = await instance.post<LogoutResponse>("/auth/logout");
  return data;
};
