import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import AppText from "../common/AppText";

// API의 iconType과 Ionicons 이름 매핑
const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
  CHAT_START: "chatbubble-ellipses-outline",
  VIEW_STORY: "eye-outline",
  WELCOME_GIFT: "gift-outline",
  DAILY_REWARD: "calendar-outline",
  DEFAULT: "help-circle-outline",
};

// 컴포넌트가 받을 Props의 타입을 정의합니다.
type TransactionRowProps = {
  transaction: {
    id: number;
    transactionType: "EARN" | "USE";
    quantityChange: number;
    ticketName: string;
    createdAt: string;
    iconType: string;
    displayText: string;
  };
};

const TransactionRow: React.FC<TransactionRowProps> = ({ transaction }) => {
  const isEarn = transaction.transactionType === "EARN";
  const iconName = iconMap[transaction.iconType] || iconMap.DEFAULT;
  const time = dayjs(transaction.createdAt).format("A h:mm"); // '오후 4:43' 형식

  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={24} color="#5C6E80" style={styles.icon} />
      <View style={styles.content}>
        <AppText style={styles.displayText}>{transaction.displayText}</AppText>
        <AppText style={styles.subText}>
          {transaction.ticketName} · {time}
        </AppText>
      </View>
      <AppText style={[styles.quantity, isEarn ? styles.earn : styles.use]}>
        {isEarn ? `+${transaction.quantityChange}` : transaction.quantityChange}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
  },
  icon: {
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  displayText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#121212",
    marginBottom: 4,
  },
  subText: {
    fontSize: 13,
    color: "#8A8A8A",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "bold",
  },
  earn: {
    color: "#2979FF", // 파란색 (획득)
  },
  use: {
    color: "#5C6E80", // 회색 (사용)
  },
});

export default TransactionRow;
