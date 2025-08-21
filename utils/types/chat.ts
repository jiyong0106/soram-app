// 1-1 대화 요청에 들어가는 바디값값
// addresseeId => 요청받는사람
// voiceResponseId =>  답변 id?

import { ConnectionStatus } from "./common";

export interface RequestConnectionBody {
  addresseeId: number;
  voiceResponseId: number;
}

// 1-2 대화 요청 후 나오는 응답값
export interface RequestConnectionResponse {
  id: number;
  requesterId: number;
  addresseeId: number;
  status: ConnectionStatus;
  voiceResponseId: number;
  createdAt: string;
  updatedAt: string;
}
