import instance from "./axios";
import {
  GetTopicListResponse,
  TopicListType,
  UserAnswerResponse,
  RequestConnectionBody,
  RequestConnectionResponse,
  TextBody,
  TextResponse,
  TextHeaderType,
} from "../types/topic";

// 1. 주제 목록 리스트 api
interface GetTopicListTypeParams {
  take: number;
  search?: string;
  cursor?: any;
}

export const getTopicList = async ({
  take,
  search,
  cursor,
}: GetTopicListTypeParams) => {
  const params: Record<string, any> = {};
  if (take) params.take = take;
  if (cursor !== undefined) params.cursor = cursor;
  if (search) params.search = search;
  const { data } = await instance.get<GetTopicListResponse>("/topics", {
    params,
  });
  return data;
};

// 2. 랜덤 주제 보여조기 api
export const getTopicRandom = async (excludeTopicId?: number) => {
  const { data } = await instance.get("/topics/random", {
    params: {
      // 최초엔 undefined로 보내서 파라미터 생략
      excludeTopicId: excludeTopicId ?? undefined,
    },
  });
  return data;
};

// 3. 랜덤 주제에대한 답변 보여주기 api
export const getUserAnswer = async ({ topicId }: { topicId: string }) => {
  const { data } = await instance.get<UserAnswerResponse[]>(
    `/voices/${topicId}`
  );
  return data;
};

// 4. 다른 사람한테 대화 요청하기
export const postRequestConnection = async (body: RequestConnectionBody) => {
  const { data } = await instance.post<RequestConnectionResponse>(
    "/connections/request",
    body
  );
  return data;
};

//5. 다양한 토픽에 대해 내 답변 등록하기 api
export const postText = async (body: TextBody) => {
  const { data } = await instance.post<TextResponse>("/voices/text", body);
  return data;
};

//6 답변 등록하기에 조회되는 타이틀 및 sub api타입
export const getTextHeader = async (topicBoxId: number) => {
  const { data } = await instance.get<TextHeaderType>(
    `/topics/${topicBoxId}/questions`
  );
  return data;
};
