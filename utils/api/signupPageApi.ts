import api from "./axios";
import {
  RequestOtpBody,
  RequestOtpResponse,
  VerifyOtpBody,
  VerifyOtpResponse,
} from "@/utils/types/auth";

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
