// 무한스크롤 meta타입
export type metaType = {
  take: number;
  totalCount: number;
  endCursor: number;
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
