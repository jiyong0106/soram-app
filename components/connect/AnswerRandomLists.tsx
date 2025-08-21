import { AnswerRandom } from "@/utils/types/connect";
import { StyleSheet, Text, View } from "react-native";
import Button from "../common/Button";

interface AnswerRandomListsProps {
  item: AnswerRandom;
}

const AnswerRandomLists = ({ item }: AnswerRandomListsProps) => {
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
  return (
    <View style={styles.card}>
      <Text style={styles.nick}>{user.nickname}</Text>
      {type === "TEXT" ? (
        <Text style={styles.text}>{textContent}</Text>
      ) : (
        <Text style={styles.text}>[음성] {audioUrl}</Text>
      )}
      <Text style={styles.meta}>{new Date(createdAt).toLocaleString()}</Text>
      <Text style={styles.meta}>답변 id : {id}</Text>
      <Text style={styles.meta}>답변한 유저 id : {userId}</Text>
      <Text style={styles.meta}>이 답변의 토픽 id : {topicBoxId}</Text>
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
        />
      </View>
    </View>
  );
};

export default AnswerRandomLists;

const styles = StyleSheet.create({
  card: {
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
