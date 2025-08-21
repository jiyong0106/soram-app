import { metaType, UserType } from "./common";

// 주제함 목록 조회 api 타입 및 랜덤 주제 보여주기 api 타입
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

//랜덤 주제에대한 답변 보여주기 api타입

export type AnswerRandom = {
  id: number;
  userId: number;
  topicBoxId: number;
  type: "TEXT" | "voice";
  textContent: string;
  audioUrl: string;
  playtime: any;
  createdAt: string;
  updatedAt: string;
  user: UserType;
};
