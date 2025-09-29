import { useRouter } from "expo-router";
import QuestionTile from "./QuestionTile";

interface Props {
  label: string;
  questionId?: 1 | 2; // 한글 주석: 명시적으로 필수 질문 번호 전달
}
const RequiredQuestionItem = ({ label, questionId = 1 }: Props) => {
  const router = useRouter();

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
  return <QuestionTile variant="required" label={label} onPress={onPress} />;
};

export default RequiredQuestionItem;
