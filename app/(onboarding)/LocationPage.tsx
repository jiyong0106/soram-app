import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useOnboardingStore } from "@/utils/sotre/useOnboardingStore";
import LocationActionModal, {
  LocationActionModalRef,
} from "@/components/onboarding/LocationActionModal";

const LocationPage = () => {
  const router = useRouter();
  // const location = useOnboardingStore((s) => s.draft.location);
  // const patch = useOnboardingStore((s) => s.patch);
  // const actionModalRef = useRef<LocationActionModalRef>(null); // ✅ 타입 지정

  return (
    <ScreenWithStickyAction
      action={
        <Button
          label="계속하기"
          color="#ff6b6b"
          textColor="#fff"
          // disabled={!isValid}
          style={styles.button}
          onPress={() => router.push("/(onboarding)/InterestsPage")}
        />
      }
    >
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/test.png")}
          style={styles.heroImage}
          resizeMode="contain"
        />
        <Text style={styles.title}>거주지를 알려주세요</Text>
        <TouchableOpacity
          style={styles.locationBox}
          activeOpacity={0.5}
          // onPress={() => actionModalRef.current?.present?.()}
        >
          <Ionicons name="map-outline" size={24} color="black" />
          <Text style={styles.locationText}>지역</Text>
        </TouchableOpacity>
      </View>
      {/* <LocationActionModal ref={actionModalRef} /> */}
    </ScreenWithStickyAction>
  );
};

export default LocationPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginTop: 32,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  heroImage: {
    width: 150,
    height: 150,
  },
  speechBubble: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
  },
  speechText: {
    fontSize: 12,
    color: "#555",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },

  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ff6b6b",
    borderRadius: 10,
    backgroundColor: "#fff",
    height: 55,
    paddingHorizontal: 10,
    gap: 8,
  },
  locationIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ff6b6b",
  },
  locationText: {},
});
