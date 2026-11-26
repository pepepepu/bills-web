import { keyframes } from "styled-components";

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px) scale(0.985); }
  to   { opacity: 1; transform: none; }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const fadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

export const sheetIn = keyframes`
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
`;

export const sheetOut = keyframes`
  from { transform: translateY(0); }
  to   { transform: translateY(100%); }
`;

export const modalIn = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.94); }
  to   { opacity: 1; transform: none; }
`;

export const modalOut = keyframes`
  from { opacity: 1; transform: none; }
  to   { opacity: 0; transform: translateY(12px) scale(0.96); }
`;

export const toastIn = keyframes`
  from { opacity: 0; transform: translateY(-24px) scale(0.9); }
  to   { opacity: 1; transform: none; }
`;

export const toastOut = keyframes`
  from { opacity: 1; transform: none; }
  to   { opacity: 0; transform: translateY(-16px) scale(0.92); }
`;

export const pop = keyframes`
  0%   { transform: scale(1); }
  40%  { transform: scale(1.25); }
  100% { transform: scale(1); }
`;

export const shimmer = keyframes`
  from { background-position: -200% 0; }
  to   { background-position: 200% 0; }
`;

export const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const spokeFade = keyframes`
  from { opacity: 1; }
  to   { opacity: 0.18; }
`;

/** Sub-botões do menu "Novo" saindo do botão central. */
export const burstIn = keyframes`
  from { opacity: 0; transform: translate(-50%, 0) scale(0.3); }
  to   { opacity: 1; transform: translate(calc(-50% + var(--x)), var(--y)) scale(1); }
`;

export const burstOut = keyframes`
  from { opacity: 1; transform: translate(calc(-50% + var(--x)), var(--y)) scale(1); }
  to   { opacity: 0; transform: translate(-50%, 0) scale(0.3); }
`;

export const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
`;
