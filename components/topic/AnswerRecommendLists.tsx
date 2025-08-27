import {
  StyleSheet,
  View,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AnswerRecommend } from "@/utils/types/topic"; // id, title, content 등
import useAlert from "@/utils/hooks/useAlert";
import { TextInput } from "react-native-gesture-handler";
import { postText } from "@/utils/api/topicPageApi";
import Button from "../common/Button";
import { useQueryClient } from "@tanstack/react-query";
import AppText from "../common/AppText";

interface ItemProps {
  item: AnswerRecommend;
}

const MAX_LEN = 1000;

const AnswerRecommendLists = ({ item }: ItemProps) => {
  const { id, title, content } = item;
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
      queryClient.invalidateQueries({ queryKey: ["getAnswerRandomKey"] });
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
    <View style={styles.container}>
      <AppText>{id}</AppText>
      <AppText style={styles.title}>{title}</AppText>
      <AppText style={styles.desc}>{content}</AppText>

      {/* 토글 버튼 */}
      <TouchableOpacity
        onPress={toggleInput}
        activeOpacity={0.7}
        style={styles.toggle}
      >
        <AppText style={styles.toggleText}>
          {isShow ? "입력창 숨기기 ▲" : "입력창 보이기 ▼"}
        </AppText>
      </TouchableOpacity>

      {/* 입력창 & 등록버튼: 토글 */}
      {isShow && (
        <>
          <TextInput
            style={[styles.input, focused && styles.inputFocused]}
            placeholder="예) 저는 사람들과 대화를 좋아하고 주말에는 등산을 즐겨요..."
            value={text}
            onChangeText={onChange}
            returnKeyType="default"
            autoCapitalize="sentences"
            autoCorrect
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />

          <Button
            label="답변등록"
            color="#ff6b6b"
            textColor="#fff"
            disabled={!text.trim() || loading}
            loading={loading}
            onPress={handlePress}
          />
        </>
      )}
    </View>
  );
};

export default AnswerRecommendLists;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
    gap: 8,
    backgroundColor: "#fff",
  },
  title: { fontWeight: "700", fontSize: 16 },
  desc: { color: "#666" },
  toggle: {
    paddingVertical: 8,
  },
  toggleText: {
    color: "#ff6b6b",
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderColor: "#F1C0B5",
    borderRadius: 10,
    minHeight: 100,
    padding: 10,
    backgroundColor: "#FFF",
    fontSize: 14,
    marginTop: 6,
  },
  inputFocused: { borderColor: "#ff6b6b" },
});
