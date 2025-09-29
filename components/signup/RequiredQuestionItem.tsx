import { useRouter } from "expo-router";
import QuestionTile from "./QuestionTile";

interface Props {
  label: string;
}
const RequiredQuestionItem = ({ label }: Props) => {
  const router = useRouter();

  const onPress = () => {
    router.push({
      pathname: "/(signup)/question/qanswer",
      params: {
        label,
        variant: "required",
      },
    });
  };
  return <QuestionTile variant="required" label={label} onPress={onPress} />;
};

export default RequiredQuestionItem;
