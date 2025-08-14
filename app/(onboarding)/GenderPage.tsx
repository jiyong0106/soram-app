import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useOnboardingStore, Gender } from "@/utils/sotre/useOnboardingStore";
import Ionicons from "@expo/vector-icons/Ionicons";

const OPTIONS: Array<{ key: Gender; label: string }> = [
  { key: "MALE", label: "남자" },
  { key: "FEMALE", label: "여자" },
];

const GenderPage = () => {
  const router = useRouter();
  const gender = useOnboardingStore((s) => s.draft.gender);
  const patch = useOnboardingStore((s) => s.patch);

  return (
    <ScreenWithStickyAction
      action={
        <Button
          label="계속하기"
          color="#ff6b6b"
          textColor="#fff"
          disabled={!gender}
          style={styles.button}
          onPress={() => router.push("/(onboarding)/BirthdatePage")}
        />
      }
    >
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/test.png")}
          style={styles.heroImage}
          resizeMode="contain"
        />

        <Text style={styles.title}>OO님의 성별을 알려주세요</Text>

        <View style={styles.selectList}>
          {OPTIONS.map(({ key, label }) => (
            <Pressable
              key={key}
              onPress={() => patch({ gender: key })}
              style={[styles.selectItem, gender === key && styles.selected]}
            >
              <Text
                style={[
                  styles.selectLabel,
                  gender === key && styles.selectedLabel,
                ]}
              >
                {label}
              </Text>
              <View
                style={[styles.radio, gender === key && styles.radioChecked]}
              >
                <Ionicons
                  name="checkmark"
                  size={20}
                  color={gender === key ? "#ff6b6b" : "#D0D0D0"}
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

  heroImage: {
    width: 150,
    height: 150,
  },
  speechBubble: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
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
    backgroundColor: "#ff6b6b",
    borderWidth: 0,
  },
  selectLabel: {
    fontSize: 16,
    color: "#444",
  },
  selectedLabel: {
    color: "white",
    fontWeight: "700",
  },
  radio: {
    width: 25,
    height: 25,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#DADADA",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  radioChecked: {
    borderColor: "#ff6b6b",
    backgroundColor: "white",
  },
});
