import {
  GetMyVoiceResponseDetailResponse,
  GetMyVoiceResponsesResponse,
  GetUnlockedSummaryByUserResponse,
  GetUnlockedSummaryByTopicResponse,
} from "../types/activity";
import instance from "./axios";

// '내가 남긴 이야기' 상세 조회 API 함수
/**
 * 내가 남긴 이야기 상세 조회 (from profilePageApi.ts)
 * @param voiceId - 조회할 답변의 ID
 */
export const getMyVoiceResponseDetail = async (voiceId: number) => {
  // 백엔드 API 명세에 따라 응답이 배열로 올 수 있으므로, 첫 번째 요소를 반환
  const { data } = await instance.get<GetMyVoiceResponseDetailResponse[]>(
    `/voices/${voiceId}/me`
  );
  return data[0];
};

// --- '지난 이야기' 관련 API ---

//  API 함수에 필요한 파라미터 타입을 여기서 직접 정의합니다.
interface UnlockedSummaryParams {
  groupBy: "user" | "topic";
  page?: number;
  limit?: number;
}

/**
 * 내가 잠금 해제한 답변 요약 목록 조회 (지난 이야기)
 */
export const getUnlockedResponsesSummary = async (
  params: UnlockedSummaryParams
) => {
  const { data } = await instance.get("/users/me/unlocked-responses/summary", {
    params,
  });

  // groupBy 값에 따라 반환 값의 타입을 다르게 지정 (타입 안정성)
  if (params.groupBy === "user") {
    return data as GetUnlockedSummaryByUserResponse;
  } else {
    return data as GetUnlockedSummaryByTopicResponse;
  }
};

// API 함수에 필요한 파라미터 타입
interface UnlockedResponsesByUserParams {
  authorId: number;
  take?: number;
  cursor?: number;
}

/**
 * [사용자별] 특정 사용자의 잠금 해제된 답변 목록 조회
 */
export const getUnlockedResponsesByUser = async ({
  authorId,
  take = 10,
  cursor,
}: UnlockedResponsesByUserParams) => {
  const params: Record<string, any> = { take };
  if (cursor) {
    params.cursor = cursor;
  }
  // GET /users/:authorId/unlocked-responses
  const { data } = await instance.get<GetMyVoiceResponsesResponse>(
    `/users/${authorId}/unlocked-responses`,
    { params }
  );
  return data;
};

// API 함수에 필요한 파라미터 타입
interface UnlockedResponsesByTopicParams {
  topicId: number;
  take?: number;
  cursor?: number;
}

/**
 * [주제별] 특정 주제의 잠금 해제된 답변 목록 조회
 */
export const getUnlockedResponsesByTopic = async ({
  topicId,
  take = 10,
  cursor,
}: UnlockedResponsesByTopicParams) => {
  const params: Record<string, any> = { take };
  if (cursor) {
    params.cursor = cursor;
  }
  // GET /users/me/unlocked-responses/by-topic/:topicId
  const { data } = await instance.get<GetMyVoiceResponsesResponse>(
    `/users/me/unlocked-responses/by-topic/${topicId}`,
    { params }
  );
  return data;
};
