import { ConnectionStatus, UserType } from "./common";

//대화 요청 목록 api타입
export interface GetConnectionsResponse {
  id: number;
  requesterId: number;
  addresseeId: number;
  status: ConnectionStatus;
  voiceResponseId: number;
  createdAt: string;
  updatedAt: string;
  requester: UserType;
}

//대화 요청 수락 타입

//대화 요청 거절 타입
  