import React from "react";
import { View, StyleSheet } from "react-native";
import SettingSection from "@/components/settings/SettingSection";
import SettingRow from "@/components/settings/SettingRow";

type Props = {
  onPressLogout?: () => void;
  onPressDelete?: () => void;
};

const AccountSection = ({ onPressLogout, onPressDelete }: Props) => {
  return (
    <SettingSection title="계정">
      <SettingRow title="로그아웃" variant="danger" onPress={onPressLogout} />
      <View style={styles.divider} />
      <SettingRow title="계정 삭제" variant="danger" onPress={onPressDelete} />
    </SettingSection>
  );
};

export default AccountSection;

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ECEFF1",
  },
});
