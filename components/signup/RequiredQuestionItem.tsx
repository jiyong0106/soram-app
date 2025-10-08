import { useRouter } from "expo-router";
import QuestionTile from "./QuestionTile";
import { useSignupDraftStore } from "@/utils/store/useSignupDraftStore";
import { getProfileQuestionsResponse } from "@/utils/types/signup";

interface Props {
  item: getProfileQuestionsResponse;
}
const RequiredQuestionItem = ({ item }: Props) => {
  const { id, content, subQuestions } = item;
  const router = useRouter();
  const hasAnswer = useSignupDraftStore(
    (s) => !!s.draft.answers.find((a) => a.questionId === id)?.content?.trim()
  );

  const onPress = () => {
    router.push({
      pathname: "/(signup)/question/qanswer",
      params: {
        label: content,
        variant: "required",
        questionId: id,
        subQuestions: JSON.stringify(subQuestions),
      },
    });
  };
  return (
    <QuestionTile
      variant="required"
      label={content}
      checked={hasAnswer}
      onPress={onPress}
    />
  );
};

export default RequiredQuestionItem;
