import { useEffect, useRef, useState, type RefObject } from "react";

/** Quanto precisa puxar (px, já com a resistência) para atualizar. */
export const PULL_TRIGGER = 64;
/** Onde o indicador fica parado enquanto atualiza. */
export const PULL_HOLD = 52;
const PULL_MAX = 96;

/**
 * "Puxar para atualizar" no estilo do iOS para um container com rolagem
 * própria. Só começa quando o container está no topo e o gesto é vertical
 * (não briga com o arrastar para o lado das linhas).
 */
export function usePullToRefresh(
  ref: RefObject<HTMLElement | null>,
  onRefresh?: () => Promise<unknown> | unknown,
) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const state = useRef({
    startX: 0,
    startY: 0,
    active: false,
    decided: false,
    pull: 0,
    refreshing: false,
  });
  const callback = useRef(onRefresh);
  useEffect(() => {
    callback.current = onRefresh;
  }, [onRefresh]);
  const enabled = !!onRefresh;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const s = state.current;

    const onStart = (e: TouchEvent) => {
      if (s.refreshing || el.scrollTop > 0 || e.touches.length > 1) {
        s.active = false;
        return;
      }
      s.startX = e.touches[0].clientX;
      s.startY = e.touches[0].clientY;
      s.active = true;
      s.decided = false;
    };

    const onMove = (e: TouchEvent) => {
      if (!s.active) return;
      const dx = e.touches[0].clientX - s.startX;
      const dy = e.touches[0].clientY - s.startY;
      if (!s.decided) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        s.decided = true;
        // gesto para o lado ou para cima: não é puxar para atualizar
        if (dy <= 0 || Math.abs(dx) > Math.abs(dy) || el.scrollTop > 0) {
          s.active = false;
          return;
        }
      }
      if (dy <= 0) {
        s.pull = 0;
        setPull(0);
        return;
      }
      if (e.cancelable) e.preventDefault();
      setDragging(true);
      // resistência: quanto mais puxa, mais pesado fica
      s.pull = Math.min(PULL_MAX, dy * 0.5);
      setPull(s.pull);
    };

    const onEnd = async () => {
      if (!s.active) return;
      s.active = false;
      setDragging(false);
      if (s.pull < PULL_TRIGGER) {
        s.pull = 0;
        setPull(0);
        return;
      }
      s.refreshing = true;
      setRefreshing(true);
      s.pull = PULL_HOLD;
      setPull(PULL_HOLD);
      try {
        await callback.current?.();
      } finally {
        s.refreshing = false;
        s.pull = 0;
        setRefreshing(false);
        setPull(0);
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [ref, enabled]);

  return { pull, refreshing, dragging };
}
