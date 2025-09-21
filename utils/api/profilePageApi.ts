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

// 사용자 차단 해제
export const deleteUserBlock = async (userId: number) => {
  // DELETE /blocks/{userId}
  const { data } = await instance.delete(`/blocks/${userId}`);
  return data;
};
