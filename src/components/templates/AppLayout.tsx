import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { PiSignOutBold } from "react-icons/pi";
import billsLogo from "../../assets/logos/bills-logo.svg";
import { useAuth } from "../../hooks/useAuth";
import { useMonth } from "../../hooks/useMonth";
import { fadeUp } from "../../styles/animations";
import { Image } from "../atoms";
import { BottomNav, IconButton, MonthSwitcher } from "../molecules";

/** Altura travada em 100dvh: só o conteúdo do meio rola. */
const Page = styled.div`
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
  overflow: hidden;
`;

const Header = styled.header<{ $scrolled: boolean }>`
  flex-shrink: 0;
  position: relative;
  z-index: 10;
  background: ${({ theme, $scrolled }) =>
    $scrolled ? theme.colors.glass : theme.colors.background};
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  box-shadow: ${({ $scrolled, theme }) =>
    $scrolled ? `0 0.5px 0 ${theme.colors.separator}` : "none"};
  transition:
    background 0.3s ease,
    box-shadow 0.3s ease;
`;

const HeaderInner = styled.div`
  max-width: 560px;
  margin: 0 auto;
  padding: calc(0.9rem + env(safe-area-inset-top)) 1.25rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Scroll = styled.main`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
`;

const Content = styled.div`
  max-width: 560px;
  margin: 0 auto;
  padding: 0.5rem 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  /* cards entram em cascata */
  & > * {
    animation: ${fadeUp} 0.55s ${({ theme }) => theme.motion.spring} both;
  }
  ${Array.from(
    { length: 10 },
    (_, i) => `& > *:nth-child(${i + 1}) { animation-delay: ${i * 55}ms; }`,
  ).join("\n")}
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 0.25rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.1;
`;

interface AppLayoutProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

const AppLayout = ({ title, action, children }: AppLayoutProps) => {
  const { logout } = useAuth();
  const { month } = useMonth();
  const { pathname } = useLocation();
  const scrollRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // Token vencido (API respondeu 401): volta para o login.
  useEffect(() => {
    window.addEventListener("bills:unauthorized", logout);
    return () => window.removeEventListener("bills:unauthorized", logout);
  }, [logout]);

  // Volta ao topo ao trocar de tela ou de mês.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [pathname, month]);

  return (
    <Page>
      <Header $scrolled={scrolled}>
        <HeaderInner>
          <TopRow>
            <Image
              src={billsLogo}
              alt="Bills"
              width={52}
              height={28}
              objectFit="contain"
            />
            <IconButton type="button" aria-label="Sair" onClick={logout}>
              <PiSignOutBold />
            </IconButton>
          </TopRow>
          <MonthSwitcher />
        </HeaderInner>
      </Header>

      <Scroll
        ref={scrollRef}
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 4)}
      >
        <Content key={`${pathname}-${month}`}>
          <TitleRow>
            <Title>{title}</Title>
            {action}
          </TitleRow>
          {children}
        </Content>
      </Scroll>

      <BottomNav />
    </Page>
  );
};

export default AppLayout;
