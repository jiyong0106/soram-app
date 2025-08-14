import React, { PropsWithChildren } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

type DismissKeyboardViewProps = PropsWithChildren<{
  disabled?: boolean;
}>;

const DismissKeyboardView = ({
  children,
  disabled = false,
}: DismissKeyboardViewProps) => {
  if (disabled) return children as any;
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {children as any}
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboardView;
