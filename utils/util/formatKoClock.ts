export function formatKoClock(
  input: string | number | Date,
  timeZone: string = "Asia/Seoul"
) {
  const d = new Date(input);
  if (isNaN(d.getTime())) return "";

  try {
    const parts = new Intl.DateTimeFormat("ko-KR", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
    }).formatToParts(d);

    const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
    // map.dayPeriod: '오전' | '오후' , map.hour: '01'..'12' , map.minute: '00'..'59'
    return `${map.dayPeriod} ${map.hour}:${map.minute}`;
  } catch {
    // (드물게 Intl 미지원일 때) 수동 포맷
    let h = d.getHours();
    const m = d.getMinutes();
    const isPM = h >= 12;
    h = h % 12 || 12;
    return `${isPM ? "오후" : "오전"} ${String(h).padStart(2, "0")}:${String(
      m
    ).padStart(2, "0")}`;
  }
}

export const makeMinuteKey = (
  input: string | number | Date,
  timeZone = "Asia/Seoul"
) => {
  const d = new Date(input);
  try {
    const parts = new Intl.DateTimeFormat("ko-KR", {
      timeZone,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).formatToParts(d);
    const m = Object.fromEntries(parts.map((p) => [p.type, p.value]));
    // 같은 키면 같은 '분'
    return `${m.year}-${m.month}-${m.day} ${m.hour}:${m.minute}`;
  } catch {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(
      2,
      "0"
    )}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
};

// 한국 시간(기본 Asia/Seoul) 기준으로 YYYY-MM-DD만 반환
export function formatKoDateOnly(
  input: string | number | Date,
  timeZone: string = "Asia/Seoul"
) {
  const d = new Date(input);
  if (isNaN(d.getTime())) return "";
  try {
    const parts = new Intl.DateTimeFormat("ko-KR", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(d);
    const m = Object.fromEntries(parts.map((p) => [p.type, p.value]));
    return `${m.year}-${m.month}-${m.day}`;
  } catch {
    // 폴백: 로컬 타임존 기준
    return `${d.getFullYear()} - ${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )} - ${String(d.getDate()).padStart(2, "0")}`;
  }
}
