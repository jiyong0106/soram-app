import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import Button from "@/components/common/Button";
import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";

const PhoneNumberPage = () => {
  const [birth, setBirth] = useState("");
  const isValid = birth.length === 6;

  return (
    <ScreenWithStickyAction
      action={
        <Button
          label="계속하기"
          color="#FF6F3C"
          textColor="#fff"
          disabled={!isValid}
          onPress={() => Alert.alert("끝")}
          style={styles.button}
        />
      }
    >
      <View style={styles.container}>
        <Text style={styles.title}>생년월일을 입력해 주세요</Text>
        <TextInput
          style={styles.input}
          placeholder="YYMMDD"
          keyboardType="number-pad"
          value={birth}
          onChangeText={setBirth}
          maxLength={6}
        />
      </View>
    </ScreenWithStickyAction>
  );
};

export default PhoneNumberPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    fontSize: 18,
    padding: 8,
    marginBottom: 16,
  },
  button: {
    marginTop: 32,
  },
});
