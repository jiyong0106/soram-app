import { GetChatResponse } from "../types/chat";
import instance from "./axios";

// 1. 채팅방 목록 조회 ㅁpi
export const getChat = async () => {
  const { data } = await instance.get<GetChatResponse[]>("/connections");
  return data;
};
