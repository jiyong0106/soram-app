import React, {
  ForwardedRef,
  PropsWithChildren,
  forwardRef,
  useMemo,
} from "react";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { SharedValue } from "react-native-reanimated";

type SnapPoints =
  | ReadonlyArray<string | number>
  | SharedValue<(string | number)[]>;

type AppBottomSheetModalProps = PropsWithChildren<{
  snapPoints?: SnapPoints;
  backdropAppearsOnIndex?: number;
  backdropDisappearsOnIndex?: number;
}> &
  Omit<BottomSheetModalProps, "snapPoints" | "backdropComponent">;

const AppBottomSheetModal = (
  {
    children,
    snapPoints = ["40%"],
    backdropAppearsOnIndex = 0,
    backdropDisappearsOnIndex = -1,
    ...rest
  }: AppBottomSheetModalProps,
  ref: ForwardedRef<BottomSheetModal>
) => {
  const normalizedSnapPoints: SnapPoints = useMemo(() => {
    if (Array.isArray(snapPoints)) return [...snapPoints];
    return snapPoints ?? ["40%"];
  }, [snapPoints]);

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={backdropAppearsOnIndex}
      disappearsOnIndex={backdropDisappearsOnIndex}
    />
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={normalizedSnapPoints as any}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={rest.enablePanDownToClose ?? true}
      keyboardBehavior={rest.keyboardBehavior ?? "interactive"}
      keyboardBlurBehavior={rest.keyboardBlurBehavior ?? "restore"}
      {...rest}
    >
      <BottomSheetView style={{ flex: 1 }}>{children}</BottomSheetView>
    </BottomSheetModal>
  );
};

export default forwardRef(AppBottomSheetModal);
