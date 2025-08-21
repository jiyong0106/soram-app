import { AnswerRandom } from "@/utils/types/connect";
import { StyleSheet, Text, View } from "react-native";

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
});
