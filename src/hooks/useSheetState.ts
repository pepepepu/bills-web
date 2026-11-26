import { useCallback, useRef, useState } from "react";

export const SHEET_EXIT_MS = 280;

/**
 * Estado de um "modal" com animação de saída: set(null) primeiro
 * marca closing (a animação roda) e só depois desmonta.
 */
export function useSheetState<T>() {
  const [value, setValue] = useState<T | null>(null);
  const [closing, setClosing] = useState(false);
  const timer = useRef<number>();

  const set = useCallback((next: T | null) => {
    window.clearTimeout(timer.current);
    if (next === null) {
      setClosing(true);
      timer.current = window.setTimeout(() => {
        setValue(null);
        setClosing(false);
      }, SHEET_EXIT_MS);
    } else {
      setClosing(false);
      setValue(next);
    }
  }, []);

  return [value, set, closing] as const;
}
