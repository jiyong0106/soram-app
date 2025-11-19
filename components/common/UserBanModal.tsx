import { Modal, StyleSheet, View } from "react-native";
import AppText from "./AppText";
import { MaterialIcons } from "@expo/vector-icons";
import { useUserBanStore } from "@/utils/store/useUserBanStore";

const UserBanModal = () => {
  const isVisible = useUserBanStore((s) => s.isVisible);
  const message = useUserBanStore((s) => s.message);
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          {/* 아이콘 + 타이틀 */}
          <View style={styles.header}>
            <MaterialIcons name="block" size={40} color="#FF4D4F" />
            <AppText style={styles.modalTitle}>사용자 제재 안내</AppText>
          </View>

          {/* 사유 텍스트 */}
          <AppText style={styles.reasonText}>{message}</AppText>
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
  },
  header: {
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FF4D4F",
    marginTop: 10,
  },
  reasonContainer: {
    maxHeight: 120,
    marginBottom: 20,
  },
  reasonText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#FF4D4F",
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
