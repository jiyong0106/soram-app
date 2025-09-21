//로그아웃

import { BlockedListResponse, LogoutResponse } from "../types/profile";
import instance from "./axios";

export const postLogout = async () => {
  const { data } = await instance.post<LogoutResponse>("/auth/logout");
  return data;
};

//차단목록 조회
export const getBlockedList = async () => {
  const { data } = await instance.get<BlockedListResponse>("/blocks");
  return data;
};
