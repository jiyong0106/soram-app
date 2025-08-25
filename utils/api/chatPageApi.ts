import { GetChatResponse } from "../types/chat";
import instance from "./axios";

interface PagenationParams {
  take?: number;
  cursor?: any;
}
// 1. 채팅방 목록 조회 ㅁpi
export const getChat = async ({ take, cursor }: PagenationParams) => {
  const params: Record<string, any> = {};
  if (take) params.take = take;
  if (cursor !== null) params.cursor = cursor;
  const { data } = await instance.get<GetChatResponse>("/connections", {
    params,
  });
  return data;
};

// 2. 채팅 내역 조회 api

interface MessagesParams extends PagenationParams {
  connectionId: number;
}
export const getMessages = async ({
  connectionId,
  cursor,
  take,
}: MessagesParams) => {
  const params: Record<string, any> = {};
  if (take) params.take = take;
  if (cursor !== null) params.cursor = cursor;
  const { data } = await instance.get(`/connections/${connectionId}/messages`, {
    params,
  });
  return data;
};

// 60 ~ 31 => 30 =>1 이렇게 나와야함
 
//31 ~ 60 => 1 => 30 지금 이렇게나와 

//아까는 31 ~ 60 => 30 ~ 59
