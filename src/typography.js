// Shared type scale - keep every heading/body role's font-family, size and
// weight defined once here so components spread the right role (e.g.
// `{...TYPE.h2}`) instead of hand-rolling font styles per component.
export const FONT_FAMILY = "'Satoshi', sans-serif"

export const TYPE = {
  h1: { fontFamily: FONT_FAMILY, fontSize: 48, fontWeight: 700 },
  h2: { fontFamily: FONT_FAMILY, fontSize: 40, fontWeight: 700 },
  h3: { fontFamily: FONT_FAMILY, fontSize: 33, fontWeight: 700 },
  h4: { fontFamily: FONT_FAMILY, fontSize: 28, fontWeight: 700 },
  h5: { fontFamily: FONT_FAMILY, fontSize: 23, fontWeight: 500 },
  h6: { fontFamily: FONT_FAMILY, fontSize: 19, fontWeight: 500 },
  body: { fontFamily: FONT_FAMILY, fontSize: 16, fontWeight: 400 },
  bodySm: { fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: 400 },
  caption: { fontFamily: FONT_FAMILY, fontSize: 11, fontWeight: 400 },
}
