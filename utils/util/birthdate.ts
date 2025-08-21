//  birthdate 페이지 유틸 및 옵션

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
  if (!y || m < 1 || m > 12) return false;
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
