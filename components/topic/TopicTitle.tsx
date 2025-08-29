import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import AppText from "@/components/common/AppText";

type Props = {
  onShuffle: () => void;
  disabled?: boolean;
};

const TopicTitle = ({ onShuffle, disabled }: Props) => {
  return (
    <View style={styles.container}>
      <AppText style={styles.title}>오늘, 어떤 이야기를 나눠볼까요?</AppText>

      <Pressable
        onPress={onShuffle}
        disabled={disabled}
        style={styles.shuffleBtn}
        accessibilityRole="button"
        accessibilityLabel="다른 주제"
      >
        <AppText style={styles.shuffleText}>다른 주제 ↻</AppText>
      </Pressable>
    </View>
  );
};

export default TopicTitle;

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 12,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    lineHeight: 30,
  },
  shuffleBtn: {
    alignSelf: "flex-end",
    marginTop: 8,
    padding: 8,
  },
  shuffleText: {
    fontSize: 14,
    color: "#858585",
  },
});
