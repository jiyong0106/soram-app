import React, { ForwardedRef, forwardRef } from "react";
import { View, StyleSheet } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import AppBottomSheetModal from "@/components/common/AppBottomSheetModal";
import SheetRow from "@/components/common/SheetRow";
import { useRouter } from "expo-router";

interface Props {
  snapPoints?: ReadonlyArray<string | number>;
}

const COLORS = {
  bg: "#FFFFFF",
  text: "#111827", // gray-900
  sub: "#6B7280", // gray-500
  border: "#E5E7EB", // gray-200
  fill: "#F9FAFB", // gray-50
  danger: "#EF4444", // red-500
  icon: "#111827",
};

const QuestionPageSheet = (
  { snapPoints }: Props,
  ref: ForwardedRef<BottomSheetModal>
) => {
  const router = useRouter();
  const dismiss = () => (ref as any)?.current?.dismiss?.();

  const onPress = () => {
    dismiss();
    router.push("/(signup)/question/qanswer");
  };

  return (
    <AppBottomSheetModal ref={ref} snapPoints={snapPoints}>
      <View style={s.container}>
        {/* Group: 일반 */}
        <View style={s.group}>
          <SheetRow
            icon={
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color={COLORS.icon}
              />
            }
            label="첫번째 질문"
            onPress={onPress}
          />
        </View>

        {/* Group: 파괴적(빨간 아이콘으로 강조) */}
        <View style={s.group}>
          <SheetRow
            icon={
              <Ionicons
                name="close-circle-outline"
                size={18}
                color={COLORS.danger}
              />
            }
            label="두번째 질문"
          />
          <View style={s.divider} />
          <SheetRow
            icon={
              <Ionicons name="exit-outline" size={18} color={COLORS.danger} />
            }
            label="세번째 질문"
          />
        </View>

        {/* Group: 유틸 */}
        <View style={s.group}>
          <SheetRow
            icon={
              <Ionicons
                name="notifications-off-outline"
                size={18}
                color={COLORS.icon}
              />
            }
            label="네번째 질문"
          />
        </View>

        <View style={{ height: 8 }} />
      </View>
    </AppBottomSheetModal>
  );
};

export default forwardRef(QuestionPageSheet);

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: COLORS.bg,
  },
  header: {
    alignItems: "center",
    paddingTop: 4,
    paddingBottom: 12,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: COLORS.border,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.sub,
  },
  group: {
    backgroundColor: COLORS.fill,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    marginTop: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
    marginVertical: 4,
    marginLeft: 36, // 아이콘 영역만큼 들여 써서 라인이 깔끔하게 보이도록
  },
});
