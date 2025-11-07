import { FieldKey } from "../types/signup";

export const onlyDigits = (s: string, max: number) =>
  s.replace(/\D/g, "").slice(0, max);
export const parseBirth = (v?: string) => {
  if (!v) return { year: "", month: "", day: "" };
  const [y = "", m = "", d = ""] = v.split("-");
  return { year: y, month: m, day: d };
};
export const validBirth = ({
  year,
  month,
  day,
}: {
  year: string;
  month: string;
  day: string;
}) => {
  if (year.length !== 4 || month.length === 0 || day.length === 0) return false;
  const y = +year,
    m = +month,
    d = +day;
  if (!y || y < 1950 || y > new Date().getFullYear() || m < 1 || m > 12)
    return false;
  const dim = new Date(y, m, 0).getDate();
  return d >= 1 && d <= dim;
};

export const FIELDS: Array<{
  key: FieldKey;
  ph: string;
  max: number;
  width: number;
}> = [
  { key: "year", ph: "YYYY", max: 4, width: 100 },
  { key: "month", ph: "MM", max: 2, width: 80 },
  { key: "day", ph: "DD", max: 2, width: 80 },
];
//  birthdate 페이지 유틸 및 옵션
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

// 한글 주석: 생년 + 만 나이 포맷팅
export function formatBirthAndAge(birthdate?: string | null) {
  if (!birthdate) return "-";
  const age = getAgeFromBirthdate(birthdate);
  try {
    const [y] = birthdate.split("-");
    return age !== undefined ? `${y}년생, 만 ${age}세` : `${y}년생`;
  } catch {
    return birthdate as string;
  }
}
