import {
  RequestConnectionBody,
  RequestConnectionResponse,
} from "../types/chat";
import instance from "./axios";

// 1. 다른 사람한테 대화 요청하기
export const postRequestConnection = async (body: RequestConnectionBody) => {
  const { data } = await instance.post<RequestConnectionResponse>(
    "/connections/request",
    body
  );
  return data;
};
