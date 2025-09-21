//로그아웃

import { BlockedListResponse, LogoutResponse } from "../types/profile";
import instance from "./axios";

export const postLogout = async () => {
  const { data } = await instance.post<LogoutResponse>("/auth/logout");
  return data;
};

//차단목록 조회 (무한스크롤용)
interface BlockListParams {
  take?: number;
  cursor?: number | undefined;
}
export const getBlockedList = async ({
  take,
  cursor,
}: BlockListParams = {}) => {
  const params: Record<string, any> = {};
  if (typeof take === "number") params.take = take;
  if (typeof cursor === "number") params.cursor = cursor;
  const { data } = await instance.get<BlockedListResponse>("/blocks", {
    params,
  });
  return data;
};

// 사용자 차단 해제
export const deleteUserBlock = async (userId: number) => {
  // DELETE /blocks/{userId}
  const { data } = await instance.delete(`/blocks/${userId}`);
  return data;
};
