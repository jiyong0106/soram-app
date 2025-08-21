import {
  RequestConnectionBody,
  RequestConnectionResponse,
} from "../types/connections";
import instance from "./axios";

// 1. 다른 사람한테 대화 요청하기
export const postRequestConnection = async (body: RequestConnectionBody) => {
  const { data } = await instance.post<RequestConnectionResponse>(
    "/connections/request",
    body
  );
  return data;
};

// 2. 나한테 대화요청한 목록 보기
export const getConnections = async () => {
  const { data } = await instance.get("/connections/pending");
  return data;
};
