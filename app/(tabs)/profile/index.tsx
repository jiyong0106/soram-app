import React, { useMemo } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/utils/api/profilePageApi";
import AppText from "@/components/common/AppText";
import ProfileBranding from "@/components/profile/ProfileBranding";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileAnswers from "@/components/profile/ProfileAnswers";
import ProfileInterests from "@/components/profile/ProfileInterests";
import PageContainer from "@/components/common/PageContainer";
import { Stack } from "expo-router";

const ProfilePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["getMyProfileKey"],
    queryFn: () => getMyProfile(),
    staleTime: 1000 * 30,
  });

  //프로필 조회
  const profile = useMemo(() => data, [data]);

  return (
    <PageContainer edges={[]} padded={false}>
      <Stack.Screen
        options={{
          title: "",
          headerShown: true,
          headerBackVisible: false,
          headerShadowVisible: false,
          headerLeft: () => <ProfileBranding />,
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll}
      >
        {isLoading || !profile ? (
          <View style={styles.placeholder}>
            <AppText>내 프로필을 불러오고 있어요…</AppText>
          </View>
        ) : (
          <View style={styles.profileCard}>
            <ProfileHeader profile={profile} />
            <ProfileAnswers answers={profile.answers} />
            <ProfileInterests interests={profile.interests} />
          </View>
        )}
      </ScrollView>
    </PageContainer>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 60,
  },
  profileCard: {
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  placeholder: { padding: 24 },
  section: { paddingHorizontal: 16, paddingTop: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
});
