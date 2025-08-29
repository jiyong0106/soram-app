import { UserAnswerResponse, RequestConnectionBody } from "@/utils/types/topic";
import { StyleSheet, View } from "react-native";
import Button from "../common/Button";
import useAlert from "@/utils/hooks/useAlert";
import { useState } from "react";
import { postRequestConnection } from "@/utils/api/topicPageApi";
import AppText from "../common/AppText";
import { useLocalSearchParams } from "expo-router";

interface UserAnswerListProps {
  item: UserAnswerResponse;
  title: string | string[];
}

const UserAnswerList = ({ item, title }: UserAnswerListProps) => {
  const {
    textContent,
    id,
    userId,
    topicBoxId,
    user,
    type,
    audioUrl,
    createdAt,
  } = item;
  const { showAlert, showActionAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  console.log(topicBoxId);
  //대화 요청하기
  const handlePress = () => {
    if (loading) return; // 중복 클릭 방지

    const body: RequestConnectionBody = {
      addresseeId: userId,
      voiceResponseId: id,
    };

    showActionAlert("대화요청 할거임?", "요청", async () => {
      try {
        setLoading(true);
        await postRequestConnection(body);
        showAlert("요청되었어요!");
      } catch (e: any) {
        const msg = e?.response?.data?.message || "요청 중 오류가 발생했어요.";
        showAlert(msg);
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* 질문 말풍선 카드 */}
      <View style={styles.titleWrapper}>
        <AppText style={styles.questionHighlight}>Q.</AppText>
        <AppText style={styles.title}>{title}</AppText>
      </View>

      <AppText style={styles.content}>
        경찰은 이들 행위에 대해 캠코더 단속, 공익신고 활성화, 암행 순찰차 증차,
        무인단속 장비 확충 등 장비와 인력을 총동원해 법규 위반 근절에 나선다.
        이미 두 달간 계도 기간을 거친 만큼 더 이상 ‘몰랐다’는 변명은 통하지
        않는다. 단속에 적발되면 위반 사항에 따라 최대 7만원의 범칙금을 내야
        하고, 버스전용차로를 위반하면 최대 30점의 벌점이 부과된다.
      </AppText>

      {/* 작성자 닉네임 (오른쪽 정렬, 서명 느낌) */}
      <AppText style={styles.nick}>– {user.nickname}</AppText>

      {/* 메타 (필요 시 표시) */}
      <AppText style={styles.meta}>
        {new Date(createdAt).toLocaleString()}
      </AppText>

      {/* 하단 버튼 */}
      <View style={styles.btnWrapper}>
        <Button
          label={`${user.nickname}님의 \n 다른 이야기 보기`}
          color="#FFFFFF"
          textColor="#9B9B9B"
          style={styles.btnOutline}
        />
        <Button
          label="대화 요청하기"
          color="#FFF5F0"
          textColor="#FF6B3E"
          style={styles.btnEmphasis}
          disabled={loading}
          onPress={handlePress}
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
    color: "#333",
  },
  questionHighlight: {
    color: "#FF6B3E",
    fontWeight: "bold",
  },

  content: {
    fontSize: 15,
    lineHeight: 22,
    color: "#3D3D3D",
  },

  nick: {
    alignSelf: "flex-end",
    marginTop: 8,
    color: "#7F7F7F",
    fontSize: 13,
    fontStyle: "italic",
  },

  meta: {
    color: "#A5A5A5",
    marginTop: 4,
    fontSize: 12,
  },

  /* 버튼 */
  btnWrapper: {
    flexDirection: "row",
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
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
