//로그아웃

import {
  BlockedListResponse,
  DeleteAccountBody,
  DeleteAccountResponse,
  LogoutResponse,
  GetMyVoiceResponsesResponse,
  GetMyVoiceResponseDetailResponse,
} from "../types/profile";
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

//계정삭제
export const deleteAccount = async (body: DeleteAccountBody) => {
  const { data } = await instance.delete<DeleteAccountResponse>("/users/me", {
    data: body,
  });
  return data;
};

// 내가 남긴 이야기 보기
interface MyVoiceResponsesParams {
  take?: number;
  cursor?: number | undefined;
}

export const getMyVoiceResponses = async ({
  take = 10, // 기본값 10으로 설정
  cursor,
}: MyVoiceResponsesParams = {}) => {
  const params: Record<string, any> = { take };
  if (cursor) {
    params.cursor = cursor;
  }

  const { data } = await instance.get<GetMyVoiceResponsesResponse>(
    "/users/me/voices",
    { params }
  );

  return data;
};

/**
 * 내가 남긴 이야기 상세 조회
 * @param voiceId - 조회할 답변의 ID
 */
export const getMyVoiceResponseDetail = async (voiceId: number) => {
  const { data } = await instance.get<GetMyVoiceResponseDetailResponse[]>(
    `/voices/${voiceId}/me`
  );
  return data[0];
};
