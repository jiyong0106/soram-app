import { create } from "zustand";

interface SignupTokenState {
  signupToken: string;
  setSignupToken: (signupToken: string) => void;
  clear: () => void;
}

export const useSignupTokenStore = create<SignupTokenState>((set) => ({
  signupToken: "",
  setSignupToken: (t) => set({ signupToken: t }),
  clear: () => set({ signupToken: "" }),
}));
