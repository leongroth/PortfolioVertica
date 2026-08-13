// Shared type scale - keep every heading/body role's font-family, size and
// weight defined once here so components spread the right role (e.g.
// `{...TYPE.h2}`) instead of hand-rolling font styles per component.
//
// The sizes are CSS variables rather than numbers, and index.css redefines
// them per breakpoint (desktop / tablet / phone). That way a component keeps
// spreading one static style object and gets the right size for the screen
// for free - no hook, no re-render, and bare <h1>/<p> tags that don't spread
// TYPE at all scale too, since index.css points them at the same variables.
export const FONT_FAMILY = "'Satoshi', sans-serif"

export const TYPE = {
  h1: { fontFamily: FONT_FAMILY, fontSize: 'var(--type-h1)', fontWeight: 700 },
  h2: { fontFamily: FONT_FAMILY, fontSize: 'var(--type-h2)', fontWeight: 700 },
  h3: { fontFamily: FONT_FAMILY, fontSize: 'var(--type-h3)', fontWeight: 700 },
  h4: { fontFamily: FONT_FAMILY, fontSize: 'var(--type-h4)', fontWeight: 700 },
  h5: { fontFamily: FONT_FAMILY, fontSize: 'var(--type-h5)', fontWeight: 500 },
  h6: { fontFamily: FONT_FAMILY, fontSize: 'var(--type-h6)', fontWeight: 500 },
  body: { fontFamily: FONT_FAMILY, fontSize: 'var(--type-body)', fontWeight: 400 },
  bodySm: { fontFamily: FONT_FAMILY, fontSize: 'var(--type-body-sm)', fontWeight: 400 },
  caption: { fontFamily: FONT_FAMILY, fontSize: 'var(--type-caption)', fontWeight: 400 },
}
