import React from "react";
import { View, StyleSheet } from "react-native";
import SectionTitle from "./SectionTitle";
import AppText from "@/components/common/AppText";
import { ProfileInterest } from "@/utils/types/profile";

type Props = { interests: ProfileInterest[] };

const ProfileInterests = ({ interests }: Props) => {
  if (!interests?.length) return null;

  return (
    <View style={[styles.section, { paddingBottom: 8 }]}>
      <SectionTitle>관심있는 주제</SectionTitle>
      <View style={styles.tagsRow}>
        {interests.map((it) => (
          <AppText key={it.id} style={styles.tag}>{`#${it.name}`}</AppText>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingTop: 20,
    gap: 10,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    color: "#5C4B44",
  },
});

export default ProfileInterests;
