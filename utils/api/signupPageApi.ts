import {
  SignupSumbitResponse,
  SignupSumbitBody,
  getNicknameResponse,
} from "../types/signup";
import instance from "./axios";

export const postSignupSumbit = async (body: SignupSumbitBody) => {
  const { data } = await instance.post<SignupSumbitResponse>(
    "/auth/signup",
    body
  );
  return data;
};

export const getNickname = async (nickname: string, signal?: AbortSignal) => {
  const { data } = await instance.get<getNicknameResponse>(
    `/users/nickname/check`,
    { params: { nickname }, signal }
  );
  return data;
};
