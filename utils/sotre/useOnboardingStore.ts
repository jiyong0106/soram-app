// store/useOnboardingStore.ts
import { create } from "zustand";

export type Gender = "MALE" | "FEMALE";
export type AuthProvider = "kakao" | "apple" | "google" | "naver" | "email";

export type OnboardingDraft = {
  nickname: string;
  gender: Gender | ""; // 아직 미선택이면 ""
  birthdate: string; // "YYYY-MM-DD"
  location: string;
  bio: string;
  authProvider?: AuthProvider | null; // 소셜 연결 시 사용
  providerId?: string | null; // 소셜의 UID 등
};

type OnboardingStore = {
  draft: OnboardingDraft;
  /** 부분 업데이트(페이지별로 누적 저장) */
  patch: (p: Partial<OnboardingDraft>) => void;
  /** 제출/취소 시 초기화 */
  reset: () => void;
  /** 서버 전송 페이로드 만들기 (외부의 signupToken 주입) */
  buildPayload: (
    signupToken: string
  ) => { signupToken: string } & OnboardingDraft;
  /** 필수값 채움 여부 (UI 버튼 활성화 등에 활용) */
  isReadyToSubmit: () => boolean;
};

const EMPTY: OnboardingDraft = {
  nickname: "",
  gender: "",
  birthdate: "",
  location: "",
  bio: "",
  authProvider: null,
  providerId: null,
};

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  draft: { ...EMPTY },

  patch: (p) => set({ draft: { ...get().draft, ...p } }),

  reset: () => set({ draft: { ...EMPTY } }),

  buildPayload: (signupToken) => ({ signupToken, ...get().draft }),

  isReadyToSubmit: () => {
    const d = get().draft;
    return (
      d.nickname.trim().length > 0 &&
      !!d.gender &&
      d.birthdate.trim().length > 0 &&
      d.location.trim().length > 0 &&
      d.bio.trim().length > 0
    );
  },
}));
