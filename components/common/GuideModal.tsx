import { Modal, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import GuideContents from "./GuideContents";
interface Props {
  isVisible: boolean;
  onClose: () => void;
}

const GuideModal = ({ isVisible, onClose }: Props) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.guideLength} />
        <View style={styles.modalContainer}>
          <GuideContents />
        </View>
        <View style={styles.closeButton}>
          <Ionicons name="close" size={24} color="black" />
        </View>
      </View>
    </Modal>
  );
};

export default GuideModal;

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 20,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  guideLength: {
    width: "10%",
    height: 7,
    backgroundColor: "#fff",
    borderRadius: 50,
  },
  closeButton: {
    backgroundColor: "#d9d9d9",
    padding: 10,
    borderRadius: 50,
  },
});
