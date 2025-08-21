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
