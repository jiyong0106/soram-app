import {
  StyleSheet,
  View,
  LayoutAnimation,
  Platform,
  UIManager,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TopicListType } from "@/utils/types/topic"; // id, title, content 등
import useAlert from "@/utils/hooks/useAlert";
import { postText } from "@/utils/api/topicPageApi";
import { useQueryClient } from "@tanstack/react-query";
import AppText from "../common/AppText";
import { Ionicons } from "@expo/vector-icons";

interface ItemProps {
  item: TopicListType;
}

const MAX_LEN = 1000;

const TopicSectionLists = ({ item }: ItemProps) => {
  const { id, title, content, category } = item;
  const { showAlert } = useAlert();

  const [focused, setFocused] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const queryClient = useQueryClient();

  // Android에서 LayoutAnimation 활성화
  useEffect(() => {
    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const onChange = (t: string) => {
    const safe = Array.from(t).slice(0, MAX_LEN).join("");
    setText(safe);
  };

  const toggleInput = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsShow((prev) => !prev);
  };

  const handlePress = async () => {
    if (!text.trim()) {
      showAlert("내용을 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      const body = { topicId: id, textContent: text.trim() };
      await postText(body);
      showAlert("등록되었습니다.");
      setText("");
      // 필요 시 refetch/invalidate 등
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? "등록 중 오류가 발생했습니다.";
      showAlert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.5}>
      <View style={styles.categoryWrapper}>
        <AppText style={styles.category}># {category}</AppText>
        <Ionicons name="chevron-forward-outline" size={20} color="black" />
      </View>
      <View style={styles.titleWrapper}>
        <AppText style={styles.questionHighlight}>Q.</AppText>
        <AppText style={styles.title}>{title}</AppText>
      </View>
      <AppText style={styles.desc}>{content}</AppText>
      <AppText style={styles.participants}>💬 36명이 이야기하고 있어요</AppText>
    </TouchableOpacity>
  );
};

export default TopicSectionLists;
const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    // 카드 그림자
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2, // 안드로이드 그림자
    gap: 10,
    marginHorizontal: 10,
  },
  categoryWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 22,
    color: "#333",
  },
  desc: {
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
  },
  participants: {
    marginTop: 12,
    fontSize: 13,
    color: "#999",
  },
  category: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#888",
  },

  questionHighlight: {
    color: "#FF6B3E",
    fontWeight: "bold",
  },
});
