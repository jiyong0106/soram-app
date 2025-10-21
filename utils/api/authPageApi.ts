import instance from "./axios";
import api from "./axios";
import {
  getTicketsResponse,
  RequestOtpBody,
  RequestOtpResponse,
  VerifyOtpBody,
  VerifyOtpResponse,
  NotificationListItem,
  NotificationType,
  PageDto,
} from "@/utils/types/auth";
import { Interest } from "../types/signup";

// 1. 핸드폰 인증번호 요청

export const postRequestOtp = async (body: RequestOtpBody) => {
  const { data } = await api.post<RequestOtpResponse>(
    "/auth/phone/request-otp",
    body
  );
  return data;
};

// 2.인증번호 서버로 전송
export const postVerifyOtp = async (body: VerifyOtpBody) => {
  const { data } = await api.post<VerifyOtpResponse>(
    "/auth/phone/verify-otp",
    body
  );
  return data;
};

//3. 생년월일 입력

// 4. 내 보유 재화 갯수 확인
export const getTickets = async () => {
  const { data } = await instance.get<getTicketsResponse>("/users/me/tickets");
  return data;
};

// 전체 관심사 목록 조회 API
export const getInterests = async () => {
  const { data } = await instance.get<Interest[]>("/auth/interests");
  return data;
};

// ---------------- 알림(Notifications) API ----------------

export interface GetNotificationsParams {
  take: number;
  cursor?: number;
  type?: NotificationType;
  isRead?: boolean;
}

export const getNotifications = async ({
  take,
  cursor,
  type,
  isRead,
}: GetNotificationsParams) => {
  const params: Record<string, any> = { take };
  if (cursor !== undefined) params.cursor = cursor;
  if (type) params.type = type;
  if (typeof isRead === "boolean") params.isRead = isRead;
  const { data } = await instance.get<PageDto<NotificationListItem>>(
    "/notifications",
    { params }
  );
  return data;
};

export const patchNotificationRead = async (id: number) => {
  const { data } = await instance.patch<{ message: string }>(
    `/notifications/${id}/read`
  );
  return data;
};

export const patchNotificationsReadAll = async () => {
  const { data } = await instance.patch<{ message: string }>(
    "/notifications/read-all"
  );
  return data;
};
