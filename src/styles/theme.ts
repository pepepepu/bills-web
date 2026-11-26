/**
 * Paleta inspirada nas cores de sistema da Apple (iOS/macOS),
 * mantendo o rosa da marca Bills como cor de destaque.
 * Todas as chaves antigas continuam existindo.
 */
export const theme = {
  colors: {
    background: "#F2F2F7",
    surface: "#FFFFFF",
    surfaceLight: "#F2F2F7",
    surfaceHighlight: "#E5E5EA",
    glass: "rgba(255, 255, 255, 0.72)",
    glassBorder: "rgba(255, 255, 255, 0.6)",
    /** Vidro estilo Apple: cards, barras e folhas. */
    glassCard: "rgba(255, 255, 255, 0.58)",
    glassStrong: "rgba(255, 255, 255, 0.78)",
    glassSheet: "rgba(246, 246, 250, 0.86)",
    glassEdge: "rgba(255, 255, 255, 0.75)",
    /** Campos de texto. */
    field: "rgba(255, 255, 255, 0.72)",
    fieldBorder: "rgba(60, 60, 67, 0.14)",
    fill: "rgba(118, 118, 128, 0.12)",
    fillStrong: "rgba(118, 118, 128, 0.2)",

    border: "rgba(60, 60, 67, 0.12)",
    borderLight: "rgba(60, 60, 67, 0.29)",
    separator: "rgba(60, 60, 67, 0.12)",

    primary: "#F2559F",
    primaryHover: "#DB3F8A",
    primaryLight: "rgba(242, 85, 159, 0.12)",
    primaryGradient: "linear-gradient(135deg, #FF6FB1 0%, #F2559F 50%, #D9468E 100%)",

    secondary: "#1C1C1E",
    secondaryHover: "#3A3A3C",

    danger: "#FF3B30",
    dangerLight: "rgba(255, 59, 48, 0.12)",

    warning: "#FF9500",
    warningLight: "rgba(255, 149, 0, 0.14)",

    success: "#34C759",
    successText: "#248A3D",
    successLight: "rgba(52, 199, 89, 0.14)",

    info: "#007AFF",
    infoLight: "rgba(0, 122, 255, 0.12)",

    /** Cores de sistema extras, usadas nos ícones e na agenda. */
    indigo: "#5856D6",
    indigoLight: "rgba(88, 86, 214, 0.14)",
    purple: "#AF52DE",
    purpleLight: "rgba(175, 82, 222, 0.14)",
    teal: "#30B0C7",
    tealLight: "rgba(48, 176, 199, 0.14)",
    mint: "#00C7BE",
    orange: "#FF9500",
    yellow: "#FFCC00",

    text: {
      title: "#1C1C1E",
      body: "#1C1C1E",
      secondary: "rgba(60, 60, 67, 0.85)",
      muted: "rgba(60, 60, 67, 0.6)",
      light: "#FFFFFF",
    },
  },

  fonts: {
    title:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'DM Sans', 'Segoe UI', sans-serif",
    body: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'DM Sans', 'Segoe UI', sans-serif",
  },

  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
  },

  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  radius: {
    sm: "6px",
    md: "10px",
    lg: "14px",
    xl: "20px",
    full: "9999px",
  },

  shadows: {
    card: "0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04)",
    glass:
      "inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 0 0 0.5px rgba(255, 255, 255, 0.5), 0 1px 2px rgba(0, 0, 0, 0.03), 0 10px 30px rgba(60, 40, 120, 0.07)",
    float: "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06)",
    button: "0 4px 14px rgba(242, 85, 159, 0.35)",
  },

  /** Desfoque do vidro. */
  blur: {
    card: "saturate(180%) blur(28px)",
    bar: "saturate(190%) blur(30px)",
    backdrop: "saturate(160%) blur(18px)",
  },

  motion: {
    spring: "cubic-bezier(0.32, 0.72, 0, 1)",
    bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    ease: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  },
};
