import React, { ForwardedRef, forwardRef } from "react";
import { View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import AppBottomSheetModal from "@/components/common/AppBottomSheetModal";
import SheetRow from "@/components/common/SheetRow";

type ChatActionModalProps = {
  snapPoints?: ReadonlyArray<string | number>;
  onReport?: () => void;
  onBlock?: () => void;
  onLeave?: () => void;
  onMute?: () => void;
};

const ChatActionModal = (
  { snapPoints, onReport, onBlock, onLeave, onMute }: ChatActionModalProps,
  ref: ForwardedRef<BottomSheetModal>
) => {
  return (
    <AppBottomSheetModal ref={ref} snapPoints={snapPoints}>
      <View style={{ padding: 16 }}>
        <SheetRow
          icon={<Ionicons name="alert-circle-outline" size={18} />}
          label="신고하기"
          onPress={onReport}
        />
        <SheetRow
          icon={<Ionicons name="close-circle-outline" size={18} />}
          label="차단하기"
          onPress={onBlock}
        />
        <SheetRow
          icon={<Ionicons name="exit-outline" size={18} />}
          label="채팅방 나가기"
          onPress={onLeave}
        />
        <SheetRow
          icon={<Ionicons name="notifications-off-outline" size={18} />}
          label="알림 끄기"
          onPress={onMute}
        />
      </View>
    </AppBottomSheetModal>
  );
};

export default forwardRef(ChatActionModal);
