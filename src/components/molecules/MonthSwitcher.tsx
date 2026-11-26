import styled, { keyframes } from "styled-components";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useMonth } from "../../hooks/useMonth";
import { currentMonth, monthLabel, shiftMonth } from "../../utils/format";

const slide = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.glassCard};
  backdrop-filter: ${({ theme }) => theme.blur.card};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.card};
  border: 0.5px solid ${({ theme }) => theme.colors.glassEdge};
  box-shadow: ${({ theme }) => theme.shadows.glass};
`;

const Arrow = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.body};
  flex-shrink: 0;
  transition:
    transform 0.25s ${({ theme }) => theme.motion.spring},
    background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }

  &:active {
    transform: scale(0.88);
  }
`;

const Label = styled.button`
  flex: 1;
  text-align: center;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.body};
  animation: ${slide} 0.35s ${({ theme }) => theme.motion.spring};
`;

const MonthSwitcher = () => {
  const { month, setMonth } = useMonth();
  return (
    <Wrapper>
      <Arrow
        type="button"
        aria-label="Mês anterior"
        onClick={() => setMonth(shiftMonth(month, -1))}
      >
        <CaretLeft weight="bold" />
      </Arrow>
      <Label
        key={month}
        type="button"
        title="Voltar para o mês atual"
        onClick={() => setMonth(currentMonth())}
      >
        {monthLabel(month)}
      </Label>
      <Arrow
        type="button"
        aria-label="Próximo mês"
        onClick={() => setMonth(shiftMonth(month, 1))}
      >
        <CaretRight weight="bold" />
      </Arrow>
    </Wrapper>
  );
};

export default MonthSwitcher;
