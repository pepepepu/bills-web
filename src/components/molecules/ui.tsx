import type React from "react";
import styled, { css, type DefaultTheme } from "styled-components";
import { fadeUp, pop, shimmer } from "../../styles/animations";
import { fieldFocus, fieldPadding, fieldSurface } from "../../styles/field";
import { glass } from "../../styles/glass";
import { squircle, squircleMask } from "../../styles/squircle";

/** Peças visuais compartilhadas pelas telas, todas a partir do theme.ts. */

const pressable = css`
  transition:
    transform 0.25s ${({ theme }) => theme.motion.spring},
    background-color 0.2s ease,
    box-shadow 0.25s ease,
    opacity 0.2s ease;

  &:active:not(:disabled) {
    transform: scale(0.96);
  }
`;

export const Card = styled.section`
  ${glass}
  ${squircle(22)}
  padding: 1.1rem 1.15rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: -0.02em;
`;

export type Tone =
  | "success"
  | "warning"
  | "danger"
  | "primary"
  | "neutral"
  | "info"
  | "indigo"
  | "purple"
  | "teal";

/** Cor de fundo e do ícone de cada tom. */
export const toneColors = (
  theme: DefaultTheme,
  tone: Tone,
) =>
  ({
    success: [theme.colors.successLight, theme.colors.successText],
    warning: [theme.colors.warningLight, "#C93400"],
    danger: [theme.colors.dangerLight, "#D70015"],
    primary: [theme.colors.primaryLight, theme.colors.primaryHover],
    info: [theme.colors.infoLight, theme.colors.info],
    indigo: [theme.colors.indigoLight, theme.colors.indigo],
    purple: [theme.colors.purpleLight, theme.colors.purple],
    teal: [theme.colors.tealLight, "#0E8FA6"],
    neutral: [theme.colors.fill, theme.colors.text.secondary],
  })[tone];

/** Quadradinho squircle com ícone colorido (títulos, atalhos, estados vazios). */
export const IconTile = styled.span<{ $tone?: Tone; $size?: number }>`
  ${squircleMask}
  width: ${({ $size = 30 }) => $size}px;
  height: ${({ $size = 30 }) => $size}px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: ${({ $size = 30 }) => Math.round($size * 0.56)}px;
  ${({ theme, $tone = "primary" }) => {
    const [bg, fg] = toneColors(theme, $tone);
    return css`
      background: ${bg};
      color: ${fg};
    `;
  }}
`;

const CardTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;

  h2 {
    flex: 1;
    min-width: 0;
    font-size: 1.1rem;
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    letter-spacing: -0.02em;
  }
`;

/** Título de card com ícone (e ação opcional à direita). */
export const CardTitle = ({
  icon,
  tone = "primary",
  children,
  action,
}: {
  icon: React.ReactNode;
  tone?: Tone;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <CardTitleRow>
    <IconTile $tone={tone}>{icon}</IconTile>
    <h2>{children}</h2>
    {action}
  </CardTitleRow>
);

export const Muted = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.muted};
`;

export const Row = styled.div<{ $gap?: string; $justify?: string }>`
  display: flex;
  align-items: center;
  flex-wrap: ${({ $justify }) =>
    $justify === "space-between" ? "nowrap" : "wrap"};
  gap: ${({ $gap }) => $gap || "0.5rem"};
  justify-content: ${({ $justify }) => $justify || "flex-start"};
`;

