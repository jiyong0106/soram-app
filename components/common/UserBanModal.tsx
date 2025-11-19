import { Modal, StyleSheet, View } from "react-native";
import AppText from "./AppText";
import { MaterialIcons } from "@expo/vector-icons";
import { useUserBanStore } from "@/utils/store/useUserBanStore";
import { formatKoDateOnly } from "@/utils/util/formatKoClock";

const UserBanModal = () => {
  const isVisible = useUserBanStore((s) => s.isVisible);
  const message = useUserBanStore((s) => s.message);
  const expiresAt = useUserBanStore((s) => s.expiresAt);
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          {/* 아이콘 + 타이틀 */}
          <View style={styles.header}>
            <MaterialIcons name="block" size={40} color="#FF4D4F" />
            <AppText style={styles.banTitle}>사용자 제재 안내</AppText>
          </View>
          <View style={styles.banContentContainer}>
            {expiresAt != null && (
              <AppText style={styles.banDate}>
                {formatKoDateOnly(expiresAt)}
              </AppText>
            )}
            <AppText style={styles.banContent}>{message}</AppText>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UserBanModal;

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    gap: 20,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  banTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FF4D4F",
  },
  banContentContainer: {
    alignItems: "center",
    gap: 15,
    marginBottom: 15,
  },
  banContent: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    lineHeight: 22,
  },
  banDate: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
