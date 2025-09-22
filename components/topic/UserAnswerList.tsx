import { UserAnswerResponse, RequestConnectionBody } from "@/utils/types/topic";
import { StyleSheet, View } from "react-native";
import Button from "../common/Button";
import useAlert from "@/utils/hooks/useAlert";
import { useState } from "react";
import { postRequestConnection } from "@/utils/api/topicPageApi";
import AppText from "../common/AppText";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

interface UserAnswerListProps {
  item: UserAnswerResponse;
  title: string | string[];
}

const UserAnswerList = ({ item, title }: UserAnswerListProps) => {
  const { textContent, id, userId, user, createdAt, topicBoxId } = item;
  const { showAlert, showActionAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  //대화 요청하기
  const handlePress = () => {
    if (loading) return; // 중복 클릭 방지

    const body: RequestConnectionBody = {
      addresseeId: userId,
      voiceResponseId: id,
    };

    showActionAlert(
      `대화 요청을 할까요?\n(대화 요청권 1개가 사용됩니다)`,
      "요청",
      async () => {
        try {
          setLoading(true);
          await postRequestConnection(body);
          showAlert(`대화 요청 완료! \n 상대방이 수락하면 알림을 보내드릴게요`);
          queryClient.invalidateQueries({
            queryKey: ["getSentConnectionsKey"],
          });
        } catch (e: any) {
          const msg =
            e?.response?.data?.message || "요청 중 오류가 발생했어요.";
          showAlert(msg, () => {
            if (e.response.data.statusCode === 403) {
              router.push({
                pathname: "/topic/list/[listId]",
                params: { listId: String(topicBoxId), error: "forbidden" },
              });
              return;
            }
          });
        } finally {
          setLoading(false);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      {/* 질문 말풍선 카드 */}
      <View style={styles.titleWrapper}>
        <AppText style={styles.questionHighlight}>Q.</AppText>
        <AppText style={styles.title}>{title}</AppText>
      </View>

      <AppText style={styles.content}>{textContent}</AppText>

      {/* 작성자 닉네임 (오른쪽 정렬, 서명 느낌) */}
      <AppText style={styles.nick}>- {user.nickname}</AppText>

      {/* 메타 (필요 시 표시) */}
      <AppText style={styles.meta}>
        {new Date(createdAt).toLocaleDateString()}
      </AppText>

      {/* 하단 버튼 */}
      <View style={styles.btnWrapper}>
        <Button
          label="대화 요청하기"
          color="#FFF5F0"
          textColor="#FF6B3E"
          style={styles.btnEmphasis}
          disabled={loading}
          onPress={handlePress}
        />
        <Button
          label={`${user.nickname}님의 \n 다른 이야기 보기`}
          color="#FFFFFF"
          textColor="#B0A6A0"
          style={styles.btnOutline}
        />
      </View>
    </View>
  );
};

export default UserAnswerList;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    // 카드 그림자
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  /* 질문 말풍선 */
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    // 말풍선도 살짝 그림자
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 22,
    color: "#5C4B44",
  },
  questionHighlight: {
    color: "#FF6B3E",
    fontWeight: "bold",
  },

  content: {
    fontSize: 15,
    lineHeight: 22,
    color: "#5C4B44",
  },

  nick: {
    alignSelf: "flex-end",
    marginTop: 8,
    color: "#5C4B44",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "italic",
  },

  meta: {
    color: "#B0A6A0",
    marginTop: 4,
    fontSize: 12,
  },

  /* 버튼 */
  btnWrapper: {
    // flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },
  btnOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    height: "auto",
    minHeight: 60,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  btnEmphasis: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#FF6B3E",
    backgroundColor: "#FFF5F0",
    borderRadius: 12,
    height: "auto",
    minHeight: 60,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
