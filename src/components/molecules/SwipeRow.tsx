import React, { useEffect, useId, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import { fadeUp } from "../../styles/animations";
import { squircle } from "../../styles/squircle";

const ACTION_W = 74;
const OPEN_EVENT = "bills:swipe-open";

const Li = styled.li<{ $done?: boolean }>`
  position: relative;
  overflow: hidden;
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

const Front = styled.div<{ $dragging: boolean }>`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 0;
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
  will-change: transform;
  transition: ${({ $dragging, theme }) =>
    $dragging ? "none" : `transform 0.45s ${theme.motion.spring}`};
`;

const Actions = styled.div<{ $dragging: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  padding: 6px 0 6px 6px;
  overflow: hidden;
  transition: ${({ $dragging, theme }) =>
    $dragging ? "none" : `width 0.45s ${theme.motion.spring}`};
`;

const ActionButton = styled.button<{ $tone: "edit" | "delete"; $wide?: boolean }>`
  height: 100%;
  flex: ${({ $wide }) => ($wide ? 2 : 1)};
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  ${squircle(14)}
  color: #fff;
  font-size: 0.7rem;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  white-space: nowrap;
  overflow: hidden;
  transition:
    flex 0.3s ${({ theme }) => theme.motion.spring},
    filter 0.2s ease;

  svg {
    font-size: 1.2rem;
  }

  &:active {
    filter: brightness(0.9);
  }

  ${({ $tone, theme }) =>
    $tone === "edit"
      ? css`
          background: linear-gradient(180deg, #8e8e93 0%, #7c7c82 100%);
        `
      : css`
          background: linear-gradient(180deg, #ff5147 0%, ${theme.colors.danger} 100%);
        `}
`;

interface SwipeRowProps {
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void | Promise<unknown>;
  /** Sem ações (ex.: item de outra pessoa). */
  disabled?: boolean;
  done?: boolean;
}

/**
 * Item de lista que arrasta da direita para o meio e mostra
 * "Editar" e "Excluir" (o excluir pede um segundo toque para confirmar).
 */
const SwipeRow = ({
  children,
  onEdit,
  onDelete,
  disabled = false,
  done,
}: SwipeRowProps) => {
  const id = useId();
  const actionsCount = (onEdit ? 1 : 0) + (onDelete ? 1 : 0);
  const max = actionsCount * ACTION_W + 6;
  const [x, setX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const gesture = useRef({
    startX: 0,
    startY: 0,
    origin: 0,
    mode: "idle" as "idle" | "pending" | "drag",
    moved: false,
  });

  const close = () => {
    setX(0);
    setConfirming(false);
  };

  // Abrir um item fecha os outros.
  useEffect(() => {
    const onOpen = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== id) close();
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, [id]);

  const enabled = !disabled && actionsCount > 0;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled || (e.pointerType === "mouse" && e.button !== 0)) return;
    gesture.current = {
      startX: e.clientX,
      startY: e.clientY,
      origin: x,
      mode: "pending",
      moved: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (g.mode === "idle") return;
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;

    if (g.mode === "pending") {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
        g.mode = "idle"; // rolagem vertical
        return;
      }
      if (Math.abs(dx) > 8) {
        g.mode = "drag";
        g.moved = true;
        setDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
      } else return;
    }

    let next = g.origin + dx;
    if (next > 0) next = next * 0.2; // elástico para a direita
    if (next < -max) next = -max + (next + max) * 0.35; // elástico além das ações
    setX(next);
  };

  const onPointerUp = () => {
    const g = gesture.current;
    if (g.mode === "drag") {
      setDragging(false);
      if (x < -max * 0.4) {
        setX(-max);
        window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: id }));
      } else close();
    }
    g.mode = "idle";
  };

  // Depois de arrastar, ou com o item aberto, o toque não vira clique.
  const onClickCapture = (e: React.MouseEvent) => {
    if (gesture.current.moved) {
      gesture.current.moved = false;
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (x !== 0) {
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  };

  const reveal = Math.max(0, -x);

  return (
    <Li $done={done}>
      {enabled && (
        <Actions
          $dragging={dragging}
          style={{ width: reveal }}
          aria-hidden={reveal === 0}
        >
          {onEdit && !confirming && (
            <ActionButton
              type="button"
              $tone="edit"
              tabIndex={reveal ? 0 : -1}
              onClick={() => {
                close();
                onEdit();
              }}
            >
              <PencilSimple weight="bold" />
              Editar
            </ActionButton>
          )}
          {onDelete && (
            <ActionButton
              type="button"
              $tone="delete"
              $wide={confirming}
              tabIndex={reveal ? 0 : -1}
              onClick={async () => {
                if (!confirming) {
                  setConfirming(true);
                  return;
                }
                close();
                await onDelete();
              }}
            >
              <Trash weight="bold" />
              {confirming ? "Confirmar" : "Excluir"}
            </ActionButton>
          )}
        </Actions>
      )}
      <Front
        $dragging={dragging}
        style={{ transform: `translate3d(${x}px, 0, 0)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
      >
        {children}
      </Front>
    </Li>
  );
};

export default SwipeRow;
