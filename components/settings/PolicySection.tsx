import { View, StyleSheet } from "react-native";
import SettingSection from "@/components/settings/SettingSection";
import SettingRow from "@/components/settings/SettingRow";
import * as Linking from "expo-linking";

const PolicySection = () => {
  const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL;

  const routes: Record<string, string> = {
    "개인정보 처리방침": "/privacyPolicy",
    이용약관: "/terms",
    "커뮤니티 가이드라인": "/communityGuidelines",
  };

  const handleSupport = (title: string) => {
    const path = routes[title];

    if (path) {
      Linking.openURL(`${WEB_URL}${path}`);
    }
  };

  return (
    <SettingSection title="약관">
      <SettingRow
        title="개인정보 처리방침"
        variant="link"
        onPress={() => handleSupport("개인정보 처리방침")}
      />
      <SettingRow
        title="이용약관"
        variant="link"
        onPress={() => handleSupport("이용약관")}
      />
      <SettingRow
        title="커뮤니티 가이드 라인"
        variant="link"
        onPress={() => handleSupport("커뮤니티 가이드라인")}
      />
      <View style={styles.divider} />
    </SettingSection>
  );
};

export default PolicySection;

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#5C4B44",
    marginTop: 8,
    marginBottom: 8,
  },
});
