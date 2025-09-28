import React, { PropsWithChildren } from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../common/AppText";

type SettingSectionProps = PropsWithChildren<{
  title?: string;
  footer?: string;
}>;

const SettingSection = ({ title, footer, children }: SettingSectionProps) => {
  return (
    <View style={styles.wrap}>
      {!!title && <AppText style={styles.title}>{title}</AppText>}
      <View style={styles.card}>{children}</View>
      {!!footer && <AppText style={styles.footer}>{footer}</AppText>}
    </View>
  );
};

export default SettingSection;

const styles = StyleSheet.create({
  wrap: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: "nsBol",
    marginBottom: 8,
    color: "#5C4B44",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
    marginLeft: 12,
  },
  card: {
    // borderRadius: 12,
    // overflow: "hidden",
    // backgroundColor: "#fff",
    // borderWidth: 1,
    // borderColor: "#ECEFF1",
  },
  footer: {
    marginTop: 8,
    color: "#9AA0A6",
    fontSize: 12,
  },
});
