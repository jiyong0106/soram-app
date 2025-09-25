import instance from "./axios";

// --- 1. API 응답 타입을 정의합니다. ---
// 백엔드의 TransactionHistoryDto 와 일치합니다.
interface Transaction {
  id: number;
  transactionType: "EARN" | "USE";
  quantityChange: number;
  ticketName: string;
  createdAt: string;
  iconType: string;
  displayText: string;
}

// 백엔드의 PageMetaDto 와 일치합니다.
interface Meta {
  take: number;
  totalCount: number;
  endCursor: number | null;
  hasNextPage: boolean;
}

// 최종 API 응답 전체 형태입니다. (PageDto<Transaction>)
export interface GetTransactionsResponse {
  data: Transaction[];
  meta: Meta;
}

// --- 2. API 요청 파라미터 타입을 정의합니다. ---
export interface GetTransactionsParams {
  type?: "ALL" | "EARN" | "USE";
  sort?: "desc" | "asc";
  cursor?: number;
  take?: number;
}

// --- 3. API 호출 함수를 정의하고 export 합니다. ---

/**
 * 내 재화 사용 내역을 페이지네이션으로 조회합니다.
 */
export const getTransactions = async ({
  type,
  sort,
  cursor,
  take = 20, // 기본값 설정
}: GetTransactionsParams) => {
  // 쿼리 파라미터를 담을 객체를 생성합니다.
  const params: Record<string, any> = {
    take,
  };

  // 파라미터 값이 존재할 경우에만 객체에 추가합니다.
  if (type) params.type = type;
  if (sort) params.sort = sort;
  if (cursor) params.cursor = cursor;

  // axios 인스턴스를 사용하여 GET 요청을 보냅니다.
  const { data } = await instance.get<GetTransactionsResponse>(
    "/transactions",
    {
      params,
    }
  );

  return data;
};

export type HistoryTabKey = "ALL" | "EARN" | "USE";
