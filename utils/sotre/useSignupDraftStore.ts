import { create } from "zustand";
import { SignupDraftType } from "../types/signup";

type SignupDraftStore = {
  draft: SignupDraftType;
  /** 부분 업데이트(페이지별로 누적 저장) */
  patch: (p: Partial<SignupDraftType>) => void;
  /** 제출/취소 시 초기화 */
  reset: () => void;
  /** 서버 전송 페이로드 만들기 (외부의 signupToken 주입) */
  buildPayload: (
    signupToken: string
  ) => { signupToken: string } & SignupDraftType;
  /** 필수값 채움 여부 (UI 버튼 활성화 등에 활용) */
  isReadyToSubmit: () => boolean;
};

const EMPTY: SignupDraftType = {
  nickname: "",
  gender: "",
  birthdate: "",
  location: null,
  bio: null,
  authProvider: null,
  providerId: null,
};

export const useSignupDraftStore = create<SignupDraftStore>((set, get) => ({
  draft: { ...EMPTY },

  patch: (p) => set({ draft: { ...get().draft, ...p } }),

  reset: () => set({ draft: { ...EMPTY } }),

  buildPayload: (signupToken) => ({ signupToken, ...get().draft }),

  isReadyToSubmit: () => {
    const d = get().draft;
    // 필수값만 검증: nickname, gender, birthdate
    return (
      d.nickname.trim().length > 0 &&
      !!d.gender &&
      d.birthdate.trim().length > 0
    );
  },
}));
