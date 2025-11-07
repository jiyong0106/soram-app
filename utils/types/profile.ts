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
}

export interface GetMyVoiceResponsesResponse {
  data: MyVoiceResponseItem[];
  meta: metaType;
}

// 답변 수정을 위한 요청(Payload) 타입
export interface UpdateTextResponsePayload {
  responseId: number; // 수정할 답변의 고유 ID
  textContent: string; // 새로 수정할 내용
}

//내 프로필 조회

// --- 프로필 조회 공통 타입 ---
export interface ProfileInterest {
  id: number;
  name: string;
}

export interface ProfileAnswerView {
  questionId: number;
  questionContent: string;
  content: string;
  isPrimary: boolean;
}

// 내 프로필 응답 타입 (stats/connectionStatus 제외)
export interface MyProfileResponse {
  id: number;
  nickname: string;
  gender: Gender;
  birthdate: string;
  location?: string | null;
  interests: ProfileInterest[];
  answers: ProfileAnswerView[];
}

// 타 사용자 프로필 응답 타입 (connectionStatus 포함)
export type ConnectionStatus = "PENDING" | "ACCEPTED";

export interface UserProfilePublicResponse extends MyProfileResponse {
  connectionStatus: ConnectionStatus | null;
}

//상대 프로필 조회
