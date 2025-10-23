import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import AppText from "../common/AppText";

// 아이콘 정보 타입을 정의 (이름 + 색상)
type IconInfo = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
};

// iconMap이 IconInfo 객체를 갖도록 수정
const iconMap: { [key: string]: IconInfo } = {
  CHAT_START: { name: "chatbubble-ellipses", color: "#FF7D4A" }, // 주황색 계열
  VIEW_STORY: { name: "book", color: "#6A839A" }, // 파란색 계열
  WELCOME_GIFT: { name: "gift-outline", color: "#A89CF7" }, // 보라색 계열
  DAILY_REWARD: { name: "calendar-outline", color: "#72D6EE" }, // 하늘색 계열
  DEFAULT: { name: "help-circle-outline", color: "#B0A6A0" }, // 기본 회색
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
  // iconMap에서 이름과 색상을 한 번에 구조 분해 할당으로 가져옵니다.
  const { name: iconName, color: iconColor } =
    iconMap[transaction.iconType] || iconMap.DEFAULT;
  const time = dayjs(transaction.createdAt).format("A h:mm"); // '오후 4:43' 형식

  return (
    <View style={styles.container}>
      {/* color prop에 하드코딩된 값 대신 iconColor 변수를 사용합니다. */}
      <Ionicons
        name={iconName}
        size={22}
        color={iconColor}
        style={styles.icon}
      />
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
    fontSize: 14,
    fontWeight: "500",
    color: "#5C4B44",
    marginBottom: 4,
  },
  subText: {
    fontSize: 12,
    color: "#B0A6A0",
  },
  quantity: {
    fontSize: 14,
    fontWeight: "bold",
  },
  earn: {
    color: "#2979FF", // 파란색 (획득)
  },
  use: {
    marginLeft: 4,
    color: "#B0A6A0", // 회색 (사용)
  },
});

export default TransactionRow;
