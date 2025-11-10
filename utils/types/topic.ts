import { metaType, UserType, ConnectionStatus } from "./common";

// 공통 토픽 타입
export interface baseTopic {
  id: number;
  userId: number;
  topicBoxId: number;
  type: "TEXT" | "VOICE";
  textContent: string;
  audioUrl: string | null;
  playtime: number | null;
  createdAt: string;
  updatedAt: string;
}

// 1. 주제함 목록 조회 api 타입 및 랜덤 주제 보여주기 api 타입
export interface TopicListType {
  id: number;
  title: string;
  subQuestions: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
  userCount: number;
  myAnswerId: number | null;
}

export interface GetTopicListResponse {
  data: TopicListType[];
  meta: metaType;
}

// 2. 랜덤 주제에대한 답변 보여주기 api타입

export interface UserAnswerResponse extends baseTopic {
  user: UserType;
}

// 3-1. 대화 요청에 들어가는 바디값값

export interface RequestConnectionBody {
  addresseeId: number;
  voiceResponseId: number;
}

// 3-2 대화 요청 후 나오는 응답값
export interface RequestConnectionResponse {
  id: number;
  requesterId: number;
  addresseeId: number;
  status: ConnectionStatus;
  voiceResponseId: number;
  createdAt: string;
  updatedAt: string;
}

//4 -1 . 다양한 토픽에 대해 내 답변 등록하기 api 타입 바디값
export interface TextBody {
  topicId: number;
  textContent: string;
}
//4 - 2 . 다양한 토픽에 대해 내 답변 등록하기 api 타입 응답값
export interface TextResponse extends baseTopic {}

//5 답변 등록하기에 조회되는 타이틀 및 sub api타입
export interface TextHeaderType {
  title: string;
  subQuestions: string[];
}

//토픽 리스트 카테고리 타입들
export const CATEGORIES = [
  "전체",
  "가치관 및 생각",
  "경험 및 성장",
  "관계 및 사랑",
  "일과 커리어",
  "문화 및 취향",
  "여행 및 장소",
  "추억 및 일상",
  "꿈과 미래",
  "취미 및 여가",
  "만약...",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type RouteType = { key: Category; label: string };

//컨텐츠 숨기기 api 타입 바디값
export interface HiddenContentBody {
  entityId: string;
  entityType: "VOICE_RESPONSE";
}

//컨텐츠 숨기기 api 타입 응답값
export interface HiddenContentResponse {
  id: number;
  userId: number;
  entityType: "VOICE_RESPONSE";
  entityId: string;
  createdAt: string;
}
