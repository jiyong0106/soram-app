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
} // ✅ 목록 응답

// 2. 채팅 메세지 조회 api타입
export type ChatMessage = {
  id: number;
  connectionId: number;
  senderId: number;
  content: string;
  createdAt: string; // 서버 include 결과에 맞춰 필요시 수정
  sender?: UserType;
  isRead: boolean;
};
