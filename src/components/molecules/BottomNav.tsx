import { useEffect, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import {
  ArrowCircleDown,
  CalendarDots,
  HandCoins,
  House,
  Plus,
  Receipt,
  Repeat,
  ShoppingCart,
  type Icon,
} from "@phosphor-icons/react";
import { useSheetState } from "../../hooks/useSheetState";
import {
  burstIn,
  burstOut,
  fadeIn,
  fadeOut,
  pop,
} from "../../styles/animations";
import { glassStrong } from "../../styles/glass";
import { squircleMask } from "../../styles/squircle";

const ITEM_W = 76;
const ITEM_H = 54;

/** Subopções do botão "Novo": abrem a tela já com o formulário de criação. */
const createOptions: {
  label: string;
  to: string;
  icon: Icon;
  gradient: string;
  x: number;
  y: number;
}[] = [
  {
    label: "Entrada",
    to: "/entradas",
    icon: ArrowCircleDown,
    gradient: "linear-gradient(145deg, #5BE07F 0%, #28B04E 100%)",
    x: -132,
    y: -84,
  },
  {
    label: "Conta",
    to: "/contas",
    icon: Receipt,
    gradient: "linear-gradient(145deg, #4DA3FF 0%, #0A6CF0 100%)",
    x: -84,
    y: -166,
  },
  {
    label: "Dívida",
    to: "/dividas",
    icon: HandCoins,
    gradient: "linear-gradient(145deg, #C77DFF 0%, #8E3FD1 100%)",
    x: 0,
    y: -198,
  },
  {
    label: "Assinatura",
    to: "/assinaturas",
    icon: Repeat,
    gradient: "linear-gradient(145deg, #5AD8EA 0%, #1E9BB3 100%)",
    x: 84,
    y: -166,
  },
  {
    label: "Compras",
    to: "/compras",
    icon: ShoppingCart,
    gradient: "linear-gradient(145deg, #FFB340 0%, #FF8A00 100%)",
    x: 132,
    y: -84,
  },
];

const Nav = styled.nav`
  position: relative;
  z-index: 50;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  padding: 0.5rem 1rem calc(0.75rem + env(safe-area-inset-bottom));
`;

const Bar = styled.div`
  ${glassStrong}
  position: relative;
  display: grid;
  grid-template-columns: ${ITEM_W}px ${ITEM_W}px ${ITEM_W}px;
  align-items: center;
  padding: 6px;
  border-radius: 9999px;
`;

/** Bolha que desliza até o item ativo. */
const Indicator = styled.span<{ $index: number }>`
  position: absolute;
  top: 6px;
  left: 6px;
  width: ${ITEM_W}px;
  height: ${ITEM_H}px;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.primaryLight};
  box-shadow: inset 0 0 0 0.5px rgba(242, 85, 159, 0.18);
  transform: translateX(${({ $index }) => Math.max($index, 0) * ITEM_W}px)
    scale(${({ $index }) => ($index < 0 ? 0.6 : 1)});
  opacity: ${({ $index }) => ($index < 0 ? 0 : 1)};
  transition:
    transform 0.55s ${({ theme }) => theme.motion.bounce},
    opacity 0.3s ease;
`;

const Item = styled(NavLink)`
  position: relative;
  z-index: 1;
  width: ${ITEM_W}px;
  height: ${ITEM_H}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border-radius: 9999px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.66rem;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  transition:
    color 0.3s ease,
    transform 0.25s ${({ theme }) => theme.motion.spring};

  svg {
    font-size: 1.45rem;
  }

  &:active {
    transform: scale(0.88);
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};

    svg {
      animation: ${pop} 0.45s ${({ theme }) => theme.motion.bounce};
    }
  }
`;

const FabSlot = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
`;

const Fab = styled.button<{ $open: boolean }>`
  width: 54px;
  height: 54px;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.6rem;
  background: ${({ theme, $open }) =>
    $open
      ? "linear-gradient(145deg, #3A3A3C 0%, #1C1C1E 100%)"
      : theme.colors.primaryGradient};
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.35),
    ${({ theme, $open }) =>
      $open ? "0 6px 18px rgba(0,0,0,0.25)" : theme.shadows.button};
  transition:
    transform 0.35s ${({ theme }) => theme.motion.bounce},
    background 0.3s ease,
    box-shadow 0.3s ease;

  svg {
    transition: transform 0.45s ${({ theme }) => theme.motion.bounce};
    transform: rotate(${({ $open }) => ($open ? 135 : 0)}deg);
  }

  &:active {
    transform: scale(0.9);
  }
