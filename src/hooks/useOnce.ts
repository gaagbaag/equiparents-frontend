// hooks/useOnce.ts
import { useRef, useEffect } from "react";

export function useOnce(callback: () => void) {
  const called = useRef(false);

  useEffect(() => {
    if (!called.current) {
      called.current = true;
      callback();
    }
  }, [callback]);
}
