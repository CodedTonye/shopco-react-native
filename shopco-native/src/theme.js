// Design tokens taken from the SHOP.CO Figma design.
export const colors = {
  black: '#000000',
  white: '#FFFFFF',
  cream: '#F0EEED',
  grey: '#F0F0F0',
  muted: 'rgba(0,0,0,0.6)',
  faint: 'rgba(0,0,0,0.4)',
  border: 'rgba(0,0,0,0.1)',
  star: '#FFC633',
  red: '#FF3333',
  redSoft: '#FFEBEB',
  green: '#01AB31',
};

// Satoshi (body) and Integral CF (headings) are not bundled — Satoshi is free via
// Fontshare, Integral CF is a paid font. See README → "Fonts" to load them with
// expo-font; until then the platform's default system font is used.
export const fonts = {
  body: undefined,
  display: undefined,
};

export const type = {
  hero: { fontSize: 36, lineHeight: 38, fontWeight: '900', letterSpacing: -0.5 },
  h2: { fontSize: 28, lineHeight: 32, fontWeight: '900', letterSpacing: -0.3 },
  h3: { fontSize: 22, lineHeight: 26, fontWeight: '800', letterSpacing: -0.2 },
  productTitle: { fontSize: 16, fontWeight: '700' },
  productPrice: { fontSize: 20, fontWeight: '700' },
  body: { fontSize: 14, lineHeight: 20 },
  small: { fontSize: 12 },
};
