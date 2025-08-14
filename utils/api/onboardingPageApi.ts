// postRequestOtp

import instance from "./axios";

export const postOnboardingSumbit = async (body: any) => {
  const { data } = await instance.post("/auth/signup", body);
};
