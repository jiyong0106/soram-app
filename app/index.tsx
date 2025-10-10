import { Platform, StyleSheet, View } from "react-native";
import Description from "../components/index/Description";
import RootHeader from "../components/index/RootHeader";
import StartButton from "../components/index/StartButton";
import TermsNotice from "../components/index/TermsNotice";
import WelcomeImage from "../components/index/WelcomeImage";
import PageContainer from "@/components/common/PageContainer";
import { LinearGradient } from "expo-linear-gradient";
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
  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  useEffect(() => {
    console.log("[STEP I3] useEffect 마운트 진입");

    // 1) 토큰 등록
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
      }
    });

    // 2) Android 채널 조회
    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) => {
        setChannels(value ?? []);
      });
    }

    // 3) 알림 수신 리스너
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    // 4) 알림 응답(클릭) 리스너
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("[STEP I13] 알림 응답 이벤트 발생:", response);
      });

    // 언마운트
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  // 상태가 바뀔 때마다 확인하고 싶으면 아래 로그 유지

  return (
    <PageContainer edges={["top", "bottom"]}>
      <LinearGradient
        colors={["#FFB591", "#FFB591", "#FFB591", "#ffffff"]}
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "85%",
        }}
      />

      <View style={styles.container}>
        <RootHeader />
        <View style={styles.body}>
          <WelcomeImage />
          <Description />
          <TermsNotice />
          <StartButton />
        </View>
      </View>
    </PageContainer>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    gap: 10,
  },
});
