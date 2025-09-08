import { Button, Platform, StyleSheet, View } from "react-native";
import Description from "../components/index/Description";
import LoginButton from "../components/index/LoginButton";
import LogoHeader from "../components/index/LogoHeader";
import StartButton from "../components/index/StartButton";
import TermsNotice from "../components/index/TermsNotice";
import WelcomeImage from "../components/index/WelcomeImage";
import PageContainer from "@/components/common/PageContainer";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { registerForPushNotificationsAsync } from "@/utils/util/notificatoions";

// 전역 핸들러
Notifications.setNotificationHandler({
  handleNotification: async () => {
    console.log("[STEP H1] setNotificationHandler 호출됨 (수신 시 표시 정책)");
    return {
      shouldPlaySound: true, // 알림 도착 시 소리
      shouldSetBadge: false, // 아이콘 배지
      shouldShowBanner: true, // 배너 표시(iOS)
      shouldShowList: true, // 알림센터 리스트 기록(iOS)
    };
  },
});

const Index = () => {
  console.log("[STEP I1] Index 컴포넌트 렌더 시작");

  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  // 초기 상태 로그
  console.log("[STEP I2] 초기 state", {
    expoPushToken,
    channelsLength: channels.length,
    notification,
  });

  useEffect(() => {
    console.log("[STEP I3] useEffect 마운트 진입");

    // 1) 토큰 등록
    registerForPushNotificationsAsync().then((token) => {
      console.log(
        "[STEP I4] registerForPushNotificationsAsync 완료, token:",
        token
      );
      if (token) {
        setExpoPushToken(token);
        console.log("[STEP I5] expoPushToken 상태 업데이트 예정");
      }
    });

    // 2) Android 채널 조회
    if (Platform.OS === "android") {
      console.log("[STEP I6] Android 채널 조회 시도");
      Notifications.getNotificationChannelsAsync().then((value) => {
        console.log("[STEP I7] Android 채널 조회 완료:", value);
        setChannels(value ?? []);
        console.log("[STEP I8] channels 상태 업데이트 예정");
      });
    }

    // 3) 알림 수신 리스너
    console.log("[STEP I9] 알림 수신 리스너 등록");
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("[STEP I10] 알림 수신 이벤트 발생:", notification);
        setNotification(notification);
        console.log("[STEP I11] notification 상태 업데이트 예정");
      }
    );

    // 4) 알림 응답(클릭) 리스너
    console.log("[STEP I12] 알림 응답 리스너 등록");
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("[STEP I13] 알림 응답 이벤트 발생:", response);
      });

    // 언마운트
    return () => {
      console.log("[STEP I14] useEffect 언마운트 → 리스너 제거");
      notificationListener.remove();
      responseListener.remove();
      console.log("[STEP I15] 리스너 제거 완료");
    };
  }, []);

  // 상태가 바뀔 때마다 확인하고 싶으면 아래 로그 유지
  console.log("[STEP I16] 렌더 직전 상태 스냅샷", {
    expoPushToken,
    channelsLength: channels.length,
    notification,
  });

  return (
    <PageContainer edges={["top", "bottom"]}>
      <View style={styles.container}>
        <LogoHeader />
        <View style={styles.body}>
          <WelcomeImage />
          <Description />
          <TermsNotice />
          <StartButton />
          <LoginButton />
        </View>
      </View>
    </PageContainer>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  body: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    gap: 10,
  },
});
