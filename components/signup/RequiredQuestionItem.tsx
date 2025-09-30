import { useRouter } from "expo-router";
import QuestionTile from "./QuestionTile";
import { useSignupDraftStore } from "@/utils/store/useSignupDraftStore";

interface Props {
  label: string;
  questionId?: number; // 한글 주석: 필수 질문 번호(동적 데이터 기반)
}
const RequiredQuestionItem = ({ label, questionId = 1 }: Props) => {
  const router = useRouter();
  const hasAnswer = useSignupDraftStore(
    (s) =>
      !!s.draft.answers
        .find((a) => a.questionId === questionId)
        ?.content?.trim()
  );

  const onPress = () => {
    router.push({
      pathname: "/(signup)/question/qanswer",
      params: {
        label,
        variant: "required",
        questionId,
      },
    });
  };
  return (
    <QuestionTile
      variant="required"
      label={label}
      checked={hasAnswer}
      onPress={onPress}
    />
  );
};

export default RequiredQuestionItem;
