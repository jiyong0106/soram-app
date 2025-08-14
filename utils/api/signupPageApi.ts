// postRequestOtp

import instance from "./axios";

export const postSignupSumbit = async (body: any) => {
  const { data } = await instance.post("/auth/signup", body);
};
