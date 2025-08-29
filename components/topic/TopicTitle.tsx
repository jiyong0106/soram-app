import { Pressable, View, StyleSheet, Animated, Easing } from "react-native";
import AppText from "@/components/common/AppText";
import { Ionicons } from "@expo/vector-icons";
import Spin from "../common/Spin";

type Props = {
  onShuffle: () => void;
  disabled?: boolean;
  loading?: boolean;
};

const TopicTitle = ({ onShuffle, disabled, loading }: Props) => {
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
        {loading ? (
          <Spin active duration={800}>
            <Ionicons name="reload" size={16} color="#FF6B3E" />
          </Spin>
        ) : (
          <>
            <AppText style={styles.shuffleText}>다른 주제</AppText>
            <Ionicons name="reload" size={15} color="#8E8E8E" />
          </>
        )}
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
    flexDirection: "row",
    gap: 3,
  },
  shuffleText: {
    fontSize: 14,
    color: "#858585",
  },
});
