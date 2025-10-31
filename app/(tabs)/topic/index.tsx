import AppHeader from "@/components/common/AppHeader";
import AppText from "@/components/common/AppText";
import TopicSkeleton from "@/components/skeleton/TopicSkeleton";
import TicketsView from "@/components/topic/TicketsView";
import TopicCard from "@/components/topic/TopicCard";
import TopicTitle from "@/components/topic/TopicTitle";
import { getRandomTopicSet } from "@/utils/api/topicPageApi";
import useAlert from "@/utils/hooks/useAlert";
import { Ionicons } from "@expo/vector-icons";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useState, useMemo, useRef, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
} from "react-native";
import TopicListCTA from "@/components/topic/TopicListCTA";
import GuideModal from "@/components/common/GuideModal";
import { getUserIdFromJWT } from "@/utils/util/getUserIdFromJWT";
import { useAuthStore } from "@/utils/store/useAuthStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["getTopicSetKey"],
    queryFn: () => getRandomTopicSet(),
    placeholderData: keepPreviousData,
  });

  const showInitSkeleton = !topics && isLoading;

  const onShuffle = useCallback(async () => {
    refetch();
  }, [refetch]);

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

  return (
    // [1. container에서는 padding: 10 제거 (디버그용 blue 유지)
    <View style={styles.container}>
      {/*
        FlatList를 제외한 상단 컨텐츠(헤더, 티켓, 타이틀)를
        paddingHorizontal: 10을 가진 View로 감쌉니다.
      */}
      <View style={{ paddingHorizontal: 10 }}>
        <AppHeader />
        {!showInitSkeleton && topics && (
          <>
            <TicketsView />
            <TopicTitle onShuffle={onShuffle} disabled={isFetching} />
          </>
        )}
      </View>

      {/* 3. 메인 컨텐츠 (스켈레톤 또는 FlatList) */}
      {showInitSkeleton ? (
        //  스켈레톤에도 동일하게 내부 패딩 10px 적용
        <View style={{ paddingHorizontal: 10, flex: 1 }}>
          <TopicSkeleton />
        </View>
      ) : (
        topics && (
          <>
            {/* 
              FlatList 컨테이너(red)는 화면 전체 너비를 사용합니다. (패딩 없음)
              그래야 내부의 contentContainerStyle이 정확히 동작합니다.
            */}
            <View style={styles.flatListContainer}>
              <FlatList
                data={listData}
                renderItem={({ item, index }) => {
                  const isLastItem = index === listData.length - 1;

                  if (item.isCTA) {
                    return (
                      //  CTA 카드에도 동일한 스타일링 적용
                      <View
                        style={{
                          width: ITEM_WIDTH,
                          marginRight: isLastItem ? 0 : ITEM_SPACING, // 마지막 아이템엔 마진 제거
                        }}
                      >
                        <TopicListCTA />
                      </View>
                    );
                  }
                  return (
                    //  너비와 간격 스타일 적용
                    <View
                      style={{
                        width: ITEM_WIDTH,
                        marginRight: isLastItem ? 0 : ITEM_SPACING, // 마지막 아이템엔 마진 제거
                      }}
                    >
                      <TopicCard
                        item={item}
                        loading={isFetching}
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

            {/*
              하단 '더보기' 버튼에도 동일하게
              paddingHorizontal: 10을 적용합니다.
            */}
            <TouchableOpacity
              onPress={() => router.push("/topic/list")}
              activeOpacity={0.5}
              //  styles.moreTopic과 함께 내부 패딩 10px 적용
              style={[styles.moreTopic, { paddingHorizontal: 10 }]}
            >
              <AppText style={styles.moreTopicText}>
                더 다양한 주제 보러가기
              </AppText>
              <Ionicons
                name="chevron-forward-outline"
                size={14}
                color="#5C4B44"
              />
            </TouchableOpacity>
          </>
        )
      )}
      <GuideModal isVisible={isVisible} onClose={handleCloseGuide} />
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
  wrap: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  moreTopic: {
    alignSelf: "center",
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  moreTopicText: {
    fontSize: 14,
    color: "#5C4B44",
  },
});
