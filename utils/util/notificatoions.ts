// src/utils/util/notificatoions.ts
import { postRegisterDeviceToken } from "@/utils/api/deviceApi";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";

export async function schedulePushNotification() {
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
}

export async function registerForPushNotificationsAsync(
  existingToken?: string
) {
  let token: string | undefined;

  // ANDROID: 채널 설정
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("myNotificationChannel", {
      name: "A channel is needed for the permissions prompt to appear",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  // 권한 체크 & 요청
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return;
  }

  // Expo Push Token 발급
  try {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      throw new Error("Project ID not found");
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;

    // console.log("[STEP R13] Expo Push Token 발급 성공:", token);

    // 기존 토큰과 동일하면 서버 전송 생략 (변경 시에만 전송)
    if (existingToken && existingToken === token) {
      console.log("서버 전송 생략");
    } else {
      // 백엔드에 토큰 전송
      try {
        await postRegisterDeviceToken({ pushToken: token });
        console.log(" 서버 전송 성공");
      } catch (error) {
        console.error("서버 전송 실패:");
        // 여기서 에러를 어떻게 처리할지 정책에 따라 추가 구현 가능
        // (예: 재시도 로직, 에러 리포팅 등)
      }
    }
  } catch (e) {
    token = `${e}`;
  }

  return token;
}
