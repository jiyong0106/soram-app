//로그아웃

import {
  BlockedListResponse,
  DeleteAccountBody,
  DeleteAccountResponse,
  LogoutResponse,
  GetMyVoiceResponsesResponse,
  UpdateTextResponsePayload,
  MyProfileResponse,
  UserProfilePublicResponse,
} from "../types/profile";
import instance from "./axios";
import { TextResponse } from "../types/topic";

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
 * 내 텍스트 답변 수정 API
 * @param responseId - 수정할 답변의 ID
 * @param textContent - 새로운 답변 내용
 */
export const updateTextResponse = async ({
  responseId,
  textContent,
}: UpdateTextResponsePayload) => {
  // 백엔드 API 명세에 따라 PATCH 메서드를 사용하고,
  // URL에는 responseId를, body에는 textContent를 전달합니다.
  const { data } = await instance.patch<TextResponse>(`/voices/${responseId}`, {
    textContent,
  });

  return data;
};

//내 프로필 조회
export const getMyProfile = async () => {
  const { data } = await instance.get<MyProfileResponse>("/users/me/profile");
  return data;
};

//상대 프로필 조회
export const getUserProfile = async (userId: number) => {
  const { data } = await instance.get<UserProfilePublicResponse>(
    `/users/${userId}/profile`
  );
  return data;
};
