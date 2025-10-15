import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import AppText from "@/components/common/AppText";
// 변경점: ScalePressable import 제거

// 변경점: onTitlePress를 props에서 제거
type Props = {
  title: string;
  expanded: boolean;
};

// 변경점: onTitlePress를 props에서 제거
const ChatTriggerHeader = ({ title, expanded }: Props) => {
  // 변경점: ScalePressable을 일반 View로 변경
  return (
    <View style={s.header}>
      <Feather name="link" size={14} color="#5C4B44" />

      <AppText style={s.headerText}>{title}</AppText>
      <View>
        {expanded ? (
          <Ionicons name="chevron-up-outline" size={20} color="#FF7D4A" />
        ) : (
          <Ionicons name="chevron-down-outline" size={20} color="#FF7D4A" />
        )}
      </View>
    </View>
  );
};

export default ChatTriggerHeader;

// 변경점: 스타일 객체는 그대로 유지됩니다.
// 부모 컴포넌트의 overflow: 'hidden'에 의해 모서리가 예쁘게 잘리므로,
// 이 컴포넌트에서 직접 모서리를 제어할 필요가 없어졌습니다.
const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    gap: 4,
  },
  headerText: { color: "#5C4B44" },
});
