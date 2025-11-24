import React, { ForwardedRef, forwardRef } from "react";
import { View, StyleSheet, InteractionManager } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AppBottomSheetModal from "@/components/common/AppBottomSheetModal";
import ScalePressable from "./ScalePressable";
import AppText from "./AppText";
import { SortByType } from "@/utils/types/topic";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
  snapPoints?: ReadonlyArray<string | number>;
  setSortBy: React.Dispatch<React.SetStateAction<SortByType>>;
  sortBy: SortByType;
}

const SORT_METHODS: { label: string; value: SortByType }[] = [
  {
    label: "인기순",
    value: "popular",
  },
  {
    label: "최신순",
    value: "latest",
  },
];

const SortSheet = (
  { snapPoints, setSortBy, sortBy }: Props,
  ref: ForwardedRef<BottomSheetModal>
) => {
  const dismiss = () => (ref as any)?.current?.dismiss?.();

  //여기서
  const handleSort = (value: SortByType) => {
    if (sortBy === value) {
      dismiss();
      return;
    }
    setSortBy(value);
    dismiss();
  };

  return (
    <AppBottomSheetModal ref={ref} snapPoints={snapPoints}>
      <View style={styles.container}>
        <AppText style={styles.title}>주제 정렬</AppText>
        <View style={styles.sortButtons}>
          {SORT_METHODS.map((method) => (
            <ScalePressable
              onPress={() => handleSort(method.value)}
              style={[
                styles.sortButton,
                sortBy === method.value && styles.activeSortButton,
              ]}
              key={method.value}
            >
              {/* 라벨 */}
              <AppText
                style={[
                  styles.sortText,
                  sortBy === method.value && styles.activeSortText,
                ]}
              >
                {method.label}
              </AppText>
              {/* 라디오 버튼 */}
              <View
                style={[
                  styles.radio,
                  sortBy === method.value && styles.radioChecked,
                ]}
              >
                {sortBy === method.value && (
                  <Ionicons name="checkmark" size={20} color="#FF7D4A" />
                )}
              </View>
            </ScalePressable>
          ))}
        </View>
      </View>
    </AppBottomSheetModal>
  );
};

export default forwardRef(SortSheet);

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5C4B44",
    textAlign: "center",
    marginBottom: 30,
  },
  sortButtons: {
    gap: 5,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    justifyContent: "space-between",
  },
  sortText: {
    fontSize: 14,
    color: "#858585",
  },
  activeSortButton: {
    borderColor: "#FF6B3E",
    borderWidth: 1.5,
  },
  activeSortText: {
    color: "#FF6B3E",
    fontWeight: "bold",
  },
  radio: {
    width: 25,
    height: 25,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#DADADA",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  radioChecked: {
    borderColor: "#FF7D4A",
    backgroundColor: "#fff",
  },
});
