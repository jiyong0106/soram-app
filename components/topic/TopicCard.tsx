import React, { memo, useCallback } from "react";
import { ImageBackground, Pressable, View, StyleSheet } from "react-native";
import AppText from "@/components/common/AppText";
import { TopicListType } from "@/utils/types/topic";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import useTicketGuard from "@/utils/hooks/useTicketGuard";

type Props = {
  item: TopicListType;
};

const TopicCard = ({ item }: Props) => {
  const router = useRouter();
  const { title, content, id, userCount } = item;

  const ensureNewResponse = useTicketGuard("NEW_RESPONSE", {
    onInsufficient: () => console.log("재화가 부족해서 충전해야합니다"),
    optimistic: true,
  });

  const handlePress = () => {
    ensureNewResponse.ensure(() => {
      router.push({
        pathname: "/topic/[topicId]",
        params: { topicId: id, title },
      });
    });
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/1.jpg")}
        style={styles.image}
      >
        <View style={styles.textWrapper}>
          <AppText style={styles.cardTitle}>{title}</AppText>

          <AppText style={styles.cardSub}>{content}</AppText>

          <View style={styles.touch}>
            <AppText style={styles.participants}>눌러서 이야기 듣기</AppText>
            <MaterialIcons name="touch-app" size={24} color="white" />
          </View>
          <AppText style={styles.participants}>
            💬 {userCount}명이 이야기하고 있어요
          </AppText>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default memo(TopicCard);
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  image: {
    height: 420,
    borderRadius: 24,
    overflow: "hidden",
  },
  textWrapper: {
    padding: 20,
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 28,
    lineHeight: 36,
    color: "#fff",
    fontWeight: "bold",
  },
  cardSub: {
    marginTop: 16,
    fontSize: 18,
    color: "#fff",
    lineHeight: 25,
  },
  participants: {
    marginTop: 16,
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
  touch: {
    flexDirection: "row",
    alignItems: "center",
  },
});
