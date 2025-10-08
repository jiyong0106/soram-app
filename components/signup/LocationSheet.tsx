import React, { ForwardedRef, forwardRef, useMemo } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AppBottomSheetModal from "../common/AppBottomSheetModal";
import AppText from "../common/AppText";
import { KOREA_REGIONS } from "@/utils/dummy/test";
import ScalePressable from "../common/ScalePressable";

type Props = {
  snapPoints?: ReadonlyArray<string | number>;
  onSelect?: (code: string, name: string) => void;
};

// 부모에 노출할 메서드 타입

const LocationSheet = (
  { snapPoints, onSelect }: Props,
  ref: ForwardedRef<BottomSheetModal>
) => {
  const data = useMemo(() => KOREA_REGIONS, []);
  const dismiss = () => (ref as any)?.current?.dismiss?.();

  // 부모에 노출할 API만 제한적으로 공개

  return (
    <AppBottomSheetModal ref={ref} snapPoints={snapPoints}>
      <View style={s.container}>
        {/* 헤더 */}
        <View style={s.header}>
          <AppText style={s.title}>지역 선택</AppText>
          <AppText style={s.subtitle}>거주 중인 시/도를 선택해 주세요</AppText>
        </View>

        {/* 리스트 */}
        <View style={s.listWrap}>
          <FlatList
            data={data}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <ScalePressable
                style={s.row}
                onPress={() => {
                  onSelect?.(item.code, item.name);
                  dismiss();
                }}
              >
                <AppText style={s.rowName}>{item.name}</AppText>
              </ScalePressable>
            )}
            ItemSeparatorComponent={() => <View style={s.divider} />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </AppBottomSheetModal>
  );
};

export default forwardRef(LocationSheet);

const s = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  header: { alignItems: "center", paddingVertical: 2 },
  title: { fontSize: 16, fontWeight: "bold", color: "#5C4B44" },
  subtitle: { marginTop: 4, fontSize: 12, color: "#B0A6A0" },
  listWrap: {
    marginTop: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxHeight: "80%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 8,
  },
  rowName: { color: "#5C4B44", fontSize: 14 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: "#E5E7EB" },
});
