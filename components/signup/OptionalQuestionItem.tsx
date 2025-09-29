import QuestionTile from "./QuestionTile";

interface Props {
  label?: string;
  onOpenPicker: () => void;
}
const OptionalQuestionItem = ({
  label = "질문을 선택해 주세요",
  onOpenPicker,
}: Props) => {
  return (
    <QuestionTile variant="optional" label={label} onPress={onOpenPicker} />
  );
};

export default OptionalQuestionItem;
