import { create } from "zustand";

interface PhoneNumberState {
  phoneNumber: string;
  setPhoneNumber: (phoneNumner: string) => void;
  clear: () => void;
}

export const usePhoneNumberStore = create<PhoneNumberState>((set) => ({
  phoneNumber: "",
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  clear: () => set({ phoneNumber: "" }),
}));
