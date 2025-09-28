import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useSignupDraftStore } from "@/utils/store/useSignupDraftStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Gender } from "@/utils/types/signup";
import AppText from "@/components/common/AppText";

const OPTIONS: Array<{ key: Gender; label: string }> = [
  { key: "MALE", label: "남자" },
  { key: "FEMALE", label: "여자" },
];

const GenderPage = () => {
  const router = useRouter();
  const gender = useSignupDraftStore((s) => s.draft.gender);
  const nickname = useSignupDraftStore((s) => s.draft.nickname);
  const patch = useSignupDraftStore((s) => s.patch);

  return (
    <ScreenWithStickyAction
      action={
        <Button
          label="계속하기"
          color="#FF7D4A"
          textColor="#fff"
          disabled={!gender}
          style={styles.button}
          onPress={() => router.push("/(signup)/birthdate")}
        />
      }
    >
      <View style={styles.container}>
        <View style={styles.headerTitle}>
          <AppText style={styles.title}>
            {nickname}님의 성별을 선택해 주세요
          </AppText>
          <AppText style={styles.subtitle}>
            성별 정보를 기반 좋은 인연을 찾아드려요!
          </AppText>
        </View>
        <View style={styles.selectList}>
          {OPTIONS.map(({ key, label }) => (
            <Pressable
              key={key}
              onPress={() => patch({ gender: key })}
              style={[styles.selectItem, gender === key && styles.selected]}
            >
              <AppText
                style={[
                  styles.selectLabel,
                  gender === key && styles.selectedLabel,
                ]}
              >
                {label}
              </AppText>
              <View
                style={[styles.radio, gender === key && styles.radioChecked]}
              >
                <Ionicons
                  name="checkmark"
                  size={20}
                  color={gender === key ? "#FF7D4A" : "#D0D0D0"}
                />
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </ScreenWithStickyAction>
  );
};

export default GenderPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginTop: 32,
  },
  headerTitle: {
    marginBottom: 30,
    gap: 10,
    marginTop: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
  },
  subtitle: {
    fontSize: 15,
    color: "#666666",
  },
  selectList: {
    gap: 10,
  },
  selectItem: {
    height: 55,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selected: {
    backgroundColor: "#FF7D4A",
    borderWidth: 0,
  },
  selectLabel: {
    fontSize: 16,
    color: "#444",
  },
  selectedLabel: {
    color: "#fff",
    fontWeight: "700",
  },
  radio: {
    width: 25,
    height: 25,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#DADADA",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  radioChecked: {
    borderColor: "#FF7D4A",
    backgroundColor: "#fff",
  },
});
