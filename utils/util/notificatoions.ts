// src/utils/util/notificatoions.ts
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";

export async function schedulePushNotification() {
  console.log("[STEP S1] schedulePushNotification() 호출됨");
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here", test: { test1: "more data" } },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });
  console.log("[STEP S2] 로컬 알림 스케줄 완료");
}

export async function registerForPushNotificationsAsync() {
  console.log("[STEP R1] 푸시 토큰 등록 시작");
  let token: string | undefined;

  // ANDROID: 채널 설정
  if (Platform.OS === "android") {
    console.log("[STEP R2] Android 채널 설정 시도");
    await Notifications.setNotificationChannelAsync("myNotificationChannel", {
      name: "A channel is needed for the permissions prompt to appear",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
    console.log("[STEP R3] Android 채널 설정 완료");
  }

  // 권한 체크 & 요청
  console.log("[STEP R4] 알림 권한 상태 확인");
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  console.log(`[STEP R5] 기존 권한 상태: ${existingStatus}`);

  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    console.log("[STEP R6] 권한 미허용 → 권한 요청 시작");
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
    console.log(`[STEP R7] 권한 요청 결과: ${finalStatus}`);
  }

  if (finalStatus !== "granted") {
    console.log("[STEP R8] 권한 거부됨 → 토큰 요청 중단");
    alert("Failed to get push token for push notification!");
    return;
  }

  // Expo Push Token 발급
  try {
    console.log("[STEP R9] projectId 추출 시도");
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      console.log("[STEP R10] projectId 없음 → 예외 발생");
      throw new Error("Project ID not found");
    }
    console.log(`[STEP R11] projectId 확인됨: ${projectId}`);

    console.log("[STEP R12] Expo Push Token 발급 시도");
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;

    console.log("[STEP R13] Expo Push Token 발급 성공:", token);
  } catch (e) {
    console.log("[STEP R14] 토큰 발급 중 예외 발생:", e);
    token = `${e}`;
  }

  console.log("[STEP R15] 푸시 토큰 등록 종료");
  return token;
}
