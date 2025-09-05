// hooks/useMinDelay.ts
import { useEffect, useState } from "react";

const useMinDelay = (ms: number = 3000) => {
  const [elapsed, setElapsed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setElapsed(true), ms);
    return () => clearTimeout(t);
  }, [ms]);

  return elapsed;
};
export default useMinDelay;
