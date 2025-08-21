import instance from "./axios";
import {
  GetAnswerRecommendResponse,
  AnswerRecommend,
  AnswerRandom,
  RequestConnectionBody,
  RequestConnectionResponse,
} from "../types/topic";

// 1. 주제 목록 리스트 api
interface GetAnswerRecommendParams {
  take: number;
  search?: string;
  cursor?: any;
}

export const getAnswerRecommend = async ({
  take,
  search,
  cursor,
}: GetAnswerRecommendParams) => {
  const params: Record<string, any> = {};
  if (take) params.take = take;
  if (cursor !== undefined) params.cursor = cursor;
  if (search) params.search = search;
  const { data } = await instance.get<GetAnswerRecommendResponse>("/topics", {
    params,
  });
  return data;
};

// 2. 랜덤 주제 보여조기 api
export const getTopicRandom = async () => {
  const { data } = await instance.get<AnswerRecommend>("/topics/random");
  return data;
};

// 3. 랜덤 주제에대한 답변 보여주기 api
export const getAnswerRandom = async ({ topicId }: { topicId: string }) => {
  const { data } = await instance.get<AnswerRandom[]>(`/voices/${topicId}`);
  return data;
};

// 1. 다른 사람한테 대화 요청하기
export const postRequestConnection = async (body: RequestConnectionBody) => {
  const { data } = await instance.post<RequestConnectionResponse>(
    "/connections/request",
    body
  );
  return data;
};
