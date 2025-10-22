import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "@/components/common/AppText";
import { MyProfileResponse } from "@/utils/types/profile";

type Props = {
  profile: MyProfileResponse;
};

// 한글 주석: 기본 정보(닉네임/나이/성별/지역)를 표시하는 헤더
const ProfileHeader = ({ profile }: Props) => {
  const genderLabel = (g: MyProfileResponse["gender"]) =>
    g === "MALE" ? "남성" : g === "FEMALE" ? "여성" : "기타";

  return (
    <View style={{ gap: 10 }}>
      <AppText style={styles.name}>{profile.nickname || "-"}</AppText>
      <AppText style={styles.meta}>{`${profile.age ?? "-"}세`}</AppText>
      <AppText style={styles.meta}>
        {`${genderLabel(profile.gender)} · ${profile.location ?? "미설정"}`}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5C4B44",
    marginTop: 8,
  },
  meta: {
    fontSize: 16,
    color: "#5C4B44",
  },
});

export default ProfileHeader;
