import AppHeader from "@/components/common/AppHeader";
import TopicSkeleton from "@/components/skeleton/TopicSkeleton";
import TicketsView from "@/components/topic/TicketsView";
import TopicCard from "@/components/topic/TopicCard";
import TopicTitle from "@/components/topic/TopicTitle";
import { getRandomTopicSet } from "@/utils/api/topicPageApi";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useState, useMemo, useRef, useEffect } from "react";
import { StyleSheet, View, FlatList, Dimensions } from "react-native";
import TopicListCTA from "@/components/topic/TopicListCTA";
import GuideModal from "@/components/common/GuideModal";
import { getUserIdFromJWT } from "@/utils/util/getUserIdFromJWT";
import { useAuthStore } from "@/utils/store/useAuthStore";
import { getNotifications } from "@/utils/api/notificationApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNotificationStore } from "@/utils/store/useNotificationStore";
import { useChatUnreadStore } from "@/utils/store/useChatUnreadStore";
import { getUnreadCounts } from "@/utils/api/chatPageApi";
import UserBanModal from "@/components/common/UserBanModal";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// 캐러셀 UI를 위한 상수 정의
const ITEM_WIDTH = SCREEN_WIDTH - 80; // 아이템 너비. 80은 좌우로 40px씩 보이게 함.
const ITEM_SPACING = 16; // 아이템 간의 간격
const HORIZONTAL_PADDING = (SCREEN_WIDTH - ITEM_WIDTH) / 2; // 첫 아이템과 마지막 아이템을 중앙에 오게 할 패딩 (40px)

const TopicPage = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const token = useAuthStore((s) => s.token);
  const userId = getUserIdFromJWT(token);
  const hasUnread = useNotificationStore((s) => s.hasUnread);
  const setHasUnread = useNotificationStore((s) => s.setHasUnread);
  const syncChatUnread = useChatUnreadStore((s) => s.syncUnreadCounts);
  const queryClient = useQueryClient();
  const topicSetQueryKey = ["getTopicSetKey"]; // 수동 셔플 로딩 상태를 제어하기 위한 state
  const [isShuffling, setIsShuffling] = useState(false);

  // 안 읽은 알림 확인 로직
  useEffect(() => {
    const checkUnreadNotifications = async () => {
      try {
        const response = await getNotifications({ take: 1 });
        const hasUnreadNotification = response.data.some(
          (notification) => !notification.isRead
        );
        setHasUnread(hasUnreadNotification);
      } catch (error) {
        if (__DEV__) console.error("읽지 않은 알림을 확인하지 못했습니다:");
      }
    };

    checkUnreadNotifications();
  }, []);

  // 앱 시작 시 안 읽은 채팅 개수 동기화
  useEffect(() => {
    const syncChatState = async () => {
      if (!userId) return; // 로그인 상태일 때만 실행
      try {
        const unreadCounts = await getUnreadCounts();
        syncChatUnread(unreadCounts);
      } catch (error) {
        if (__DEV__) console.error("Failed to sync unread chat counts:");
      }
    };
    syncChatState();
  }, [userId, syncChatUnread]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const {
    data: topics,
    isLoading,
    isFetching, // refetch는 더 이상 사용하지 않습니다.
  } = useQuery({
    queryKey: topicSetQueryKey,
    queryFn: () => getRandomTopicSet(),
    placeholderData: keepPreviousData,
  });

  const showInitSkeleton = !topics && isLoading; // onShuffle 로직에서 0.5초 딜레이 제거
  const onShuffle = useCallback(async () => {
    // 1. 수동 셔플 로딩 상태를 true로 설정
    setIsShuffling(true);
    const fetchPromise = (async () => {
      try {
        const currentTopicIds = topics
          ? topics.map((topic: any) => topic.id)
          : [];
        const newData = await getRandomTopicSet(currentTopicIds);
        return newData;
      } catch (error) {
        return null; // 실패 시 null 반환
      }
    })(); // 4. Promise.all 대신 fetchPromise만 await 합니다.

    const newData = await fetchPromise; // 5. 모든 것이 끝난 후, 캐시를 수동으로 업데이트

    if (newData) {
      // 네트워크 요청이 성공했을 때만
      queryClient.setQueryData(topicSetQueryKey, newData);
    } // 6. 셔플 로딩 상태를 false로 설정

    setIsShuffling(false);
  }, [topics, queryClient, topicSetQueryKey]);

  const listData = useMemo(() => {
    if (!topics) return [];
    return [...topics, { id: "cta", isCTA: true }];
  }, [topics]);

  // 모달 표시 핸들러, 처음 접속 시 모달 표시
  useEffect(() => {
    if (!userId) return; // 로그인 전이면 스킵
    const key = `guide_shown_v1:${userId}`;
    (async () => {
      const seen = await AsyncStorage.getItem(key);
      if (!seen) setIsVisible(true); // 처음이면 모달 표시
    })();
  }, [userId]);

  // 모달 닫기 핸들러
  const handleCloseGuide = async () => {
    setIsVisible(false);
    const key = `guide_shown_v1:${userId}`;
    await AsyncStorage.setItem(key, "1");
  };

  const isTotalLoading = isFetching || isShuffling;
  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 10 }}>
        <AppHeader hasNotification={hasUnread} />
        {!showInitSkeleton && topics && (
          <>
            <TicketsView />

            <TopicTitle
              onShuffle={onShuffle}
              loading={isTotalLoading}
              disabled={isTotalLoading}
            />
          </>
        )}
      </View>

      {showInitSkeleton ? (
        <View style={{ paddingHorizontal: 10, flex: 1 }}>
          <TopicSkeleton />
        </View>
      ) : (
        topics && (
          <>
            <View style={styles.flatListContainer}>
              <FlatList
                data={listData}
                renderItem={({ item, index }) => {
                  const isLastItem = index === listData.length - 1;

                  if (item.isCTA) {
                    return (
                      <View
                        style={{
                          width: ITEM_WIDTH,
                          marginRight: isLastItem ? 0 : ITEM_SPACING,
                        }}
                      >
                        <TopicListCTA />
                      </View>
                    );
                  }
                  return (
                    <View
                      style={{
                        width: ITEM_WIDTH,
                        marginRight: isLastItem ? 0 : ITEM_SPACING, // 마지막 아이템엔 마진 제거
                      }}
                    >
                      <TopicCard
                        item={item}
                        // isFetching 대신 isTotalLoading 전달
                        loading={isTotalLoading}
                        isActive={index === currentIndex}
                      />
                    </View>
                  );
                }}
                keyExtractor={(item: any) => item.id.toString()}
                horizontal
                pagingEnabled={false}
                showsHorizontalScrollIndicator={false}
                bounces={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                snapToInterval={ITEM_WIDTH + ITEM_SPACING}
                snapToAlignment="start"
                decelerationRate="fast"
                contentContainerStyle={{
                  paddingHorizontal: HORIZONTAL_PADDING, // 40px
                }}
              />
            </View>
          </>
        )
      )}
      <GuideModal isVisible={isVisible} onClose={handleCloseGuide} />
      {/* <UserBanModal isVisible={true} /> */}
    </View>
  );
};

export default TopicPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
