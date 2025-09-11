import React from "react";
import { View, StyleSheet } from "react-native";
import SettingSection from "@/components/settings/SettingSection";
import SettingRow from "@/components/settings/SettingRow";

type Props = {
  onPressPrivacy?: () => void;
  onPressTerms?: () => void;
};

const PolicySection = ({ onPressPrivacy, onPressTerms }: Props) => {
  return (
    <SettingSection title="약관">
      <SettingRow
        title="개인정보 처리방침"
        variant="link"
        onPress={onPressPrivacy}
      />
      <View style={styles.divider} />
      <SettingRow title="이용약관" variant="link" onPress={onPressTerms} />
    </SettingSection>
  );
};

export default PolicySection;

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ECEFF1",
  },
});
