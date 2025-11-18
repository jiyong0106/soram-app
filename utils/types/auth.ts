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
  pushToken?: string;
}
//1-2 핸드폰 인증번호 전송 응답값
export interface VerifyOtpResponse {
  refreshToken: string;
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

// ---------------- 알림(Notifications) 타입 ----------------

export type NotificationType =
  | "NEW_CONNECTION_REQUEST"
  | "CONNECTION_ACCEPTED"
  | "NEW_CHAT_MESSAGE"
  | "NEW_TOPIC_BOX";

export interface NotificationListItem {
  id: number; // 알림 ID
  title: string; // 제목
  body: string; // 본문
  isRead: boolean; // 읽음 여부
  type: NotificationType; // 알림 타입
  referenceId: string; // 관련 리소스 식별자
  createdAt: string; // ISO 문자열
}

export interface PageMeta {
  take: number;
  totalCount: number;
  endCursor: number | null;
  hasNextPage: boolean;
}

export interface PageDto<T> {
  data: T[];
  meta: PageMeta;
}
