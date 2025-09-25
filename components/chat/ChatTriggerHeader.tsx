import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "@/components/common/AppText";

type Props = {
  title: string;
  expanded: boolean;
  onToggle: () => void;
};

const ChatTriggerHeader = ({ title, expanded, onToggle }: Props) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onToggle} style={s.header}>
      <Ionicons name="link-outline" size={24} color="black" />
      <AppText style={s.headerText}>{title}</AppText>
      <View>
        {expanded ? (
          <Ionicons name="chevron-down-outline" size={24} color="#9CA3AF" />
        ) : (
          <Ionicons name="chevron-up-outline" size={24} color="#9CA3AF" />
        )}
      </View>
    </TouchableOpacity>
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
