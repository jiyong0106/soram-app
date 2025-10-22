import React from "react";
import { View, Image, StyleSheet } from "react-native";
import AppText from "@/components/common/AppText";
import { MyProfileResponse } from "@/utils/types/profile";

type Props = {
  profile: MyProfileResponse;
  coverUri?: string;
  avatarUri?: string;
};

const MyProfileHeader = ({ profile, coverUri, avatarUri }: Props) => {
  // 성별 라벨 변환
  const genderLabel = (g: MyProfileResponse["gender"]) =>
    g === "MALE" ? "남성" : g === "FEMALE" ? "여성" : "기타";

  return (
    <View style={styles.container}>
      {coverUri ? (
        <Image
          source={{ uri: coverUri }}
          style={styles.cover}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.coverGradient} />
      )}

      <View style={styles.heroContent}>
        <Image
          source={
            avatarUri ? { uri: avatarUri } : require("@/assets/images/test.png")
          }
          style={styles.avatar}
        />
        <View style={styles.row}>
          <AppText style={styles.nickname}>{profile.nickname}</AppText>
          <AppText style={styles.age}>{`${profile.age}세`}</AppText>
        </View>
        <AppText style={styles.meta}>{`${genderLabel(profile.gender)} · ${
          profile.location ?? "어딘가에서"
        }`}</AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: "relative" },
  cover: { width: "100%", height: 220, backgroundColor: "#eee" },
  coverGradient: { width: "100%", height: 220, backgroundColor: "#f5efe7" },
  heroContent: { position: "absolute", left: 16, bottom: 16 },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: "#ffffff",
    marginBottom: 10,
  },
  row: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  nickname: { fontSize: 22, fontWeight: "700" },
  age: { fontSize: 18, color: "#333" },
  meta: { marginTop: 4, fontSize: 14, color: "#666" },
});

export default MyProfileHeader;
