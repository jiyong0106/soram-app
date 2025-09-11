// 프로필 관련 타입 정의
export type Answer = {
  questionId: number;
  content: string;
  isPrimary?: boolean;
};

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type ProfileType = {
  nickname: string;
  gender: Gender;
  birthdate: string; // ISO string (YYYY-MM-DD)
  location: string;
  answers: Answer[];
};

//로그아웃
export type LogoutResponse = {
  message: string;
};
