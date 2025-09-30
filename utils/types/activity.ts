// app/utils/types/activity.ts
import {
  metaType as baseMetaType,
  OffsetMetaType,
  ConnectionStatus,
} from "./common";

export interface metaType extends baseMetaType {
  connectionStatus?: ConnectionStatus | null;
}

// --- '내가 남긴 이야기' 관련 타입 ---
export interface MyVoiceResponseItem {
  id: number;
  createdAt: string;
  textContent: string | null;
  audioUrl: string | null;
  playtime: number | null;
  topic: {
    title: string;
    category: string;
  };
  user?: {
    id: number;
    nickname: string;
  };
  connectionStatus?: ConnectionStatus | null;
}

export interface GetMyVoiceResponsesResponse {
  data: MyVoiceResponseItem[];
  meta: metaType; // 수정된 metaType 적용
}

// --- '지난 이야기' (잠금 해제한 답변 요약) 관련 타입 ---

// 사용자별 요약 아이템
export interface UnlockedSummaryByUserItem {
  id: number;
  nickname: string;
  unlockedResponsesCount: number;
}

// 주제별 요약 아이템
export interface UnlockedSummaryByTopicItem {
  id: number;
  title: string;
  category: string;
  unlockedResponsesCount: number;
}

// 사용자별 요약 응답
export interface GetUnlockedSummaryByUserResponse {
  data: UnlockedSummaryByUserItem[];
  meta: OffsetMetaType;
}

// 주제별 요약 응답
export interface GetUnlockedSummaryByTopicResponse {
  data: UnlockedSummaryByTopicItem[];
  meta: OffsetMetaType;
}

export interface GetMyVoiceResponseDetailResponse {
  id: number;
  textContent: string;
  updatedAt: string;
  topicBox: {
    id: number;
    title: string;
    category: string;
  };
}
