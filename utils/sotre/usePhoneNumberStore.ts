import { create } from "zustand";

interface PhoneNumberState {
  phoneNumber: string;
  setPhoneNumber: (phoneNumner: string) => void;
  clear: () => void;
}

export const usePhoneNumberStore = create<PhoneNumberState>((set) => ({
  phoneNumber: "",
  setPhoneNumber: (n) => set({ phoneNumber: n }),
  clear: () => set({ phoneNumber: "" }),
}));
