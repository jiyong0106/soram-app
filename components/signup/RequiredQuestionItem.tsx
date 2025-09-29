import { useRouter } from "expo-router";
import QuestionTile from "./QuestionTile";

interface Props {
  label: string;
}
const RequiredQuestionItem = ({ label }: Props) => {
  const router = useRouter();
  return (
    <QuestionTile
      variant="required"
      label={label}
      onPress={() => router.push("/(signup)/question/qanswer")}
    />
  );
};

export default RequiredQuestionItem;
