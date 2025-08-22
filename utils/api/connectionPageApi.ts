import {
  GetConnectionsResponse,
  PostConnectionsAcceptResponse,
  PostConnectionsRejectResponse,
} from "../types/connection";
import instance from "./axios";

interface PagenationParams {
  take: number;
  cursor?: any;
}

// 1. 나한테 대화요청한 목록 조회 api
export const getConnections = async ({ take, cursor }: PagenationParams) => {
  const params: Record<string, any> = {};
  if (take) params.take = take;
  if (cursor !== undefined) params.cursor = cursor;
  const { data } = await instance.get<GetConnectionsResponse>(
    "/connections/pending",
    {
      params,
    }
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
