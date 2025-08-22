// useSignupDraftStore.ts

import { create } from "zustand";
import { SignupDraftType, SignupAnswer } from "../types/signup";

type SignupDraftStore = {
  draft: SignupDraftType;
  patch: (p: Partial<SignupDraftType>) => void;
  reset: () => void;
  buildPayload: (
    signupToken: string
  ) => { signupToken: string } & SignupDraftType;
  isReadyToSubmit: () => boolean;
};

// ✅ answers를 기본 1개로 구성 (questionId=1, isPrimary=true)
const DEFAULT_ANSWER: SignupAnswer = {
  questionId: 1,
  content: "",
  isPrimary: true,
};

const EMPTY: SignupDraftType = {
  nickname: "",
  gender: "",
  birthdate: "",
  answers: [DEFAULT_ANSWER], // 🔁 기본 배열
  location: null,
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
    const primary = d.answers?.find((a) => a.isPrimary);
    return (
      d.nickname.trim().length > 0 &&
      !!d.gender &&
      d.birthdate.trim().length > 0 &&
      !!primary &&
      primary.content.trim().length > 0 // ✅ 자기소개도 필수로 본다면
    );
  },
}));
