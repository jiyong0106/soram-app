import { metaType } from "./common";

// 주제함 목록 조회 api
export interface AnswerRecommend {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}
export interface GetAnswerRecommendResponse {
  data: AnswerRecommend[];
  meta: metaType;
}
