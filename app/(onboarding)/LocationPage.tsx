import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, StyleSheet, Text, TextInput, View } from "react-native";

const LocationPage = () => {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const isValid = useMemo(() => location.trim().length > 0, [location]);

  return (
    <ScreenWithStickyAction
      action={
        <Button
          label="계속하기"
          color="#ff6b6b"
          textColor="#fff"
          disabled={!isValid}
          style={styles.button}
          onPress={() => router.push("/(onboarding)/InterestsPage")}
        />
      }
    >
      <View style={styles.container}>
        <View style={styles.heroRow}>
          <Image
            source={require("@/assets/images/test.png")}
            style={styles.heroImage}
            resizeMode="contain"
          />
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>안녕!</Text>
          </View>
        </View>

        <Text style={styles.title}>거주지를 알려주세요</Text>

        <View style={styles.inputWrap}>
          <View style={styles.inputRow}>
            <View style={styles.locationIcon} />
            <TextInput
              style={styles.input}
              placeholder="지역"
              placeholderTextColor="#B2B2B2"
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </View>
      </View>
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
    width: 56,
    height: 56,
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
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },
  inputWrap: {
    position: "relative",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1C0B5",
    borderRadius: 10,
    backgroundColor: "#fff",
    height: 44,
    paddingHorizontal: 10,
    gap: 8,
  },
  locationIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ff6b6b",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#222",
  },
});