`;

const Backdrop = styled.div<{ $closing: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 45;
  background: rgba(242, 242, 247, 0.35);
  backdrop-filter: saturate(160%) blur(16px);
  -webkit-backdrop-filter: saturate(160%) blur(16px);
  animation: ${({ $closing }) => ($closing ? fadeOut : fadeIn)} 0.3s ease both;
`;

const Option = styled.button<{ $closing: boolean; $i: number }>`
  position: absolute;
  left: 50%;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  width: 76px;
  color: ${({ theme }) => theme.colors.text.body};
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  transform: translate(calc(-50% + var(--x)), var(--y));

  ${({ $closing, $i, theme }) =>
    $closing
      ? css`
          animation: ${burstOut} 0.26s ${theme.motion.ease} both;
          animation-delay: ${(createOptions.length - 1 - $i) * 25}ms;
        `
      : css`
          animation: ${burstIn} 0.55s ${theme.motion.bounce} both;
          animation-delay: ${$i * 45}ms;
        `}

  &:active .bubble {
    transform: scale(0.9);
  }
`;

const Bubble = styled.span<{ $gradient: string }>`
  ${squircleMask}
  width: 56px;
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.6rem;
  background: ${({ $gradient }) => $gradient};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition: transform 0.25s ${({ theme }) => theme.motion.spring};
`;

const OptionLabel = styled.span`
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.glassStrong};
  backdrop-filter: ${({ theme }) => theme.blur.card};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.card};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const BottomNav = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menu, setMenu, closing] = useSheetState<true>();
  const open = !!menu && !closing;
  const index = pathname.startsWith("/home")
    ? 0
    : pathname.startsWith("/agenda")
      ? 2
      : -1;

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu, setMenu]);

  const pick = (to: string) => {
    setMenu(null);
    navigate(`${to}?novo=1`);
  };

  return (
    <Nav>
      {menu &&
        createPortal(
          <Backdrop $closing={closing} onClick={() => setMenu(null)} />,
          document.body,
        )}
      <Bar>
        <Indicator $index={index} />
        <Item to="/home" aria-label="Início">
          <House weight={index === 0 ? "fill" : "regular"} />
          Início
        </Item>
        <FabSlot>
          {menu && createOptionsList(closing, pick)}
          <Fab
            type="button"
            $open={open}
            aria-label={open ? "Fechar menu Novo" : "Novo"}
            aria-expanded={open}
            onClick={() => setMenu(open ? null : true)}
          >
            <Plus weight="bold" />
          </Fab>
        </FabSlot>
        <Item to="/agenda" aria-label="Agenda">
          <CalendarDots weight={index === 2 ? "fill" : "regular"} />
          Agenda
        </Item>
      </Bar>
    </Nav>
  );
};

function createOptionsList(closing: boolean, pick: (to: string) => void) {
  return createOptions.map((o, i) => {
    const Icon = o.icon;
    return (
      <Option
        key={o.to}
        type="button"
        $closing={closing}
        $i={i}
        style={{ "--x": `${o.x}px`, "--y": `${o.y}px` } as CSSProperties}
        onClick={() => pick(o.to)}
      >
        <Bubble className="bubble" $gradient={o.gradient}>
          <Icon weight="fill" />
        </Bubble>
        <OptionLabel>{o.label}</OptionLabel>
      </Option>
    );
  });
}

export default BottomNav;
