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
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState, useMemo, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
} from "react-native";
import TopicListCTA from "@/components/topic/TopicListCTA";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TopicPage = () => {
  const { showAlert } = useAlert();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

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
    enabled: false,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const showInitSkeleton = !topics && isLoading;

  const onShuffle = useCallback(async () => {
    refetch();
  }, [refetch]);

  const listData = useMemo(() => {
    if (!topics) return [];
    return [...topics, { id: "cta", isCTA: true }];
  }, [topics]);

  return (
    <View style={styles.container}>
      <AppHeader />
      {showInitSkeleton ? (
        <TopicSkeleton />
      ) : (
        topics && (
          <>
            <TicketsView />
            <TopicTitle onShuffle={onShuffle} disabled={isFetching} />
            <View style={styles.flatListContainer}>
              <FlatList
                data={listData}
                renderItem={({ item, index }) => {
                  if (item.isCTA) {
                    return (
                      <View style={{ width: SCREEN_WIDTH - 20 }}>
                        <TopicListCTA />
                      </View>
                    );
                  }
                  return (
                    <View style={{ width: SCREEN_WIDTH - 20 }}>
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
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
              />
            </View>
            <TouchableOpacity
              onPress={() => router.push("/topic/list")}
              activeOpacity={0.5}
              style={styles.moreTopic}
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
    </View>
  );
};

export default TopicPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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