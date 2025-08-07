import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import PhoneInput from "../components/signUp/PhoneInput";
import ProfileInput from "../components/signUp/ProfileInput";
import VerifyCodeInput from "../components/signUp/VerifyCodeInput";

const signUp = () => {
  const [step, setStep] = useState(1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PhoneInput onNext={() => setStep(2)} />;
      case 2:
        return (
          <VerifyCodeInput
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        );
      case 3:
        return <ProfileInput onNext={() => {}} onBack={() => setStep(2)} />;
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80} // 필요에 따라 조정
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: "white" }}>
          {renderStep()}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default signUp;

//Keyboard.dismiss() 키보드 닫힘
