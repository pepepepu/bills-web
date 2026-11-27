import styled from "styled-components";
import {
  CalendarStar,
  Check,
  HandCoins,
  Receipt,
  Repeat,
} from "@phosphor-icons/react";
import { formatBRL } from "../../utils/format";
import { squircle } from "../../styles/squircle";

export type TodayKind = "expense" | "debt" | "subscription";

export interface TodayItem {
  id: string;
  kind: TodayKind;
  title: string;
  amount: number;
  /** Toque na linha (abrir, ir para a tela...). */
  onOpen?: () => void;
  /** Botão de marcar como pago direto do card. */
  onPay?: () => void;
}

const icons = {
  expense: Receipt,
  debt: HandCoins,
  subscription: Repeat,
};

const Box = styled.section`
  position: relative;
  overflow: hidden;
  ${squircle(24)}
  padding: 1rem 1rem 0.6rem;
  color: ${({ theme }) => theme.colors.text.light};
  background: ${({ theme }) => theme.colors.primaryGradient};
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
`;

const Head = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.4rem;

  h2 {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 1.15rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  strong {
    font-size: 1.15rem;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.03em;
  }
`;

const Items = styled.ul`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Line = styled.li`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.45rem 0;

  & + & {
    border-top: 0.5px solid rgba(255, 255, 255, 0.28);
  }
`;

const Main = styled.button`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: inherit;
  text-align: left;
  font-weight: 600;

  > svg {
    flex-shrink: 0;
    font-size: 1.15rem;
    opacity: 0.9;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  b {
    margin-left: auto;
    font-variant-numeric: tabular-nums;
  }
`;

const Pay = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.3rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryHover};
  background: rgba(255, 255, 255, 0.92);
  transition: transform 0.25s ${({ theme }) => theme.motion.spring};

  &:active {
    transform: scale(0.92);
  }
`;

/** Card destacado com o que vence hoje e ainda não foi pago. */
const TodayCard = ({ items }: { items: TodayItem[] }) => {
  if (items.length === 0) return null;
  const total = items.reduce((acc, i) => acc + i.amount, 0);
  return (
    <Box aria-label="Vence hoje">
      <Head>
        <h2>
          <CalendarStar weight="fill" /> Para hoje
        </h2>
        <strong>{formatBRL(total)}</strong>
      </Head>
      <Items>
        {items.map((item) => {
          const Icon = icons[item.kind];
          return (
            <Line key={`${item.kind}-${item.id}`}>
              <Main type="button" onClick={item.onOpen}>
                <Icon weight="fill" />
                <span>{item.title}</span>
                <b>{formatBRL(item.amount)}</b>
              </Main>
              {item.onPay && (
                <Pay type="button" onClick={item.onPay}>
                  <Check weight="bold" /> Paguei
                </Pay>
              )}
            </Line>
          );
        })}
      </Items>
    </Box>
  );
};

export default TodayCard;
