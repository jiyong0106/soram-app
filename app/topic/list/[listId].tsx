import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import PageContainer from "@/components/common/PageContainer";
import { BackButton } from "@/components/common/backbutton";
import AppText from "@/components/common/AppText";
import QuestionHeader from "@/components/topic/QuestionHeader";
import ProgressFooter from "@/components/topic/ProgressFooter";
import useSafeArea from "@/utils/hooks/useSafeArea";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { useForm, Controller } from "react-hook-form";
import { postText } from "@/utils/api/topicPageApi";
import useAlert from "@/utils/hooks/useAlert";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const MAX = 2000;

type Form = { content: string };

const TopicListIdPage = () => {
  const { listId } = useLocalSearchParams();
  const topicBoxId = Number(listId);
  const { bottom } = useSafeArea();
  const { showAlert } = useAlert();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm<Form>({
    defaultValues: { content: "" },
    mode: "onChange",
  });

  const content = watch("content", "");

  const onSubmit = async ({ content }: Form) => {
    const text = (content ?? "").trim();
    if (!text) {
      showAlert("내용을 입력해 주세요.");
      return;
    }

    try {
      await postText({ topicBoxId, textContent: text });
      showAlert("답변이 등록되었어요.", () => {
        reset({ content: "" });
        router.dismissTo("/(tabs)/topic/list");
      });
    } catch (e: any) {
      if (e) {
        showAlert(e.response.data.message);
        return;
      }
    }
  };

  return (
    <PageContainer edges={[]} padded={false}>
      <Stack.Screen
        options={{
          title: "",
          headerLeft: () => <BackButton />,
          headerRight: () => (
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              activeOpacity={0.7}
              disabled={!isValid || isSubmitting}
            >
              <AppText
                style={{
                  fontWeight: "bold",
                  opacity: !isValid || isSubmitting ? 0.4 : 1,
                }}
              >
                {isSubmitting ? <LoadingSpinner /> : "완료"}
              </AppText>
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.container}>
        <ScrollView
          style={{ backgroundColor: "#fff" }}
          keyboardDismissMode="interactive"
          contentContainerStyle={{ padding: 10, paddingBottom: 80 }}
          automaticallyAdjustKeyboardInsets
        >
          <QuestionHeader topicBoxId={topicBoxId} />

          <Controller
            control={control}
            name="content"
            rules={{
              required: "내용을 입력해 주세요.",
              maxLength: {
                value: MAX,
                message: `${MAX}자 이내로 입력해 주세요.`,
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                multiline
                placeholder="부적절하거나 불쾌감을 줄 수 있는 컨텐츠는 제재를 받을 수 있습니다"
                placeholderTextColor="#888888"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                maxLength={MAX}
                textAlignVertical="top"
                autoCorrect={false}
                autoCapitalize="none"
              />
            )}
          />
        </ScrollView>

        <KeyboardStickyView offset={{ closed: 0, opened: bottom }}>
          <ProgressFooter length={content.length} max={MAX} />
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
    minHeight: 200,
    fontSize: 16,
    textAlignVertical: "top",
    padding: 10,
  },
});
