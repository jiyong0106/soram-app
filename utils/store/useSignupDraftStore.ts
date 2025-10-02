// useSignupDraftStore.ts

import { create } from "zustand";
import { SignupDraftType, SignupAnswer } from "../types/signup";

type SignupDraftStore = {
  draft: SignupDraftType;
  // 한글 주석: 상위에서 일부 필드만 병합할 때 사용
  patch: (p: Partial<SignupDraftType>) => void;
  reset: () => void;
  buildPayload: (
    signupToken: string
  ) => { signupToken: string } & SignupDraftType;
  isReadyToSubmit: () => boolean;
  // 한글 주석: 답변 조작용 액션들
  upsertAnswer: (args: {
    questionId: number;
    content: string;
    isPrimary?: boolean;
  }) => void;
  removeAnswer: (questionId: number) => void;
  getAnswerById: (questionId: number) => SignupAnswer | undefined;
  // 한글 주석: UI 전용 상태 - 선택 질문 타이틀(백엔드 전송 대상 아님)
  optionalTitle?: string | null;
  setOptionalTitle: (title: string | null) => void;
};

// ✅ 기본 필수 답변 2개를 초기 생성(1: isPrimary=true, 2: isPrimary=false)
const REQUIRED_ANSWER_1: SignupAnswer = {
  questionId: 1,
  content: "",
  isPrimary: true,
};
const REQUIRED_ANSWER_2: SignupAnswer = {
  questionId: 2,
  content: "",
  isPrimary: false,
};

const EMPTY: SignupDraftType = {
  nickname: "",
  gender: "",
  birthdate: "",
  answers: [REQUIRED_ANSWER_1, REQUIRED_ANSWER_2], // 🔁 필수 2개 유지
  location: null,
  authProvider: null,
  providerId: null,
};

export const useSignupDraftStore = create<SignupDraftStore>((set, get) => ({
  draft: { ...EMPTY },
  optionalTitle: null,

  patch: (p) => set({ draft: { ...get().draft, ...p } }),

  reset: () => set({ draft: { ...EMPTY }, optionalTitle: null }),

  buildPayload: (signupToken) => ({ signupToken, ...get().draft }),

  isReadyToSubmit: () => {
    const d = get().draft;
    const a1 = d.answers?.find((a) => a.questionId === 1)?.content?.trim();
    const a2 = d.answers?.find((a) => a.questionId === 2)?.content?.trim();
    return (
      d.nickname.trim().length > 0 &&
      !!d.gender &&
      d.birthdate.trim().length > 0 &&
      !!a1 &&
      a1.length > 0 &&
      !!a2 &&
      a2.length > 0
    );
  },

  // 한글 주석: 답변 추가/갱신. 선택 질문은 하나만 유지
  upsertAnswer: ({ questionId, content, isPrimary }) => {
    const current = get().draft.answers ?? [];

    // 한글 주석: 필수 질문 1,2는 항상 존재. 없으면 생성
    let next = [...current];

    const index = next.findIndex((a) => a.questionId === questionId);
    const normalizedIsPrimary =
      questionId === 1 ? true : !!isPrimary && questionId !== 2;

    if (index >= 0) {
      next[index] = {
        ...next[index],
        content,
        isPrimary: normalizedIsPrimary
          ? true
          : next[index].isPrimary && questionId === 1,
      };
    } else {
      // 한글 주석: 신규 답변은 그대로 추가(필수/선택 구분 로직은 화면/추후로 이관)
      const newAnswer: SignupAnswer = {
        questionId,
        content,
        isPrimary: normalizedIsPrimary,
      };
      next.push(newAnswer);
    }

    // 한글 주석: isPrimary는 정확히 하나만 true가 되도록 정규화(기본적으로 1만 true)
    next = next.map((a) => ({ ...a, isPrimary: a.questionId === 1 }));

    set({ draft: { ...get().draft, answers: next } });
  },

  // 한글 주석: 선택 질문만 삭제 허용
  removeAnswer: (questionId: number) => {
    if (questionId === 1 || questionId === 2) return; // 필수는 삭제 금지
    const next = (get().draft.answers ?? []).filter(
      (a) => a.questionId !== questionId
    );
    set({ draft: { ...get().draft, answers: next } });
  },

  getAnswerById: (questionId: number) => {
    return get().draft.answers?.find((a) => a.questionId === questionId);
  },

  setOptionalTitle: (title) => set({ optionalTitle: title }),
}));
