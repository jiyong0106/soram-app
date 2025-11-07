import React, { ForwardedRef, forwardRef } from "react";
import { View, StyleSheet } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import AppBottomSheetModal from "@/components/common/AppBottomSheetModal";
import SheetRow from "@/components/common/SheetRow";
import useAlert from "@/utils/hooks/useAlert";
import { useRouter } from "expo-router";
import { postHideContent } from "@/utils/api/topicPageApi";

interface Props {
  snapPoints?: ReadonlyArray<string | number>;
  entityId: string;
}

const COLORS = {
  bg: "#FFFFFF",
  text: "#111827", // gray-900
  sub: "#6B7280", // gray-500
  border: "#E5E7EB", // gray-200
  fill: "#F9FAFB", // gray-50
  danger: "#EF4444", // red-500
  icon: "#5C4B44",
};

const TopickActionSheet = (
  { snapPoints, entityId }: Props,
  ref: ForwardedRef<BottomSheetModal>
) => {
  const { showAlert, showActionAlert } = useAlert();
  const router = useRouter();
  const dismiss = () => (ref as any)?.current?.dismiss?.();
  const onHide = () => {
    dismiss();
    showActionAlert(
      "해당 이야기를 숨기시겠어요? \n\n숨긴 이야기는 다시 볼 수 없어요.",
      "숨기기",
      async () => {
        try {
          await postHideContent({
            entityId: entityId,
            entityType: "VOICE_RESPONSE",
          });
          router.back();
        } catch (e: any) {
          if (e) {
            showAlert(e.response.data.message);
            return;
          }
        } finally {
          dismiss();
        }
      }
    );
  };

  return (
    <AppBottomSheetModal ref={ref} snapPoints={snapPoints}>
      <View style={s.container}>
        <View style={s.group}>
          <SheetRow
            icon={
              <Ionicons
                name="eye-off-outline"
                size={18}
                color={COLORS.danger}
              />
            }
            label="컨텐츠 숨기기"
            onPress={onHide}
            labelStyle={{ color: COLORS.danger }}
          />
        </View>
        <View style={{ height: 8 }} />
      </View>
    </AppBottomSheetModal>
  );
};

export default forwardRef(TopickActionSheet);

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
