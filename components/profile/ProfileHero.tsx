import {
  getAgeFromBirthdate,
  prettyLocation,
  ProfileType,
} from "@/utils/types/profile";
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import AppText from "../common/AppText";

type ProfileHeroProps = {
  profile: ProfileType;
  coverUri?: string; // 상단 감성 배경 이미지(없으면 그라데이션)
  avatarUri?: string; // 아바타(없으면 플레이스홀더)
};

const ProfileHero = ({ profile, coverUri, avatarUri }: ProfileHeroProps) => {
  const genderLabel = (g?: ProfileType["gender"]) =>
    g === "MALE" ? "남성" : g === "FEMALE" ? "여성" : "기타";

  const age = getAgeFromBirthdate(profile.birthdate);

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
          <AppText style={styles.chip}>{genderLabel(profile.gender)}</AppText>
          {/* 필요 시 해시태그/취향 칩들 확장 */}
        </View>
        <AppText style={styles.meta}>
          {age ? `${age} · ` : ""}
          {prettyLocation(profile.location)}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: "relative" },
  cover: { width: "100%", height: 220, backgroundColor: "#eee" },
  coverGradient: {
    width: "100%",
    height: 220,
    backgroundColor: "#f5efe7", // 따뜻한 톤
  },
  heroContent: {
    position: "absolute",
    left: 16,
    bottom: 16,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: "#ffffff",
    marginBottom: 10,
  },
  nickname: { fontSize: 22, fontWeight: "700" },
  meta: { marginTop: 4, fontSize: 14, color: "#666" },
  row: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f0f2f5",
    borderRadius: 999,
    fontSize: 12,
    color: "#333",
  },
});

export default ProfileHero;
