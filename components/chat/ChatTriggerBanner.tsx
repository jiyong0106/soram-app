import { StyleSheet, Text, View } from "react-native";
import React from "react";

interface ChatTriggerBannerProps {
  roomId: number;
}

const ChatTriggerBanner = ({ roomId }: ChatTriggerBannerProps) => {
  
  return (
    <View>
      <Text>ConnectionHintBanner</Text>
    </View>
  );
};

export default ChatTriggerBanner;

const styles = StyleSheet.create({});
