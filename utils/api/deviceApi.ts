import { RegisterDeviceTokenBody } from "@/utils/types/device";
import api from "./axios";

/**
 * 푸시 알림을 위한 디바이스 토큰을 서버에 등록합니다.
 * @param body pushToken을 포함하는 객체
 */
export const postRegisterDeviceToken = async (body: RegisterDeviceTokenBody) => {
  const { data } = await api.post("/devices", body);
  return data;
};