export const PillButton = styled.button<{
  $variant?: "solid" | "outline" | "primary" | "ghost" | "danger";
  $full?: boolean;
  $small?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: ${({ $full }) => ($full ? "100%" : "auto")};
  padding: ${({ $small }) => ($small ? "0.5rem 0.95rem" : "0.95rem 1.25rem")};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme, $small }) =>
    $small ? theme.fontSizes.sm : theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border: 1px solid transparent;
  white-space: nowrap;
  ${pressable}

  ${({ theme, $variant = "primary" }) => {
    switch ($variant) {
      case "outline":
        return css`
          border-color: ${theme.colors.borderLight};
          color: ${theme.colors.text.body};
          background: transparent;
        `;
      case "danger":
        return css`
          background: ${theme.colors.dangerLight};
          color: ${theme.colors.danger};
        `;
      case "ghost":
        return css`
          background: ${theme.colors.fill};
          color: ${theme.colors.text.body};
          &:hover:not(:disabled) {
            background: ${theme.colors.fillStrong};
          }
        `;
      case "solid":
        return css`
          background: ${theme.colors.secondary};
          color: ${theme.colors.text.light};
          &:hover:not(:disabled) {
            background: ${theme.colors.secondaryHover};
          }
        `;
      default:
        return css`
          background: ${theme.colors.primaryGradient};
          color: ${theme.colors.text.light};
          box-shadow: ${theme.shadows.button};
          &:hover:not(:disabled) {
            filter: brightness(1.04);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }

  svg {
    font-size: 1.1em;
  }
`;

export const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.full};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.body};
  background: ${({ theme }) => theme.colors.fill};
  font-size: 1.05rem;
  flex-shrink: 0;
  ${pressable}

  &:hover {
    background: ${({ theme }) => theme.colors.fillStrong};
  }

  svg {
    font-size: 1.15rem;
  }
`;

export const Badge = styled.span<{ $tone?: Tone }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.12rem 0.5rem;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 0.7rem;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: 0.01em;
  white-space: nowrap;
  flex-shrink: 0;

  ${({ theme, $tone = "neutral" }) => {
    const [bg, fg] = toneColors(theme, $tone);
    return css`
      background: ${bg};
      color: ${fg};
    `;
  }}
`;

/** Controle segmentado estilo iOS com indicador deslizante. */
export const Chips = styled.div`
  position: relative;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  padding: 3px;
  ${squircle(12)}
  background: ${({ theme }) => theme.colors.fill};
  backdrop-filter: ${({ theme }) => theme.blur.card};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.card};
`;

export const Chip = styled.button<{ $active: boolean }>`
  position: relative;
  z-index: 1;
  padding: 0.45rem 0.75rem;
  ${squircle(9)}
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.fontWeights.semibold : theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.body};
  white-space: nowrap;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.surface : "transparent"};
  box-shadow: ${({ $active }) =>
    $active ? "0 3px 8px rgba(0,0,0,0.12), 0 3px 1px rgba(0,0,0,0.04)" : "none"};
  transition:
    background 0.25s ease,
    box-shadow 0.25s ease;
`;

export const ErrorBanner = styled.div`
  padding: 0.8rem 1rem;
  background-color: ${({ theme }) => theme.colors.dangerLight};
  ${squircle(14)}
  color: #d70015;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export const InfoBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.8rem 1rem;
  background-color: ${({ theme }) => theme.colors.infoLight};
  ${squircle(14)}

  svg {
    font-size: 1.15rem;
    color: ${({ theme }) => theme.colors.info};
    margin-top: 0.05rem;
  }
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const EmptyBox = styled.div`
  padding: 1.6rem 1rem 1.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  animation: ${fadeUp} 0.4s ${({ theme }) => theme.motion.spring} both;

  strong {
    color: ${({ theme }) => theme.colors.text.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    margin-top: 0.35rem;
  }
`;

/** Estado vazio com ícone, título, dica e ação opcional. */
export const EmptyState = ({
  icon,
  tone = "neutral",
  title,
  children,
  action,
}: {
  icon: React.ReactNode;
  tone?: Tone;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <EmptyBox>
    <IconTile $tone={tone} $size={56}>
      {icon}
    </IconTile>
    <strong>{title}</strong>
    {children && <span>{children}</span>}
    {action && <div style={{ marginTop: "0.6rem" }}>{action}</div>}
  </EmptyBox>
);

export const List = styled.ul`
  display: flex;
  flex-direction: column;
`;

export const ListItem = styled.li<{ $done?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 0;
  transition: opacity 0.3s ease;
  opacity: ${({ $done }) => ($done ? 0.55 : 1)};
  animation: ${fadeUp} 0.45s ${({ theme }) => theme.motion.spring} both;

  ${Array.from(
    { length: 12 },
    (_, i) => `&:nth-child(${i + 1}) { animation-delay: ${i * 35}ms; }`,
  ).join("\n")}

  /* separador inset, estilo lista do iOS */
  &:not(:last-child)::after {
    content: "";
    position: absolute;
    left: 2.6rem;
    right: 0;
    bottom: 0;
    height: 0.5px;
    background: ${({ theme }) => theme.colors.separator};
  }
`;

export const ItemMain = styled.button`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  text-align: left;
  color: inherit;
`;

export const ItemTitle = styled.span<{ $done?: boolean }>`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-decoration: ${({ $done }) => ($done ? "line-through" : "none")};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
`;

export const Amount = styled.span<{ $tone?: "danger" | "success" }>`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  flex-shrink: 0;
  color: ${({ theme, $tone }) =>
    $tone === "danger"
      ? theme.colors.danger
      : $tone === "success"
        ? theme.colors.successText
        : theme.colors.text.body};
`;

export const CheckButton = styled.button<{ $checked: boolean }>`
  width: 26px;
  height: 26px;
  border-radius: ${({ theme }) => theme.radius.full};
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  border: 1.5px solid
    ${({ theme, $checked }) =>
      $checked ? theme.colors.success : theme.colors.borderLight};
  background: ${({ theme, $checked }) =>
    $checked ? theme.colors.success : "transparent"};
  color: ${({ theme }) => theme.colors.text.light};
  transition:
    background 0.25s ease,
    border-color 0.25s ease;
  ${({ $checked }) =>
    $checked &&
    css`
      animation: ${pop} 0.35s ${({ theme }) => theme.motion.bounce};
    `}

  &:disabled {
    opacity: 0.4;
  }
`;

export const TotalsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

export const Stat = styled.div<{ $highlight?: boolean }>`
  position: relative;
  overflow: hidden;
  ${({ $highlight }) =>
    $highlight
      ? css`
          background: ${({ theme }) => theme.colors.primaryGradient};
          color: ${({ theme }) => theme.colors.text.light};
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.35),
            ${({ theme }) => theme.shadows.button};

          /* brilho de vidro por cima do gradiente */
          &::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(
              160deg,
              rgba(255, 255, 255, 0.32) 0%,
              rgba(255, 255, 255, 0) 45%
            );
            pointer-events: none;
          }
        `
      : css`
          ${glass}
          color: ${({ theme }) => theme.colors.text.body};
        `}
  ${squircle(20)}
  padding: 0.95rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  small {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: ${({ theme }) => theme.fontSizes.xs};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    opacity: ${({ $highlight }) => ($highlight ? 0.92 : 0.62)};

    svg {
      font-size: 0.95rem;
    }
  }

  strong {
    font-size: 1.3rem;
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.03em;
  }
`;

