import React, { useMemo } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/utils/api/profilePageApi";
import PageContainer from "@/components/common/PageContainer";
import AppText from "@/components/common/AppText";
import MyProfileHeader from "@/components/profile/MyProfileHeader";
import MyProfileAnswers from "@/components/profile/MyProfileAnswers";

const ProfilePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["getMyProfileKey"],
    queryFn: () => getMyProfile(),
    staleTime: 1000 * 30,
  });

  //프로필 조회
  const profile = useMemo(() => data, [data]);

  return (
    <PageContainer padded={false} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {isLoading || !profile ? (
          <View style={styles.placeholder}>
            <AppText>내 프로필을 불러오고 있어요…</AppText>
          </View>
        ) : (
          <>
            <MyProfileHeader profile={profile} />
            <View style={styles.section}>
              <AppText style={styles.sectionTitle}>내 이야기</AppText>
              <MyProfileAnswers profile={profile} />
            </View>
          </>
        )}
      </ScrollView>
    </PageContainer>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scroll: {
    paddingBottom: 60,
  },
  placeholder: { padding: 24 },
  section: { paddingHorizontal: 16, paddingTop: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
});
