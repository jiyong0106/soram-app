import { AxiosError, isAxiosError } from "axios";

export interface ErrorResponse {
  status: string;
  serverDataTime: string;
  errorCode: string;
  errorMessage: string;
}

export const isServerError = (
  error: unknown
): error is AxiosError<ErrorResponse> => {
  return isAxiosError(error);
};
//axios error타입가드
