export const LINE_WIDTH = 1

// Responsive box size: grid squares/cards render at UNIT_LARGE by default,
// shrink to UNIT_MEDIUM at or below MEDIUM_MAX_WIDTH, and to UNIT_SMALL
// below SMALL_MAX_WIDTH - so a box that spans, say, 14 columns stays a
// reasonable size on small screens instead of just being 14*100px wide
// regardless of the viewport.
export const UNIT_LARGE = 100
export const UNIT_MEDIUM = 100
export const UNIT_SMALL = 100
export const MEDIUM_MAX_WIDTH = 1400
export const SMALL_MAX_WIDTH = 800

// Below this width the site shows NotResponsiveNotice instead of the real
// page (see App.jsx) - the grid itself already scales down via
// UNIT_SMALL/SMALL_MAX_WIDTH above, but the layout isn't genuinely usable
// yet at phone widths, so this is a separate, wider cutoff than the visual
// breakpoints above.
export const MOBILE_BLOCK_MAX_WIDTH = 1400

export const getUnitSize = (viewportWidth) => {
  if (viewportWidth < SMALL_MAX_WIDTH) return UNIT_SMALL
  if (viewportWidth <= MEDIUM_MAX_WIDTH) return UNIT_MEDIUM
  return UNIT_LARGE
}

// Distance between grid lines at the given viewport width (box size + the
// 1px gap/line between boxes).
export const getPitch = (viewportWidth) => getUnitSize(viewportWidth) + LINE_WIDTH

export const RADIUS = 8
export const LINE_COLOR = '#DDDDDD'
export const BG_COLOR = '#F8F8F8'
export const BOX_SHADOW = '2px 2px 20px rgba(0, 0, 0, 0.2)'

export const gridPlacement = (col, row, colSpan, rowSpan) => ({
  gridColumn: `${col + 1} / span ${colSpan}`,
  gridRow: `${row + 1} / span ${rowSpan}`,
})

// Shared top-level page wrapper - full-viewport, centers its grid (which is
// usually a bit wider than the screen since cols is rounded up) so the nav
// row centers on the real screen too, and reserves a symmetric scrollbar
// gutter so that centering isn't thrown off by the scrollbar itself. Used by
// every page (TestGrid, ContentPage, ...) so they all frame their grid the
// same way.
//
// scrollSnapType is native CSS scroll-snap paging (see TestGrid's per-section
// sentinels, which carry the matching scroll-snap-align) rather than a
// hand-rolled wheel-event interceptor - the browser's own scroll engine
// handles mouse, trackpad momentum and touch input correctly per-platform,
// which a JS wheel listener can't reliably replicate (WebKit in particular
// won't let preventDefault cancel a wheel event once it's in a trackpad's
// momentum phase). Pages without snap targets (e.g. ContentPage) are
// unaffected - mandatory snapping is a no-op with nothing to snap to.
export const PAGE_STYLE = {
  width: '100vw',
  height: '100vh',
  overflowY: 'auto',
  overflowX: 'hidden',
  scrollbarGutter: 'stable both-edges',
  scrollSnapType: 'y mandatory',
  backgroundColor: BG_COLOR,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
}

// Shared "shell" for a content box (default ContentCard, or a custom
// component) - background, border, rounded corners and the drop shadow all
// live here so any component placed in one gets them for free and only has
// to worry about rendering its own content, not reimplementing the box
// chrome. `overflow: visible` lets a component intentionally pose content
// (e.g. a mockup image) so it pokes out past the shell's own edge, like
// FreelanceCard/ReactCard/AngularCard's images do - a component that instead
// wants its own content clipped to the rounded corners (e.g. ContentCard's
// photo) is responsible for clipping that itself.
export const CARD_SHELL_STYLE = {
  backgroundColor: '#FFFFFF',
  border: `1px solid ${LINE_COLOR}`,
  borderRadius: RADIUS,
  boxShadow: BOX_SHADOW,
  overflow: 'visible',
}
