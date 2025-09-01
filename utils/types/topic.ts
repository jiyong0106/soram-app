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
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  userCount: number;
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
// addresseeId => 요청받는사람
// voiceResponseId =>  답변 id?

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

//4. 다양한 토픽에 대해 내 답벼 등록하기 api 타입 바디값
export interface TextBody {
  topicId: number;
  textContent: string;
}
//4. 다양한 토픽에 대해 내 답벼 등록하기 api 타입 응답값
export interface TextResponse extends baseTopic {}
