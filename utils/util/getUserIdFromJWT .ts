// utils/auth/jwt.ts
export const getUserIdFromJWT = (t?: string | null): number | null => {
  if (!t) return null;
  try {
    const [, payload] = t.split(".");
    const b64url = payload ?? "";
    // base64url → base64 + padding
    const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64.padEnd(Math.ceil(b64.length / 4) * 4, "=");

    // atob 있으면 사용, 없으면 폴백
    const binary =
      typeof atob === "function" ? atob(padded) : base64FallbackDecode(padded);

    // binary string → UTF-8 string
    const jsonStr = decodeURIComponent(
      binary
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );

    const json = JSON.parse(jsonStr);
    const n = Number(json?.sub);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
};

// ✅ '=' 패딩을 만나면 즉시 종료하도록 수정
function base64FallbackDecode(b64: string): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let output = "";
  let buffer = 0;
  let bits = 0;

  for (let i = 0; i < b64.length; i++) {
    const ch = b64[i];
    if (ch === "=") break; // ← padding 처리
    const val = chars.indexOf(ch);
    if (val === -1) continue; // 공백/개행 등 무시(거의 없지만)
    buffer = (buffer << 6) | val;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output += String.fromCharCode((buffer >> bits) & 0xff);
    }
  }
  return output;
}
