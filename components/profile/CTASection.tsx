import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type CTASectionProps = {
  isOwnProfile?: boolean;
  onPressPrimary?: () => void; // like/edit
  onPressSecondary?: () => void; // message/save
};

const CTASection = ({
  isOwnProfile,
  onPressPrimary,
  onPressSecondary,
}: CTASectionProps) => {
  if (isOwnProfile) {
    return (
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, styles.fill]}
          onPress={onPressPrimary}
        >
          <Text style={styles.fillTxt}>프로필 편집</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.btn, styles.fill]}
        onPress={onPressPrimary}
      >
        <Text style={styles.fillTxt}>좋아요 보내기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, styles.outline]}
        onPress={onPressSecondary}
      >
        <Text style={styles.outlineTxt}>메시지</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", padding: 16, gap: 10 },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  fill: { backgroundColor: "#222" },
  fillTxt: { color: "#fff", fontWeight: "700" },
  outline: { borderWidth: 1, borderColor: "#ddd" },
  outlineTxt: { color: "#222", fontWeight: "600" },
});

export default CTASection;
