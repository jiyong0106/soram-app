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
