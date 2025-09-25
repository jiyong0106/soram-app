import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "@/components/common/AppText";
import ScalePressable from "../common/ScalePressable";

type Props = {
  title: string;
  expanded: boolean;
  onTitlePress: () => void; // 탭 접기/펼치기
};

const ChatTriggerHeader = ({ title, expanded, onTitlePress }: Props) => {
  return (
    <ScalePressable style={s.header} onPress={onTitlePress}>
      <Ionicons name="link-outline" size={24} color="black" />

      <AppText style={s.headerText}>{title}</AppText>
      <View>
        {expanded ? (
          <Ionicons name="chevron-down-outline" size={24} color="#9CA3AF" />
        ) : (
          <Ionicons name="chevron-up-outline" size={24} color="#9CA3AF" />
        )}
      </View>
    </ScalePressable>
  );
};

export default ChatTriggerHeader;

const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB",
    gap: 4,
  },
  headerText: { fontWeight: "700", color: "#374151" },
});
