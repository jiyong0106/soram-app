import { metaType, UserType } from "./common";

// 프로필 관련 타입 정의
export interface Answer {
  questionId: number;
  content: string;
  isPrimary?: boolean;
}

export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface ProfileType {
  nickname: string;
  gender: Gender;
  birthdate: string; // ISO string (YYYY-MM-DD)
  location: string;
  answers: Answer[];
}

//로그아웃
export interface LogoutResponse {
  message: string;
}

//차단목록 조회
export interface BlockedListType {
  blockedAt: string;
  user: UserType;
}

export interface BlockedListResponse {
  data: BlockedListType[];
  meta: metaType;
}

//차단 해제
export interface UnblockResponse {
  message: string;
}

//계정삭제
export interface DeleteAccountBody {
  reason: string;
}

export interface DeleteAccountResponse {
  message: string;
}
