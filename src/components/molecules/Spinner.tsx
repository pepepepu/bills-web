import styled from "styled-components";
import { fadeIn, spokeFade } from "../../styles/animations";

const SPOKES = 8;

const Wrap = styled.span<{ $size: number; $color?: string }>`
  position: relative;
  display: inline-block;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  flex-shrink: 0;
  color: ${({ $color, theme }) => $color || theme.colors.text.secondary};

  span {
    position: absolute;
    left: calc(50% - ${({ $size }) => Math.max(1.5, $size * 0.045)}px);
    top: 0;
    width: ${({ $size }) => Math.max(3, $size * 0.09)}px;
    height: ${({ $size }) => $size * 0.28}px;
    border-radius: 9999px;
    background: currentColor;
    transform-origin: 50% ${({ $size }) => $size / 2}px;
    animation: ${spokeFade} 0.8s linear infinite;
  }

  ${Array.from(
    { length: SPOKES },
    (_, i) => `
    span:nth-child(${i + 1}) {
      transform: rotate(${i * (360 / SPOKES)}deg);
      animation-delay: ${-((SPOKES - i) / SPOKES) * 0.8}s;
    }`,
  ).join("\n")}
`;

/** Indicador de atividade no estilo do iOS. */
export const Spinner = ({
  size = 22,
  color,
  label = "Carregando",
}: {
  size?: number;
  color?: string;
  label?: string;
}) => (
  <Wrap $size={size} $color={color} role="status" aria-label={label}>
    {Array.from({ length: SPOKES }).map((_, i) => (
      <span key={i} />
    ))}
  </Wrap>
);

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  padding: 2rem 1rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  animation: ${fadeIn} 0.3s ease 0.1s both;
`;

/** Bloco de carregamento para listas e cards. */
export const Loading = ({ label = "Carregando..." }: { label?: string }) => (
  <Center aria-busy="true">
    <Spinner size={28} />
    <span>{label}</span>
  </Center>
);
