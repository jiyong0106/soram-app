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

  useEffect(() => {
    if (!token) return; // 비로그인 상태에서는 실행 금지

    let cancelled = false;

    const run = async () => {
      try {
        const t = await registerForPushNotificationsAsync();
        if (!cancelled && t) setPushToken(t);
      } catch (e) {
        console.warn("registerForPushNotificationsAsync failed", e);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [token, setPushToken]);
}
