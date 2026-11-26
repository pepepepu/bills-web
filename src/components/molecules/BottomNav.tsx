import { NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  PiHouse,
  PiHouseFill,
  PiArrowCircleDown,
  PiArrowCircleDownFill,
  PiReceipt,
  PiReceiptFill,
  PiHandCoins,
  PiHandCoinsFill,
  PiCalendarDots,
  PiCalendarDotsFill,
  PiShoppingCart,
  PiShoppingCartFill,
} from "react-icons/pi";
import { pop } from "../../styles/animations";

const links = [
  { to: "/home", label: "Resumo", icon: PiHouse, active: PiHouseFill },
  {
    to: "/entradas",
    label: "Entradas",
    icon: PiArrowCircleDown,
    active: PiArrowCircleDownFill,
  },
  { to: "/contas", label: "Contas", icon: PiReceipt, active: PiReceiptFill },
  {
    to: "/dividas",
    label: "Dívidas",
    icon: PiHandCoins,
    active: PiHandCoinsFill,
  },
  {
    to: "/agenda",
    label: "Agenda",
    icon: PiCalendarDots,
    active: PiCalendarDotsFill,
  },
  {
    to: "/compras",
    label: "Compras",
    icon: PiShoppingCart,
    active: PiShoppingCartFill,
  },
];

const SIZE = 50;

const Nav = styled.nav`
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  padding: 0.5rem 1rem calc(0.75rem + env(safe-area-inset-bottom));
`;

const Bar = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(${links.length}, ${SIZE}px);
  padding: 6px;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: saturate(180%) blur(24px);
  -webkit-backdrop-filter: saturate(180%) blur(24px);
  border: 0.5px solid rgba(0, 0, 0, 0.06);
  box-shadow: ${({ theme }) => theme.shadows.float};
`;

/** Bolha que desliza até o item ativo. */
const Indicator = styled.span<{ $index: number }>`
  position: absolute;
  top: 6px;
  left: 6px;
  width: ${SIZE}px;
  height: ${SIZE}px;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.primaryGradient};
  box-shadow: ${({ theme }) => theme.shadows.button};
  transform: translateX(${({ $index }) => $index * SIZE}px);
  transition: transform 0.55s ${({ theme }) => theme.motion.bounce};
  opacity: ${({ $index }) => ($index < 0 ? 0 : 1)};
`;

const Item = styled(NavLink)`
  position: relative;
  z-index: 1;
  width: ${SIZE}px;
  height: ${SIZE}px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  color: ${({ theme }) => theme.colors.text.muted};
  transition:
    color 0.3s ease,
    transform 0.25s ${({ theme }) => theme.motion.spring};

  svg {
    font-size: 1.45rem;
  }

  &:active {
    transform: scale(0.86);
  }

  &.active {
    color: ${({ theme }) => theme.colors.text.light};

    svg {
      animation: ${pop} 0.45s ${({ theme }) => theme.motion.bounce};
    }
  }
`;

const BottomNav = () => {
  const { pathname } = useLocation();
  const index = links.findIndex((l) => pathname.startsWith(l.to));

  return (
    <Nav>
      <Bar>
        <Indicator $index={index} />
        {links.map((l) => {
          const Icon = index >= 0 && links[index].to === l.to ? l.active : l.icon;
          return (
            <Item key={l.to} to={l.to} aria-label={l.label} title={l.label}>
              <Icon />
            </Item>
          );
        })}
      </Bar>
    </Nav>
  );
};

export default BottomNav;
