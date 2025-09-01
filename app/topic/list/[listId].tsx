import React, { useState } from "react";
import { StyleSheet, TextInput, View, ScrollView } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import PageContainer from "@/components/common/PageContainer";
import { BackButton } from "@/components/common/backbutton";
import AppText from "@/components/common/AppText";
import QuestionHeader from "@/components/topic/QuestionHeader";
import ProgressFooter from "@/components/topic/ProgressFooter";
import useSafeArea from "@/utils/hooks/useSafeArea";
import { KeyboardStickyView } from "react-native-keyboard-controller";

const MAX = 1000;

const TopicListIdPage = () => {
  const { listId } = useLocalSearchParams();
  const [answer, setAnswer] = useState("");
  const { bottom } = useSafeArea();

  return (
    <PageContainer edges={[]} padded={false}>
      <Stack.Screen
        options={{
          title: String(listId),
          headerLeft: () => <BackButton />,
          headerRight: () => (
            <AppText style={{ fontWeight: "bold" }}>완료</AppText>
          ),
        }}
      />

      <View style={styles.container}>
        <ScrollView
          style={{ backgroundColor: "red" }}
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ padding: 10 }}
        >
          <QuestionHeader
            title="반점을 발현시키는 방법에 대해 아시나요?"
            subSteps={[
              "어떤 주와 같이 전투를 하고 싶나요?",
              "가장 보고싶은 오니는 누구인가요?",
              "무잔을 만나면 도망치시나요?",
            ]}
            activeIndex={2}
          />
          <TextInput
            value={answer}
            onChangeText={setAnswer}
            placeholder="여기에 답변을 입력하세요"
            multiline
            style={styles.input}
            scrollEnabled={false}
          />
        </ScrollView>

        <KeyboardStickyView offset={{ closed: 0, opened: bottom }}>
          <ProgressFooter
            length={answer.length}
            max={MAX}
            progress={answer.length / MAX}
          />
        </KeyboardStickyView>
      </View>
    </PageContainer>
  );
};
export default TopicListIdPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    // flex: 1,
    fontSize: 16,
    textAlignVertical: "top",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 16,
    marginTop: 12,
  },
});
