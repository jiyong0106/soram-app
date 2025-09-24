// 기존 [listId].tsx 코드를 기반으로 아래와 같이 수정합니다.

import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect } from "react";
import {
  Stack,
  useLocalSearchParams,
  useRouter,
  useNavigation,
} from "expo-router";
import PageContainer from "@/components/common/PageContainer";
import { BackButton } from "@/components/common/backbutton";
import AppText from "@/components/common/AppText";
import QuestionHeader from "@/components/topic/QuestionHeader";
import ProgressFooter from "@/components/topic/ProgressFooter";
import useSafeArea from "@/utils/hooks/useSafeArea";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { useForm, Controller } from "react-hook-form";
import { updateTextResponse } from "@/utils/api/profilePageApi";
import useAlert from "@/utils/hooks/useAlert";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { NavigationProp } from "@react-navigation/native";

const MAX = 2000;

type Form = { content: string };

// 컴포넌트 이름을 역할에 맞게 변경합니다.
const EditMyResponsePage = () => {
  // 1. 파라미터 가져오기
  // id는 수정할 답변의 ID, topicId와 initialContent는 이전 페이지에서 넘겨받은 값입니다.
  const { id, topicId, initialContent } = useLocalSearchParams<{
    id: string;
    topicId: string;
    initialContent: string;
  }>();
  const responseId = Number(id); // 수정할 답변 ID
  const topicBoxId = Number(topicId); // 질문 헤더를 위한 주제 ID

  const { bottom } = useSafeArea();
  const { showAlert, showActionAlert } = useAlert();
  const router = useRouter();
  const navigation = useNavigation<NavigationProp<any>>();

  const {
    control,
    handleSubmit,
    watch,
    // 1. isDirty를 formState에서 가져옵니다. 사용자가 폼을 수정했는지 여부를 알려줍니다.
    formState: { isSubmitting, isValid, isDirty },
  } = useForm<Form>({
    defaultValues: { content: initialContent || "" },
    mode: "onChange",
  });

  const content = watch("content", "");
  const onSubmit = async ({ content }: Form) => {
    const text = (content ?? "").trim();
    if (!text) {
      showAlert("내용을 입력해 주세요.");
      return;
    }
    if (text.length < 20) {
      showAlert("최소 20자 이상 입력해 주세요.");
      return;
    }
    try {
      // 새로 만들 API 함수를 호출합니다.
      await updateTextResponse({ responseId, textContent: text });
      showAlert("수정이 완료되었습니다.", () => {
        if (router.canGoBack()) {
          router.back();
        }
      });
    } catch (e: any) {
      if (e?.response?.data?.message) {
        showAlert(e.response.data.message);
      } else {
        showAlert("수정 중 오류가 발생했습니다.");
      }
    }
  };

  // 2. 뒤로가기 이벤트 처리를 위한 useEffect 추가
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      // isDirty가 false이거나, 제출 중일 때는 아무것도 하지 않고 뒤로가기를 허용합니다.
      if (!isDirty || isSubmitting) {
        return;
      }

      // 기본 뒤로가기 동작을 막습니다.
      e.preventDefault();

      // 사용자에게 확인 창을 띄웁니다.
      showActionAlert(
        // 1번째 인자 (message: string)
        "수정 화면에서 나가시겠어요?\n\n변경하신 내용은 저장되지 않아요.",
        // 2번째 인자 (actionText: string)
        "나가기",
        // 3번째 인자 (onAction: () => void)
        () => navigation.dispatch(e.data.action)
      );
    });

    return unsubscribe;
  }, [navigation, isDirty, isSubmitting, showActionAlert]);

  return (
    <PageContainer edges={[]} padded={false}>
      {/* --- 👇 [추가] 이 부분을 추가하면 됩니다 --- */}
      <Stack.Screen
        options={{
          title: "수정하기",
          headerShown: true, // 헤더를 보이도록 설정
          headerBackVisible: false, // 기본 뒤로가기 버튼 숨김
          headerLeft: () => <BackButton />, // 커스텀 백 버튼 사용
          headerRight: () => (
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              activeOpacity={0.7}
              disabled={!isValid || isSubmitting}
            >
              <AppText
                style={{
                  fontWeight: "bold",
                  color: "#000", // 텍스트 색상을 명확하게 지정
                  opacity: !isValid || isSubmitting ? 0.4 : 1,
                }}
              >
                {isSubmitting ? <LoadingSpinner /> : "완료"}
              </AppText>
            </TouchableOpacity>
          ),
          gestureEnabled: false,
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={{ backgroundColor: "#fff" }}
          keyboardDismissMode="interactive"
          contentContainerStyle={{ padding: 10, paddingBottom: 80 }}
          automaticallyAdjustKeyboardInsets
        >
          {/* 5. QuestionHeader에 topicBoxId 전달 */}
          <QuestionHeader topicBoxId={topicBoxId} />

          <Controller
            control={control}
            name="content"
            rules={{
              required: "내용을 입력해 주세요.",
              minLength: {
                value: 20,
                message: `20자 이상 입력해 주세요.`,
              },
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
                placeholderTextColor="#B0A6A0"
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
export default EditMyResponsePage; // 컴포넌트 이름 변경

// styles는 기존과 동일하게 유지
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
