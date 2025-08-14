// components/onboarding/LocationActionModal.tsx
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View, Text } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AppBottomSheetModal from "../common/AppBottomSheetModal";

type Props = { snapPoints?: ReadonlyArray<string | number> };

// 부모에 노출할 메서드 타입
export type LocationActionModalRef = {
  present: () => void;
  dismiss: () => void;
};

const LocationActionModal = forwardRef<LocationActionModalRef, Props>(
  ({ snapPoints }, ref) => {
    // 실제 BottomSheetModal에 붙일 ref
    const innerRef = useRef<BottomSheetModal>(null);

    // 부모에 노출할 API만 제한적으로 공개
    useImperativeHandle(ref, () => ({
      present: () => innerRef.current?.present(),
      dismiss: () => innerRef.current?.dismiss(),
    }));

    return (
      <AppBottomSheetModal ref={innerRef} snapPoints={snapPoints}>
        <View style={{ padding: 16 }}>
          <Text>LocationActionModal</Text>
          <Text>LocationActionModal</Text>
          <Text>LocationActionModal</Text>
          <Text>LocationActionModal</Text>
          <Text>LocationActionModal</Text>
          <Text>LocationActionModal</Text>
          <Text>LocationActionModal</Text>
          <Text>LocationActionModal</Text>
          <Text>LocationActionModal</Text>
          <Text>LocationActionModal</Text>
          <Text>LocationActionModal</Text>
          {/* ... */}
        </View>
      </AppBottomSheetModal>
    );
  }
);

export default LocationActionModal;
