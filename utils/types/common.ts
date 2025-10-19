// 무한스크롤 meta타입
export type metaType = {
  take: number;
  totalCount: number;
  endCursor: number;
  hasNextPage: boolean;
};

// 오프셋 기반 페이지네이션 meta타입
export type OffsetMetaType = {
  page: number;
  limit: number;
  total: number;
  lastPage: number;
  hasNextPage: boolean;
};

//유저 타입
export interface UserType {
  id: number;
  nickname: string;
}

//status타입
export const CONNECTION_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  CANCELED: "CANCELED",
} as const;

export type ConnectionStatus =
  (typeof CONNECTION_STATUS)[keyof typeof CONNECTION_STATUS];

//리포트 이유 리터럴 타입
export type ReportReasonType =
  | "SPAM_ADVERTISING"
  | "INAPPROPRIATE_CONTENT"
  | "ABUSE_HARASSMENT"
  | "IMPERSONATION"
  | "OTHER";

//리포트 이유 카테고리 타입
export type ReportCategoryType =
  | "USER_PROFILE"
  | "VOICE_RESPONSE"
  | "CHAT_MESSAGE";

//리포트 스테이터스 타입
export type ReportStatusType = "PENDING" | "REVIEWING" | "RESOLVED";

// 리포트 이유 리터럴 타입 매핑
export const REASON_LABELS: Record<ReportReasonType, string> = {
  SPAM_ADVERTISING: "스팸/광고",
  INAPPROPRIATE_CONTENT: "부적절한 콘텐츠",
  ABUSE_HARASSMENT: "욕설/괴롭힘",
  IMPERSONATION: "사칭",
  OTHER: "기타",
};
