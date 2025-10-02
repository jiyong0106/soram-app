import {
  SignupSumbitResponse,
  SignupSumbitBody,
  getNicknameResponse,
  getProfileQuestionsResponse,
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

//회원가입 필수질문 조회 api
export const getProfileQuestions = async () => {
  const { data } = await instance.get<getProfileQuestionsResponse[]>(
    "/profile-questions"
  );
  return data;
};
