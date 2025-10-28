import { useAuthStore } from "@/utils/store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Redirect, Tabs } from "expo-router";
import { View, Pressable, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // 👈 [추가] 그라데이션 라이브러리 import
import { useChatUnreadStore } from "@/utils/store/useChatUnreadStore";
import Badge from "@/components/common/Badge";
import { usePushTokenRegistration } from "@/utils/hooks/usePushTokenRegistration";
import { useQueryClient } from "@tanstack/react-query";
import { getChat } from "@/utils/api/chatPageApi";

// 배지는 공용 컴포넌트 사용

// 헬퍼 함수: 개별 탭 아이템 렌더링 (chat 탭에만 배지 표시)
const renderTabItem = ({
  route,
  isFocused,
  options,
  onPress,
  onLongPress,
  badgeCount = 0,
}: any) => (
  <Pressable
    key={route.key}
    accessibilityRole="button"
    accessibilityState={isFocused ? { selected: true } : {}}
    accessibilityLabel={options.tabBarAccessibilityLabel}
    onPress={onPress}
    onLongPress={onLongPress}
    style={styles.tabItem}
  >
    <View style={styles.iconWrapper}>
      {options.tabBarIcon &&
        options.tabBarIcon({
          focused: isFocused,
          color: isFocused ? "#FF7D4A" : "#B0A6A0",
          size: 28,
        })}
      {route.name === "chat" ? (
        <Badge
          count={badgeCount}
          style={styles.badge}
          textStyle={styles.badgeText}
        />
      ) : null}
    </View>
    <Text
      style={{
        color: isFocused ? "#FF7D4A" : "#B0A6A0",
        fontSize: 10,
        marginTop: 2,
      }}
    >
      {options.title}
    </Text>
  </Pressable>
);

// 커스텀 탭 바 컴포넌트
const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const qc = useQueryClient();
  // 한글 주석: Chat 탭 데이터 프리패치 (최대 300ms 대기)
  const prefetchChatWithTimeout = async () => {
    try {
      const timeout = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      const prefetchPromise = qc.prefetchInfiniteQuery({
        queryKey: ["getChatKey"],
        queryFn: ({ pageParam }) =>
          getChat({
            take: 10,
            cursor: pageParam,
          }),
        initialPageParam: undefined as number | undefined,
      });
      await Promise.race([prefetchPromise, timeout(300)]);
    } catch {}
  };
  // 전체 안읽은 수 합계 (스토어에서 파생값만 구독)
  const totalUnread = useChatUnreadStore((s) => {
    const uid = s.currentUserId;
    const perUser = uid != null ? s.unreadCountByUserId[uid] ?? {} : {};
    return Object.values(perUser).reduce(
      (acc: number, v: number) => acc + (v || 0),
      0
    );
  });
  const centerIndex = Math.floor(state.routes.length / 2);

  const leftRoutes = state.routes.slice(0, centerIndex);
  const rightRoutes = state.routes.slice(centerIndex + 1);
  const centerRoute = state.routes[centerIndex];
  const centerOptions = descriptors[centerRoute.key].options;

  const isCenterFocused = state.index === centerIndex;

  const handleCenterPress = () => {
    const event = navigation.emit({
      type: "tabPress",
      target: centerRoute.key,
      canPreventDefault: true,
    });

    if (event.defaultPrevented) {
      return;
    }
    // isFocused 여부와 관계없이 navigate를 호출하여
    // React Navigation의 기본 동작(활성 탭 클릭 시 popToTop)을 트리거합니다.
    navigation.navigate(centerRoute.name);
  };

  return (
    <View style={styles.tabBarOuterContainer}>
      <Pressable
        key={centerRoute.key}
        onPress={handleCenterPress}
        style={styles.centerButtonWrapper}
      >
        {isCenterFocused ? (
          <LinearGradient
            colors={["#FFF3EC", "#FF7D4A"]} // 그라데이션 색상 배열
            start={{ x: 0, y: 0 }}
            end={{ x: 0.75, y: 0.75 }}
            style={styles.centerButton}
          >
            {centerOptions.tabBarIcon?.({
              focused: isCenterFocused,
              color: "white",
              size: 34,
            })}
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.centerButton,
              { backgroundColor: "#B0A6A0" }, // 비활성화 시 단색
            ]}
          >
            {centerOptions.tabBarIcon?.({
              focused: isCenterFocused,
              color: "white",
              size: 34,
            })}
          </View>
        )}
        <Text
          style={[
            styles.centerButtonLabel,
            { color: isCenterFocused ? "#FF7D4A" : "#B0A6A0" },
          ]}
        >
          {centerOptions.title}
        </Text>
      </Pressable>

      <View style={styles.tabBarContainer}>
        <View style={styles.sideContainer}>
          {leftRoutes.map((route) => {
            const options = descriptors[route.key].options;
            const isFocused = state.index === state.routes.indexOf(route);
            const onPress = async () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (event.defaultPrevented) return;
              if (route.name === "chat") {
                await prefetchChatWithTimeout();
              }
              if (!isFocused) {
                navigation.navigate(route.name);
              }
            };
            const onLongPress = () =>
              navigation.emit({ type: "tabLongPress", target: route.key });
            return renderTabItem({
              route,
              isFocused,
              options,
              onPress,
              onLongPress,
              badgeCount: route.name === "chat" ? totalUnread : 0,
            });
          })}
        </View>

        <View style={styles.centerSpacer} />

        <View style={styles.sideContainer}>
          {rightRoutes.map((route) => {
            const options = descriptors[route.key].options;
            const isFocused = state.index === state.routes.indexOf(route);
            const onPress = async () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (event.defaultPrevented) return;
              if (route.name === "chat") {
                await prefetchChatWithTimeout();
              }
              if (!isFocused) {
                navigation.navigate(route.name);
              }
            };
            const onLongPress = () =>
              navigation.emit({ type: "tabLongPress", target: route.key });
            return renderTabItem({
              route,
              isFocused,
              options,
              onPress,
              onLongPress,
              badgeCount: route.name === "chat" ? totalUnread : 0,
            });
          })}
        </View>
      </View>
    </View>
  );
};

const TabLayout = () => {
  const token = useAuthStore((s) => s.token);

  // 로그인 상태에서만 푸시 토큰 등록
  usePushTokenRegistration(token);

  if (!token) return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="chat"
        options={{
          title: "대화",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity/index"
        options={{
          title: "활동",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="compass"
              size={size}
              color={color}
              style={{ transform: [{ scale: 1.15 }] }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="topic"
        options={{
          title: "홈",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flame" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "프로필",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting/index"
        options={{
          title: "더보기",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBarOuterContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 85,
    backgroundColor: "transparent",
  },
  tabBarContainer: {
    flexDirection: "row",
    height: "100%",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    alignItems: "flex-start",
    paddingTop: 16,
  },
  sideContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    position: "relative",
  },
  centerSpacer: {
    width: 90,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    backgroundColor: "#FF3B30",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
  centerButtonWrapper: {
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -35 }],
    top: -20,
    width: 70,
    height: 70,
    zIndex: 1,
    alignItems: "center",
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  centerButtonLabel: {
    fontSize: 12,
    marginTop: 6,
  },
});

export default TabLayout;
