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

//대화 요청 목록 조회 api타입
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
