import React from "react";
import { View, StyleSheet } from "react-native";
import SettingSection from "@/components/settings/SettingSection";
import SettingRow from "@/components/settings/SettingRow";

type Props = {
  appVersion?: string;
  onPressContact?: () => void;
};

const SupportSection = ({ appVersion = "1.0.0", onPressContact }: Props) => {
  return (
    <SettingSection title="지원">
      <SettingRow title="문의하기" variant="link" onPress={onPressContact} />
      <View style={styles.divider} />
      <SettingRow title="버전" rightText={appVersion} />
    </SettingSection>
  );
};

export default SupportSection;

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ECEFF1",
  },
});
