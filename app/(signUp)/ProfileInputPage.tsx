import { useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Button from "@/components/common/Button";
import StickyBottom from "@/components/common/StickyBottom";
import useSafeArea from "@/utils/hooks/useSafeArea";

const ProfileInputPage = () => {
  const [birth, setBirth] = useState("");
  const isValid = birth.length === 6;
  const { bottom } = useSafeArea();

  return (
    <View style={{ flex: 1, paddingHorizontal: 15, paddingTop: 15 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
      </TouchableWithoutFeedback>
      <StickyBottom bottomInset={bottom}>
        <Button
          label="계속하기"
          color="#FF6F3C"
          textColor="#fff"
          disabled={!isValid}
          onPress={() => Alert.alert("끝!")}
          style={styles.button}
        />
      </StickyBottom>
    </View>
  );
};

export default ProfileInputPage;

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
