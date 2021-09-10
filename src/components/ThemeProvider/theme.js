import { pxToRem } from 'utils/style';

const systemFontStack =
  'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Ubuntu, Helvetica Neue, sans-serif';

// Full list of tokens
const baseTokens = {
  rgbBlack: '0, 0, 0',
  rgbWhite: '255, 255, 255',
  rgbGray: '36, 44, 57',
  rgbBackground: '255, 185, 97',
  rgbPrimary: '24, 160, 251',
  rgbAccent: '24, 160, 251',
  bezierFastoutSlowin: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  durationXS: '200ms',
  durationS: '300ms',
  durationM: '400ms',
  durationL: '600ms',
  durationXL: '800ms',
  systemFontStack,
  fontStack: `Inter, ${systemFontStack}`,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  fontSizeH0: pxToRem(140),
  fontSizeH1: pxToRem(100),
  fontSizeH2: pxToRem(58),
  fontSizeH3: pxToRem(38),
  fontSizeH4: pxToRem(28),
  fontSizeBodyXL: pxToRem(22),
  fontSizeBodyL: pxToRem(20),
  fontSizeBodyM: pxToRem(18),
  fontSizeBodyS: pxToRem(16),
  fontSizeBodyXS: pxToRem(14),
  lineHeightTitle: '1.1',
  lineHeightBody: '1.4',
  maxWidthS: '540px',
  maxWidthM: '720px',
  maxWidthL: '1096px',
  maxWidthXL: '1680px',
  spaceOuter: '64px',
  spaceXS: '4px',
  spaceS: '8px',
  spaceM: '16px',
  spaceL: '24px',
  spaceXL: '32px',
  space2XL: '48px',
  space3XL: '64px',
  space4XL: '96px',
  space5XL: '128px',
};

// Tokens that change based on viewport size
const tokensDesktop = {
  fontSizeH0: pxToRem(120),
  fontSizeH1: pxToRem(80),
};

const tokensLaptop = {
  maxWidthS: '480px',
  maxWidthM: '640px',
  maxWidthL: '1000px',
  maxWidthXL: '1100px',
  spaceOuter: '48px',
  fontSizeH0: pxToRem(100),
  fontSizeH1: pxToRem(70),
  fontSizeH2: pxToRem(52),
  fontSizeH3: pxToRem(36),
  fontSizeH4: pxToRem(26),
};

const tokensTablet = {
  fontSizeH0: pxToRem(80),
  fontSizeH1: pxToRem(60),
  fontSizeH2: pxToRem(48),
  fontSizeH3: pxToRem(32),
  fontSizeH4: pxToRem(24),
};

const tokensMobile = {
  spaceOuter: '24px',
  fontSizeH0: pxToRem(56),
  fontSizeH1: pxToRem(40),
  fontSizeH2: pxToRem(34),
  fontSizeH3: pxToRem(28),
  fontSizeH4: pxToRem(22),
  fontSizeBodyL: pxToRem(18),
  fontSizeBodyM: pxToRem(16),
  fontSizeBodyS: pxToRem(14),
};

const tokensMobileSmall = {
  spaceOuter: '16px',
  fontSizeH0: pxToRem(42),
  fontSizeH1: pxToRem(38),
  fontSizeH2: pxToRem(28),
  fontSizeH3: pxToRem(24),
  fontSizeH4: pxToRem(20),
};

export const tokens = {
  base: baseTokens,
  desktop: tokensDesktop,
  laptop: tokensLaptop,
  tablet: tokensTablet,
  mobile: tokensMobile,
  mobileS: tokensMobileSmall,
};

// Tokens that change based on theme
const dark = {
  themeId: 'dark',
  rgbSurface: '34, 34, 34',
  rgbSurfaceDark: '22, 22, 22',
  rgbText: '200, 200, 200',
  rgbBorder: '60, 60, 60',
  rgbError: '255, 0, 60',
  colorTextTitle: 'rgb(var(--rgbGray), 1)',
  colorTextBody: 'rgb(var(--rgbGray), 0.8)',
  colorTextLight: 'rgb(var(--rgbGray), 0.6)',
};

const light = {
  themeId: 'light',
  rgbSurface: '255, 255, 255',
  rgbSurfaceDark: '34, 34, 34',
  rgbText: '51, 51, 51',
  rgbBorder: '229, 229, 229',
  rgbError: '210, 14, 60',
  colorTextTitle: 'rgb(var(--rgbGray), 1)',
  colorTextBody: 'rgb(var(--rgbGray), 0.7)',
  colorTextLight: 'rgb(var(--rgbGray), 0.6)',
};

export const theme = { light, dark };
