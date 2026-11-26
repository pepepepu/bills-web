import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import styled, { css } from "styled-components";
import { X } from "@phosphor-icons/react";
import { media } from "../../styles/medias";
import {
  fadeIn,
  fadeOut,
  modalIn,
  modalOut,
  sheetIn,
  sheetOut,
} from "../../styles/animations";
import { IconButton } from "./ui";
import { squircle } from "../../styles/squircle";

const Backdrop = styled.div<{ $closing: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(20, 20, 30, 0.22);
  backdrop-filter: ${({ theme }) => theme.blur.backdrop};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.backdrop};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 60;
  animation: ${({ $closing }) => ($closing ? fadeOut : fadeIn)} 0.28s ease
    both;

  ${media.tabletAndUp} {
    align-items: center;
  }
`;

const Panel = styled.div<{ $closing: boolean }>`
  width: 100%;
  max-width: 520px;
  max-height: 92dvh;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: ${({ theme }) => theme.colors.glassSheet};
  backdrop-filter: saturate(180%) blur(40px);
  -webkit-backdrop-filter: saturate(180%) blur(40px);
  border: 0.5px solid ${({ theme }) => theme.colors.glassEdge};
  border-bottom: none;
  border-radius: 28px 28px 0 0;
  padding: 0.5rem 1.25rem calc(1.75rem + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    ${({ theme }) => theme.shadows.float};

  ${({ $closing, theme }) =>
    $closing
      ? css`
          animation: ${sheetOut} 0.28s ${theme.motion.ease} both;
        `
      : css`
          animation: ${sheetIn} 0.5s ${theme.motion.spring} both;
        `}

  ${media.tabletAndUp} {
    ${squircle(28)}
    border-bottom: 0.5px solid ${({ theme }) => theme.colors.glassEdge};
    padding-bottom: 1.75rem;
    ${({ $closing, theme }) =>
      $closing
        ? css`
            animation: ${modalOut} 0.25s ease both;
          `
        : css`
            animation: ${modalIn} 0.45s ${theme.motion.spring} both;
          `}
  }
`;

const Grabber = styled.div`
  width: 36px;
  height: 5px;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.fillStrong};
  margin: 0.15rem auto 0.25rem;

  ${media.tabletAndUp} {
    display: none;
  }
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    font-size: 1.15rem;
    font-weight: 700;
  }
`;

interface SheetProps {
  title: string;
  onClose: () => void;
  closing?: boolean;
  children: React.ReactNode;
}

/** Bottom sheet no celular, modal centralizado no desktop. */
const Sheet = ({ title, onClose, closing = false, children }: SheetProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <Backdrop $closing={closing} onClick={onClose}>
      <Panel
        $closing={closing}
        role="dialog"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <Grabber />
        <Head>
          <h2>{title}</h2>
          <IconButton type="button" onClick={onClose} aria-label="Fechar">
            <X weight="bold" />
          </IconButton>
        </Head>
        {children}
      </Panel>
    </Backdrop>,
    document.body,
  );
};

export default Sheet;
