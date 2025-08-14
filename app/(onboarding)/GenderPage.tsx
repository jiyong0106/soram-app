import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useOnboardingStore, Gender } from "@/utils/sotre/useOnboardingStore";

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
          color="#FF6F3C"
          textColor="#fff"
          disabled={!gender}
          style={styles.button}
          onPress={() => router.push("/(onboarding)/BirthdatePage")}
        />
      }
    >
      <View style={styles.container}>
        <View style={styles.heroRow}>
          <Image
            source={require("@/assets/images/test.png")}
            style={styles.heroImage}
            resizeMode="contain"
          />
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>안녕!</Text>
          </View>
        </View>

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
              />
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
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  heroImage: {
    width: 56,
    height: 56,
  },
  speechBubble: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
  },
  speechText: {
    fontSize: 12,
    color: "#555",
  },
  title: {
    fontSize: 16,
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
    borderColor: "#FF6F3C",
  },
  selectLabel: {
    fontSize: 14,
    color: "#444",
  },
  selectedLabel: {
    color: "#222",
    fontWeight: "700",
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#DADADA",
    backgroundColor: "#fff",
  },
  radioChecked: {
    borderColor: "#FF6F3C",
    backgroundColor: "#FF6F3C",
  },
});
