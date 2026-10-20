export const breakpoints = {
  mobileMax: 767,
  tabletMin: 768,
  tabletMax: 1023,
  desktopMin: 1024,
};

export const media = {
  mobile: `@media (max-width: ${breakpoints.mobileMax}px)`,
  tablet: `@media (min-width: ${breakpoints.tabletMin}px) and (max-width: ${breakpoints.tabletMax}px)`,
  desktop: `@media (min-width: ${breakpoints.desktopMin}px)`,
  tabletAndDown: `@media (max-width: ${breakpoints.tabletMax}px)`,
  tabletAndUp: `@media (min-width: ${breakpoints.tabletMin}px)`,
};
