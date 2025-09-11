// 공통 UI 헬퍼들 (이니셜, 색상 알파, 연결 상태 라벨)

export const getInitials = (name?: string): string => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
};

export const hexWithAlpha = (hex: string, a = 0.15): string => {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

export const connectionStatusLabel = (s: string): string =>
  s === "PENDING"
    ? "대기"
    : s === "ACCEPTED"
    ? "수락됨"
    : s === "REJECTED"
    ? "거절됨"
    : s;
