// 성별
export type Gender = "MALE" | "FEMALE";

//로그인 입
export type AuthProvider = "kakao" | "apple" | "google" | "naver" | "email";

// 생년월일 필드타입
export type FieldKey = "year" | "month" | "day";

// 사인업 토큰을 제외한 드래프트 타입입
export type SignupDraftType = {
  nickname: string;
  gender: Gender | ""; // 아직 미선택이면 ""
  birthdate: string; // "YYYY-MM-DD"
  location?: string | null;
  bio?: string | null;
  authProvider?: AuthProvider | null; // 소셜 연결 시 사용
  providerId?: string | null; // 소셜의 UID 등
};

// 1-1 회원가입 시 바디에 보낼 타입
export type SignupSumbitBody = {
  signupToken: string;
  nickname: string;
  gender: Gender | ""; // 아직 미선택이면 ""
  birthdate: string; // "YYYY-MM-DD"
  location?: string | null;
  bio?: string | null;
  authProvider?: AuthProvider | null; // 소셜 연결 시 사용
  providerId?: string | null; // 소셜의 UID 등
};

// 1-2 회원가입 후 내려올 응답값
export interface SignupSumbitResponse {
  accessToken: string;
}
