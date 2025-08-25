import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  GetConnectionsResponse,
  GetConnectionsType,
} from "@/utils/types/connection";
import Button from "../common/Button";

interface ConnectionListsProps {
  item: GetConnectionsType;
  onAccept: () => void;
  onReject: () => void;
  disabled?: boolean;
}

const ConnectionLists = ({
  item,
  onAccept,
  onReject,
  disabled,
}: ConnectionListsProps) => {
  const { id, requesterId, addresseeId, status, requester, createdAt } = item;

  return (
    <View style={styles.container}>
      <Text style={styles.nick}>
        보낸 유저 : {requester.nickname} ({requester.id})
      </Text>
      <Text style={styles.meta}>
        보낸 시간 : {new Date(createdAt).toLocaleString()}
      </Text>
      <Text style={styles.meta}>해당 요청 목록 id : {id}</Text>
      <Text style={styles.meta}>요청 한 사람 id : {requesterId}</Text>
      <Text style={styles.meta}>요청 받은 사람 (나) id : {addresseeId}</Text>
      <Text style={styles.meta}>응답상태값 : {status}</Text>
      <View style={styles.btnWrapper}>
        <Button
          label="거절"
          color="#ff6b6b"
          textColor="#fff"
          style={{ flex: 1 }}
          onPress={onReject}
          disabled={disabled}
        />
        <Button
          label="수락"
          color="#ff6b6b"
          textColor="#fff"
          style={{ flex: 1 }}
          onPress={onAccept}
          disabled={disabled}
        />
      </View>
    </View>
  );
};

export default ConnectionLists;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
  },
  nick: { fontWeight: "700", marginBottom: 6 },
  meta: { color: "#999", marginTop: 6, fontSize: 12 },
  btnWrapper: { flexDirection: "row", marginVertical: 10, gap: 10 },
});
