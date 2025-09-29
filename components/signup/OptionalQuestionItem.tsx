import QuestionTile from "./QuestionTile";
import { useSignupDraftStore } from "@/utils/store/useSignupDraftStore";

interface Props {
  label?: string;
  onOpenPicker: () => void;
}
const OptionalQuestionItem = ({
  label = "질문을 선택해 주세요",
  onOpenPicker,
}: Props) => {
  // 한글 주석: 선택 질문 타이틀과 답변 여부 확인
  const optionalTitle = useSignupDraftStore((s) => s.optionalTitle);
  const optionalAnswer = useSignupDraftStore((s) =>
    s.draft.answers.find((a) => a.questionId !== 1 && a.questionId !== 2)
  );

  const hasAnswer = !!optionalAnswer?.content?.trim();
  const displayLabel = hasAnswer ? `3. ${optionalTitle || label}` : label;
  const tone = hasAnswer ? "emphasis" : "default";

  return (
    <QuestionTile
      variant="optional"
      tone={tone as any}
      label={displayLabel}
      checked={hasAnswer}
      onPress={onOpenPicker}
    />
  );
};

export default OptionalQuestionItem;
