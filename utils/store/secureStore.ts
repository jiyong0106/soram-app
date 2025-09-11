// utils/store/secureStorage.ts
import * as SecureStore from "expo-secure-store";
import { createJSONStorage, StateStorage } from "zustand/middleware";

const secureStore: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) => SecureStore.setItemAsync(name, value),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};

export const secureJSONStorage = createJSONStorage(() => secureStore);
