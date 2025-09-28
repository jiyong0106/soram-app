import AsyncStorage from "@react-native-async-storage/async-storage";

// 간단한 디바운스 래퍼: 동일 key에 대한 setItem을 짧은 시간 합쳐서 1회만 저장
const timers = new Map<string, NodeJS.Timeout>();
const latestValue = new Map<string, string | null>();

const DEBOUNCE_MS = 250; // 필요 시 조정

export const debouncedAsyncStorage = {
  async getItem(name: string) {
    // 보류 중인 setItem이 있어도, 최신 값이 메모리에 있으면 우선 반환
    if (latestValue.has(name)) {
      return latestValue.get(name) as string | null;
    }
    return AsyncStorage.getItem(name);
  },
  async setItem(name: string, value: string) {
    latestValue.set(name, value);
    // 기존 타이머 클리어 후 재설정
    const prev = timers.get(name);
    if (prev) clearTimeout(prev);
    const t = setTimeout(async () => {
      try {
        const v = latestValue.get(name) ?? null;
        if (v === null) {
          await AsyncStorage.removeItem(name);
        } else {
          await AsyncStorage.setItem(name, v);
        }
      } finally {
        timers.delete(name);
      }
    }, DEBOUNCE_MS);
    timers.set(name, t);
  },
  async removeItem(name: string) {
    latestValue.delete(name);
    const prev = timers.get(name);
    if (prev) clearTimeout(prev);
    timers.delete(name);
    return AsyncStorage.removeItem(name);
  },
};
