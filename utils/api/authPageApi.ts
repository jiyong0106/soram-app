import instance from "./axios";
import api from "./axios";
import {
  getTicketsResponse,
  RequestOtpBody,
  RequestOtpResponse,
  VerifyOtpBody,
  VerifyOtpResponse,
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
