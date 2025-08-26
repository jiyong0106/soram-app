import { ConnectionStatus, metaType, UserType } from "./common";

export type UserStatus = "ACTIVE"; // 필요시 케이스 추가

export interface ChatParticipant extends UserType {
  status: UserStatus;
}

// 1. 채팅 목록 조회 api타입
export interface ChatItemType {
  id: number;
  requesterId: number;
  addresseeId: number;
  status: ConnectionStatus;
  voiceResponseId: number;
  createdAt: string;
  updatedAt: string;
  opponent: UserType;
  isBlocked: boolean;
}
export interface GetChatResponse {
  data: ChatItemType[];
  meta: metaType;
}

// 2. 채팅 메세지 조회 api타입
export interface ChatMessageType {
  id: number;
  connectionId: number;
  senderId: number;
  content: string;
  createdAt: string; // 서버 include 결과에 맞춰 필요시 수정
  sender?: UserType;
  isRead: boolean;
}

export interface ChatMessageResponse {
  data: ChatMessageType[];
  meta: metaType;
}

//3.유저 차단하는 api 응답값 타입
export interface UserBlockResponse {
  id: number;
  //차단당한 유저
  blockedId: number;
  //차단한 내id
  blockerId: number;
  createdAt: string;
}
