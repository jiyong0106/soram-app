import instance from "./axios";
import { PageDto, NotificationListItem, NotificationType } from "../types/auth";

// 알림 API 응답 타입 (auth.ts의 PageDto 재사용)
export type GetNotificationsResponse = PageDto<NotificationListItem>;

// 알림 API 요청 파라미터 타입 (필터링 기능 추가)
interface GetNotificationsParams {
  take?: number;
  cursor?: number;
  type?: NotificationType;
  isRead?: boolean;
}

/**
 * 알림 목록 조회 API
 */
export const getNotifications = async ({
  take = 10,
  cursor,
  type,
  isRead,
}: GetNotificationsParams = {}) => {
  const params: Record<string, any> = { take };
  if (cursor) params.cursor = cursor;
  if (type) params.type = type;
  if (typeof isRead === "boolean") params.isRead = isRead;

  const { data } = await instance.get<GetNotificationsResponse>(
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
