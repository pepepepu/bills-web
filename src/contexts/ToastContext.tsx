import React, { createContext, useCallback, useRef, useState } from "react";
import styled, { css } from "styled-components";
import {
  PiCheckCircleFill,
  PiInfoFill,
  PiWarningCircleFill,
} from "react-icons/pi";
import { toastIn, toastOut } from "../styles/animations";

type ToastKind = "success" | "error" | "info";

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
  leaving: boolean;
}

export interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

export const ToastContext = createContext<ToastApi>({} as ToastApi);

const Stack = styled.div`
  position: fixed;
  top: calc(0.75rem + env(safe-area-inset-top));
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  pointer-events: none;
  padding: 0 1rem;
`;

const Pill = styled.div<{ $kind: ToastKind; $leaving: boolean }>`
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  max-width: 420px;
  padding: 0.7rem 1.1rem 0.7rem 0.8rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border: 0.5px solid rgba(0, 0, 0, 0.06);
  box-shadow: ${({ theme }) => theme.shadows.float};
  color: ${({ theme }) => theme.colors.text.body};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  cursor: pointer;

  ${({ $leaving, theme }) =>
    $leaving
      ? css`
          animation: ${toastOut} 0.25s ease forwards;
        `
      : css`
          animation: ${toastIn} 0.5s ${theme.motion.bounce} both;
        `}

  svg {
    font-size: 1.35rem;
    color: ${({ theme, $kind }) =>
      $kind === "success"
        ? theme.colors.success
        : $kind === "error"
          ? theme.colors.danger
          : theme.colors.info};
  }
`;

const icons = {
  success: <PiCheckCircleFill />,
  error: <PiWarningCircleFill />,
  info: <PiInfoFill />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const seq = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((list) =>
      list.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
    );
    window.setTimeout(
      () => setToasts((list) => list.filter((t) => t.id !== id)),
      260,
    );
  }, []);

  const push = useCallback(
    (kind: ToastKind, message: string) => {
      const id = ++seq.current;
      setToasts((list) => [
        ...list.slice(-2),
        { id, kind, message, leaving: false },
      ]);
      window.setTimeout(() => dismiss(id), kind === "error" ? 4200 : 2600);
    },
    [dismiss],
  );

  const api = useRef<ToastApi>({
    success: (m) => push("success", m),
    error: (m) => push("error", m),
    info: (m) => push("info", m),
  }).current;

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Stack role="status" aria-live="polite">
        {toasts.map((t) => (
          <Pill
            key={t.id}
            $kind={t.kind}
            $leaving={t.leaving}
            onClick={() => dismiss(t.id)}
          >
            {icons[t.kind]}
            <span>{t.message}</span>
          </Pill>
        ))}
      </Stack>
    </ToastContext.Provider>
  );
}
