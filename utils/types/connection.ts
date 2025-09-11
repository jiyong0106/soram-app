import { ConnectionStatus, metaType, UserType } from "./common";

/** 공통 필드 */
interface ConnectionBase {
  id: number;
  requesterId: number;
  addresseeId: number;
  voiceResponseId: number;
  createdAt: string;
  updatedAt: string;
}

//받은 대화 요청 목록 조회 api타입
export interface GetConnectionsType extends ConnectionBase {
  status: ConnectionStatus;
  requester: UserType;
}

export interface GetConnectionsResponse {
  data: GetConnectionsType[];
  meta: metaType;
}

//대화 요청 수락 타입
export interface PostConnectionsAcceptResponse extends ConnectionBase {
  status: "ACCEPTED";
  requester: UserType;
  addressee: UserType;
}

//대화 요청 거절 타입
export interface PostConnectionsRejectResponse extends ConnectionBase {
  status: "REJECTED";
}

//보낸 대화 요청 목록 조회 api타입
export interface GetSentConnectionsType extends ConnectionBase {
  status: ConnectionStatus;
  addressee: UserType;
}
export interface GetSentConnectionsResponse {
  data: GetSentConnectionsType[];
  meta: metaType;
}

// 보낸 대화 요청 취소 API타입
export interface PostConnectionsCancelResponse extends ConnectionBase {
  status: "CANCELED";
}
