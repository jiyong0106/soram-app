import { UserAnswerResponse, RequestConnectionBody } from "@/utils/types/topic";
import { StyleSheet, View } from "react-native";
import Button from "../common/Button";
import useAlert from "@/utils/hooks/useAlert";
import { useState } from "react";
import { postRequestConnection } from "@/utils/api/topicPageApi";
import AppText from "../common/AppText";

interface UserAnswerListProps {
  item: UserAnswerResponse;
}

const UserAnswerList = ({ item }: UserAnswerListProps) => {
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
      <AppText style={styles.nick}>{user.nickname}</AppText>
      {type === "TEXT" ? (
        <AppText style={styles.text}>{textContent}</AppText>
      ) : (
        <AppText style={styles.text}>[음성] {audioUrl}</AppText>
      )}
      <AppText style={styles.meta}>
        {new Date(createdAt).toLocaleString()}
      </AppText>
      <AppText style={styles.meta}>답변 id : {id}</AppText>
      <AppText style={styles.meta}>답변한 유저 id : {userId}</AppText>
      <AppText style={styles.meta}>이 답변의 토픽 id : {topicBoxId}</AppText>
      <View style={styles.btnWrapper}>
        <Button
          label="이사람 답변 더 보기"
          color="#ff6b6b"
          textColor="#fff"
          style={{ flex: 1 }}
        />
        <Button
          label="대화요청"
          color="#ff6b6b"
          textColor="#fff"
          style={{ flex: 1 }}
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
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
  },
  nick: {
    fontWeight: "700",
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  meta: {
    color: "#999",
    marginTop: 6,
    fontSize: 12,
  },
  btnWrapper: {
    flexDirection: "row",
    marginVertical: 10,
    gap: 10,
  },
});
