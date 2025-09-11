// 1-1 핸드폰 인증번호 요청 바디값
export interface RequestOtpBody {
  phoneNumber: string;
}

// 1-1핸드폰 인증번호 요청 응답값
export interface RequestOtpResponse {
  message: string;
}

// 1-2 핸드폰 인증번호 전송 바디값
export interface VerifyOtpBody {
  phoneNumber: string;
  otp: string;
}
//1-2 핸드폰 인증번호 전송 응답값
export interface VerifyOtpResponse {
  signupToken: string;
  accessToken: string;
}

// 2 재화 갯수 확인 타입
export type TicketSourceType = "DAILY" | "EVENT" | "PAID";
export type TicketKind = "CHAT" | "VIEW_RESPONSE";

// breakdown 한 항목
export interface TicketBreakdownItem {
  sourceType: TicketSourceType;
  quantity: number;
  expiresAt: string;
}

// 한 종류 티켓의 합계 + 내역
export interface TicketBundle {
  totalQuantity: number;
  breakdown: TicketBreakdownItem[];
}

// 응답 타입 (요구한 이름 그대로)
export interface getTicketsResponse {
  CHAT: TicketBundle;
  VIEW_RESPONSE: TicketBundle;
}
