import { Linking, Modal, StyleSheet, View } from "react-native";
import AppText from "./AppText";
import { MaterialIcons } from "@expo/vector-icons";
import { useUserBanStore } from "@/utils/store/useUserBanStore";
import { formatKoDateOnly } from "@/utils/util/formatKoClock";
import Button from "./Button";

const UserBanModal = () => {
  const isVisible = useUserBanStore((s) => s.isVisible);
  const message = useUserBanStore((s) => s.message);
  const expiresAt = useUserBanStore((s) => s.expiresAt);

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.topRow}>
            <View style={styles.iconWrap}>
              <MaterialIcons name="block" size={34} color="#fff" />
            </View>
            <View style={styles.titleWrap}>
              <AppText style={styles.title}>사용자 제재 안내</AppText>
              <AppText style={styles.subtitle}>
                소람 가이드라인 위반으로 인한 조치
              </AppText>
            </View>
          </View>

          <View style={styles.content}>
            {expiresAt != null && (
              <AppText style={styles.date}>
                제재 해제 예정: {formatKoDateOnly(expiresAt)}
              </AppText>
            )}

            <AppText
              style={styles.message}
              numberOfLines={8}
              ellipsizeMode="tail"
            >
              {message ||
                "제재 사유에 대한 자세한 내용은 고객센터로 문의해주세요."}
            </AppText>
            <Button
              label="문의하기"
              onPress={() =>
                Linking.openURL(`${process.env.EXPO_PUBLIC_FORM_URL}`)
              }
              color="#FF4D4F"
              textColor="#fff"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UserBanModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  container: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 20,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 54,
    backgroundColor: "#FF4D4F",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: "#666",
  },
  content: {
    marginTop: 16,
    alignItems: "center",
  },
  date: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FF4D4F",
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
  },
});
