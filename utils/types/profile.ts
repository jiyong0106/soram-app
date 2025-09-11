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

export const getAgeFromBirthdate = (birthdate: string) => {
  try {
    const [y, m, d] = birthdate.split("-").map(Number);
    const today = new Date();
    let age = today.getFullYear() - y;
    const hasHadBirthday =
      today.getMonth() + 1 > m ||
      (today.getMonth() + 1 === m && today.getDate() >= d);
    if (!hasHadBirthday) age -= 1;
    return age;
  } catch {
    return undefined;
  }
};

export const prettyLocation = (location?: string) => location ?? "어딘가에서";

//로그아웃
export type LogoutResponse = {
  message: string;
};
