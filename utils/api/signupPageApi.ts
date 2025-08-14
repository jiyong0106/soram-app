import { SignupSumbitResponse, SignupSumbitBody } from "../types/signup";
import instance from "./axios";

export const postSignupSumbit = async (body: SignupSumbitBody) => {
  const { data } = await instance.post<SignupSumbitResponse>(
    "/auth/signup",
    body
  );
  return data;
};
