import styled, { css } from "styled-components";
import { fadeUp, pop, shimmer } from "../../styles/animations";

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
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
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
`;

type Tone = "success" | "warning" | "danger" | "primary" | "neutral" | "info";

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
    const map = {
      success: [theme.colors.successLight, theme.colors.successText],
      warning: [theme.colors.warningLight, "#C93400"],
      danger: [theme.colors.dangerLight, "#D70015"],
      primary: [theme.colors.primaryLight, theme.colors.primaryHover],
      info: [theme.colors.infoLight, theme.colors.info],
      neutral: [theme.colors.fill, theme.colors.text.secondary],
    } as const;
    const [bg, fg] = map[$tone];
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
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.fill};
`;

export const Chip = styled.button<{ $active: boolean }>`
  position: relative;
  z-index: 1;
  padding: 0.45rem 0.75rem;
  border-radius: 8px;
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
  border-radius: ${({ theme }) => theme.radius.lg};
  color: #d70015;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export const InfoBanner = styled.div`
  padding: 0.8rem 1rem;
  background-color: ${({ theme }) => theme.colors.infoLight};
  border-radius: ${({ theme }) => theme.radius.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const EmptyState = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  animation: ${fadeUp} 0.4s ${({ theme }) => theme.motion.spring} both;
`;

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
  background: ${({ theme, $highlight }) =>
    $highlight ? theme.colors.primaryGradient : theme.colors.surface};
  color: ${({ theme, $highlight }) =>
    $highlight ? theme.colors.text.light : theme.colors.text.body};
  box-shadow: ${({ theme, $highlight }) =>
    $highlight ? theme.shadows.button : theme.shadows.card};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 0.95rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  small {
    font-size: ${({ theme }) => theme.fontSizes.xs};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    opacity: ${({ $highlight }) => ($highlight ? 0.9 : 0.6)};
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
  border-radius: ${({ $round }) => ($round ? "9999px" : "6px")};
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
  width: 100%;
  min-height: 46px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.7rem 0.9rem;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  color: ${({ theme }) => theme.colors.text.body};
  -webkit-text-fill-color: ${({ theme }) => theme.colors.text.body};
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.primaryLight};
  }
`;

export const TextInput = styled.input`
  ${fieldBox}
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
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.fill};
`;

export const SegmentButton = styled.button<{ $active: boolean }>`
  padding: 0.55rem 0.5rem;
  border-radius: 8px;
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
