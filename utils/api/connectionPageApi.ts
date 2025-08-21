import {
  GetConnectionsResponse,
  PostConnectionsAcceptResponse,
  PostConnectionsRejectResponse,
} from "../types/connection";
import instance from "./axios";

// 1. 나한테 대화요청한 목록 조회 api
export const getConnections = async () => {
  const { data } = await instance.get<GetConnectionsResponse[]>(
    "/connections/pending"
  );
  return data;
};

//2. 대화 요청 수락 api(post)

export const postConnectionsAccept = async ({
  connectionId,
}: {
  connectionId: number;
}) => {
  const { data } = await instance.post<PostConnectionsAcceptResponse>(
    `/connections/${connectionId}/accept`
  );
  return data;
};

//3. 대화 요청 거절 api(post)

export const postConnectionsReject = async ({
  connectionId,
}: {
  connectionId: number;
}) => {
  const { data } = await instance.post<PostConnectionsRejectResponse>(
    `/connections/${connectionId}/reject`
  );
  return data;
};
