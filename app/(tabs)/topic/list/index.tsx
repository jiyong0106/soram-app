import { Keyboard, StyleSheet, View } from "react-native";
import TopTabBar from "@/components/common/TopTabBar";
import { CATEGORIES, RouteType, SortByType } from "@/utils/types/topic";
import { useCallback, useMemo, useRef, useState } from "react";
import TopicSection from "@/components/topic/TopicSection";
import SortSheet from "@/components/common/SortSheet";
import { BackButton } from "@/components/common/backbutton";
import { Stack } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AppText from "@/components/common/AppText";
import ScalePressable from "@/components/common/ScalePressable";
import Ionicons from "@expo/vector-icons/Ionicons";
import SearchBar from "@/components/common/SearchBar";
import useDebounce from "@/utils/hooks/useDebounce";

const TopicListPage = () => {
  const sortSheetRef = useRef<BottomSheetModal>(null);
  const [sortBy, setSortBy] = useState<SortByType>("popular");
  const [searchName, setSearchName] = useState("");
  const debouncedSearchName = useDebounce(searchName, 500);
  const routes: RouteType[] = useMemo(
    () => CATEGORIES.map((c) => ({ key: c, label: c })),
    []
  );

  const renderScene = useCallback(
    ({ route }: { route: RouteType }) => {
      return (
        <TopicSection
          category={route.key}
          sortBy={sortBy}
          debouncedSearchName={debouncedSearchName}
        />
      );
    },
    [sortBy, debouncedSearchName]
  );

  const handleSort = () => {
    Keyboard.dismiss();

    setTimeout(() => {
      sortSheetRef.current?.present?.();
    }, 120);
  };
  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          title: "",
          headerTitle: () => <SearchBar onChangeText={setSearchName} />,
          headerLeft: () => <BackButton />,
          headerRight: () => (
            <View>
              <ScalePressable onPress={handleSort} style={styles.sortButton}>
                <Ionicons name="chevron-down" size={20} color="#FF6B3E" />
                <AppText style={styles.sortText}>
                  {sortBy === "popular" ? "인기순" : "최신순"}
                </AppText>
              </ScalePressable>
            </View>
          ),
        }}
      />
      <View style={styles.container}>
        <TopTabBar routes={routes} renderScene={renderScene} />
      </View>
      <SortSheet ref={sortSheetRef} sortBy={sortBy} setSortBy={setSortBy} />
    </>
  );
};

export default TopicListPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  sortText: {
    fontSize: 12,
    color: "#FF6B3E",
  },
});
