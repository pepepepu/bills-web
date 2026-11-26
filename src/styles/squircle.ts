import { css } from "styled-components";

/**
 * "Squircle" (cantos contínuos da Apple).
 *
 * - squircle(r): para retângulos (cards, campos, botões). Onde o navegador
 *   entende `corner-shape` (Chrome/Edge recentes) o canto vira squircle de
 *   verdade; nos outros (Safari, Firefox) fica o border-radius normal.
 * - squircleMask: para elementos quadrados (ícones, tiles). Recorta com uma
 *   superelipse em SVG e funciona em todos os navegadores, inclusive Safari.
 */
export const squircle = (radius: number) => css`
  border-radius: ${radius}px;

  @supports (corner-shape: squircle) {
    corner-shape: squircle;
    border-radius: ${Math.round(radius * 1.7)}px;
  }
`;

const SQUIRCLE_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 0C87.5 0 100 12.5 100 50S87.5 100 50 100 0 87.5 0 50 12.5 0 50 0Z"/></svg>',
  );

export const squircleMask = css`
  -webkit-mask: url("${SQUIRCLE_SVG}") center / 100% 100% no-repeat;
  mask: url("${SQUIRCLE_SVG}") center / 100% 100% no-repeat;
`;
