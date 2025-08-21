import { ConnectionStatus, UserType } from "./common";

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
  requester: ChatParticipant;
  addressee: ChatParticipant;
  isBlocked: boolean;
}
export type GetChatResponse = ChatItemType[]; // ✅ 목록 응답