/* ---------- Skeletons ---------- */

export const Skeleton = styled.span<{
  $w?: string;
  $h?: string;
  $round?: boolean;
}>`
  display: block;
  width: ${({ $w }) => $w || "100%"};
  height: ${({ $h }) => $h || "0.9rem"};
  border-radius: ${({ $round }) => ($round ? "9999px" : "7px")};
  background: linear-gradient(
    90deg,
    rgba(118, 118, 128, 0.1) 0%,
    rgba(118, 118, 128, 0.2) 50%,
    rgba(118, 118, 128, 0.1) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
  flex-shrink: 0;
`;

/* ---------- Formulários ---------- */

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.secondary};
  flex: 1;
  min-width: 0;
`;

export const fieldBox = css`
  ${fieldSurface}
  padding: ${fieldPadding};
  outline: none;

  &:focus {
    ${fieldFocus}
  }
`;

export const TextInput = styled.input`
  ${fieldBox}

  /* data no iOS: alinhada à esquerda e com a mesma altura */
  &[type="date"] {
    -webkit-appearance: none;
    appearance: none;
    display: flex;
    align-items: center;
    text-align: left;
  }
  &::-webkit-date-and-time-value {
    text-align: left;
  }
`;

export const Select = styled.select`
  ${fieldBox}
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238E8E93' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.9rem center;
  padding-right: 2.2rem;
`;

export const Segmented = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  padding: 3px;
  ${squircle(12)}
  background: ${({ theme }) => theme.colors.fill};
`;

export const SegmentButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.55rem 0.5rem;
  ${squircle(9)}
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.surface : "transparent"};
  box-shadow: ${({ $active }) =>
    $active ? "0 3px 8px rgba(0,0,0,0.12), 0 3px 1px rgba(0,0,0,0.04)" : "none"};
  color: ${({ theme }) => theme.colors.text.body};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.fontWeights.semibold : theme.fontWeights.medium};
  transition:
    background-color 0.25s ease,
    box-shadow 0.25s ease;
`;
