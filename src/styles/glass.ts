import { css } from "styled-components";

/** Vidro estilo Apple: translúcido, desfocado e com brilho na borda de cima. */
export const glass = css`
  background: ${({ theme }) => theme.colors.glassCard};
  backdrop-filter: ${({ theme }) => theme.blur.card};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.card};
  border: 0.5px solid ${({ theme }) => theme.colors.glassEdge};
  box-shadow: ${({ theme }) => theme.shadows.glass};
`;

export const glassStrong = css`
  background: ${({ theme }) => theme.colors.glassStrong};
  backdrop-filter: ${({ theme }) => theme.blur.bar};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.bar};
  border: 0.5px solid ${({ theme }) => theme.colors.glassEdge};
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    ${({ theme }) => theme.shadows.float};
`;
