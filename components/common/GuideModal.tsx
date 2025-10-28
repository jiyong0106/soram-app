// GuideModal.tsx
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import GuideContents from "./GuideContents";
import ScalePressable from "./ScalePressable";
import { guideOptions } from "@/utils/util/options";

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

const GuideModal: React.FC<Props> = ({ isVisible, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.guideLengthContainer}>
          {guideOptions.map((item, index) => (
            <View
              key={index}
              style={[
                styles.guideLength,
                index === activeIndex ? styles.isActive : undefined,
              ]}
            />
          ))}
        </View>
        <View style={styles.modalContainer}>
          <GuideContents
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        </View>

        <ScalePressable style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="black" />
        </ScalePressable>
      </View>
    </Modal>
  );
};

export default GuideModal;

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 20 as any,
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
  },
  guideLengthContainer: {
    flexDirection: "row",
    gap: 6,
  },
  guideLength: {
    width: "15%",
    height: 7,
    backgroundColor: "#858585",
    borderRadius: 50,
    marginBottom: 6,
  },
  isActive: {
    backgroundColor: "#fff",
  },
  closeButton: {
    backgroundColor: "#d9d9d9",
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
  },
});
