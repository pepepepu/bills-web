import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: light;
  }

  html, body, #root {
    height: 100dvh;
    overflow: hidden;
  }

  body {
    background-color: ${({ theme }) => theme.colors.background};
    /* manchas de cor suaves atrás do vidro (o blur precisa de algo atrás) */
    background-image:
      radial-gradient(40% 32% at 10% 6%, rgba(255, 111, 177, 0.26), transparent 70%),
      radial-gradient(36% 30% at 95% 16%, rgba(88, 86, 214, 0.18), transparent 70%),
      radial-gradient(44% 34% at 88% 80%, rgba(48, 176, 199, 0.18), transparent 70%),
      radial-gradient(40% 32% at 6% 92%, rgba(255, 179, 64, 0.18), transparent 70%);
    background-attachment: fixed;
    color: ${({ theme }) => theme.colors.text.body};
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    letter-spacing: -0.01em;
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
  }

  /* Telas públicas (Hero, Login, Cadastro) rolam dentro do #root */
  #root {
    overflow-y: auto;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.colors.text.title};
    font-family: ${({ theme }) => theme.fonts.title};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    letter-spacing: -0.02em;
  }

  button, input, textarea, select {
    font-family: ${({ theme }) => theme.fonts.body};
  }

  /* Texto sempre legível nos campos, inclusive com autofill e modo escuro do SO */
  input, textarea, select {
    color: ${({ theme }) => theme.colors.text.body};
    -webkit-text-fill-color: ${({ theme }) => theme.colors.text.body};
    caret-color: ${({ theme }) => theme.colors.primary};
  }

  input::placeholder, textarea::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
    -webkit-text-fill-color: ${({ theme }) => theme.colors.text.muted};
  }

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px ${({ theme }) => theme.colors.surface} inset;
  }

  /* Ícones nunca encolhem dentro de flex */
  svg {
    flex-shrink: 0;
  }

  button {
    -webkit-tap-highlight-color: transparent;
  }

  ::selection {
    background: ${({ theme }) => theme.colors.primaryLight};
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
