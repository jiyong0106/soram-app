import { useEffect } from "react";
import { registerForPushNotificationsAsync } from "@/utils/util/notificatoions";
import { usePushTokenStore } from "@/utils/store/usePushTokenStore";

/**
 * 로그인 이후 레이아웃에서만 호출하세요.
 * - 토큰 발급 및 서버 등록
 * - 로컬 저장소에 토큰 보관(옵션)
 */
export function usePushTokenRegistration(token: string | null) {
  const setPushToken = usePushTokenStore((s) => s.setPushToken);
  const existingPushToken = usePushTokenStore((s) => s.pushToken);

  useEffect(() => {
    if (!token) return; // 비로그인 상태에서는 실행 금지

    let cancelled = false;

    const run = async () => {
      try {
        // 이미 저장된 토큰이 있고, 발급 결과가 동일하면 서버 전송을 생략하기 위해 기존 토큰을 전달
        const t = await registerForPushNotificationsAsync(
          existingPushToken || undefined
        );
        // 변경이 없는 경우(t가 falsy 또는 기존과 동일해 서버 전송 생략한 경우) setPushToken 생략
        if (!cancelled && t && t !== existingPushToken) setPushToken(t);
      } catch (e) {
        console.warn("registerForPushNotificationsAsync failed", e);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [token, setPushToken, existingPushToken]);
}
