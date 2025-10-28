import AppText from "@/components/common/AppText";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { scale } from "react-native-size-matters";

const TopicListCTA = () => {
  const router = useRouter();

  const goToTopicList = () => {
    router.push("/topic/list");
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={goToTopicList}
      activeOpacity={0.7}
    >
      <View style={styles.textContainer}>
        <AppText style={styles.title}>더 많은 주제를</AppText>
        <AppText style={styles.title}>둘러볼까요?</AppText>
      </View>
      <View style={styles.iconContainer}>
        <Ionicons name="arrow-forward" size={scale(30)} color="#FF7D4A" />
      </View>
    </TouchableOpacity>
  );
};

export default TopicListCTA;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF3EC",
    borderRadius: 20,
    padding: scale(24),
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 3 / 4,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#FFB591",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: scale(20),
  },
  title: {
    fontSize: scale(16),
    // fontWeight: "bold",
    color: "#5C4B44",
    lineHeight: scale(30),
  },
  iconContainer: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: scale(15),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
