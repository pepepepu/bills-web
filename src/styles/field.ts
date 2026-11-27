import { css } from "styled-components";
import { squircle } from "./squircle";

/**
 * Visual único de campo de texto do app inteiro:
 * Input (atom), TextInput, Select, MoneyInput, Login e Cadastro usam este.
 */
export const fieldSurface = css`
  width: 100%;
  min-height: 50px;
  background-color: ${({ theme }) => theme.colors.field};
  border: 1px solid ${({ theme }) => theme.colors.fieldBorder};
  ${squircle(14)}
  font-size: 1rem; /* 16px: evita o zoom automático do iOS */
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  color: ${({ theme }) => theme.colors.text.body};
  -webkit-text-fill-color: ${({ theme }) => theme.colors.text.body};
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03);
  transition:
    border-color 0.2s ease,
    box-shadow 0.25s ease,
    background-color 0.2s ease,
    opacity 0.2s ease;

  /* desabilitado (ex.: enquanto o formulário está salvando) */
  &:disabled,
  &:has(:disabled) {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const fieldFocus = css`
  background-color: ${({ theme }) => theme.colors.surface};
  border-color: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.primaryLight};
`;

export const fieldPadding = "0 0.95rem";
