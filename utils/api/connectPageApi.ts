// utils/api/connectPageApi.ts
import instance from "./axios";
import { GetAnswerRecommendResponse } from "../types/connect";

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
