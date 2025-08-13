import { AxiosError, isAxiosError } from "axios";

/**
 * 서버가 내려줄 것으로 "가정"한 에러 응답 스키마.
 * - 실제 백엔드 응답(JSON)과 반드시 일치한다는 보장은 없음
 * - 자동완성과 타입 안정성을 위해 예시 스키마를 정의한 것
 *
 * ⚠️ 서버가 { message, error, statusCode } 형태(NestJS 등)로 주면
 *    이 인터페이스와 달라질 수 있으므로, 상황에 맞춰 수정/확장하세요.
 */
export interface ErrorResponse {
  status: string; // 서버/비즈니스 상태코드(문자열)
  serverDataTime: string; // 서버 시각 등 메타 정보
  errorCode: string; // 도메인 에러 코드
  errorMessage: string; // 사용자에게 보여줄 메시지
}

/**
 * Axios 에러인지(그리고 제네릭 에러 응답 타입을 얹을 수 있는지) 판별하는 타입가드.
 *
 * @param error - try/catch에서 받은 unknown 에러
 * @returns error가 AxiosError<ErrorResponse>라고 "간주"할 수 있으면 true
 *
 * ✅ 효과: if (isServerError(e)) { e.response?.data ... } 처럼 타입이 좁혀짐
 * ⚠️ 주의: 이 가드는 "response가 반드시 있다"는 보장은 하지 않습니다.
 *          e.response가 undefined일 수 있으니 접근 시 옵셔널 체이닝을 사용하세요.
 *
 * 필요하면 아래처럼 response 유무까지 포함한 타입가드를 쓰세요:
 *   export const isServerErrorWithResponse = (
 *     error: unknown
 *   ): error is AxiosError<ErrorResponse> =>
 *     isAxiosError(error) && !!error.response;
 */
export const isServerError = (
  error: unknown
): error is AxiosError<ErrorResponse> => {
  return isAxiosError(error);
};
// axios error 타입가드

/**
 * 서버 에러 응답 데이터의 "폭넓은" 표현.
 * - 백엔드 응답 형태가 다양한 경우를 위해 제네릭 기본값으로 사용
 */
export type AnyServerErrorData = Record<string, unknown>;

/**
 * Axios 에러에서 response.data를 안전하게 추출하는 헬퍼.
 *
 * @typeParam T - 기대하는 서버 에러 응답의 타입(기본값: AnyServerErrorData)
 * @param error - try/catch에서 받은 unknown 에러
 * @returns
 *   - Axios 에러가 아니면 null
 *   - Axios 에러지만 response 없으면 null
 *   - 있으면 response.data를 T로 캐스팅하여 반환
 *
 * ✅ 장점: 호출부에서 제네릭 T를 지정해 원하는 스키마로 data를 안전하게 다룸
 * ⚠️ 주의: 런타임 검증은 하지 않음(캐스팅). 실제 구조 보장은 서버 응답에 따름
 *
 * @example
 * try {
 *   // ...
 * } catch (e) {
 *   // 서버가 { message?: string; statusCode?: number } 형태로 줄 때
 *   const data = getAxiosErrorData<{ message?: string; statusCode?: number }>(e);
 *   const msg = data?.message ?? "오류가 발생했어요";
 *   Alert.alert(msg);
 * }
 */
export const getAxiosErrorData = <T = AnyServerErrorData>(
  error: unknown
): T | null => {
  if (!isAxiosError(error)) return null;
  return (error.response?.data as T) ?? null;
};
