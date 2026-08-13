export const LINE_WIDTH = 1

// The three layouts the site is built for. Everything responsive - type
// sizes, image sizes, how many grid units a content box spans, whether
// there's a nav bar at all - keys off one of these three names rather than
// off raw pixel widths, so a component never has to repeat the thresholds.
//
// Desktop starts at 1400 because that's the width the original layout was
// designed and tuned for; 768-1399 (portrait and landscape tablets) gets the
// tablet layout, and anything narrower gets the phone one.
export const PHONE_MAX_WIDTH = 768
export const TABLET_MAX_WIDTH = 1400

export const getBreakpoint = (viewportWidth) => {
  if (viewportWidth < PHONE_MAX_WIDTH) return 'phone'
  if (viewportWidth < TABLET_MAX_WIDTH) return 'tablet'
  return 'desktop'
}

// Grid squares stay 100px on every breakpoint - the grid is the background
// pattern, not the layout, so it doesn't need to scale; what changes with
// screen size is how many units a piece of content spans (see sections.js).
// Kept per-breakpoint anyway so there's one obvious place to change it.
export const UNIT_SIZES = { desktop: 100, tablet: 100, phone: 100 }

export const getUnitSize = (viewportWidth) => UNIT_SIZES[getBreakpoint(viewportWidth)]

// Distance between grid lines at the given viewport width (box size + the
// 1px gap/line between boxes).
export const getPitch = (viewportWidth) => getUnitSize(viewportWidth) + LINE_WIDTH

export const RADIUS = 8
export const LINE_COLOR = '#DDDDDD'
export const BG_COLOR = '#F8F8F8'
export const BOX_SHADOW = '2px 2px 20px rgba(0, 0, 0, 0.2)'

// Shared top-level page wrapper - full-viewport, centers its grid and
// reserves a symmetric scrollbar gutter so that centering isn't thrown off
// by the scrollbar itself. Used by every page (TestGrid, ContentPage, ...)
// so they all frame their grid the same way.
//
// On desktop the grid is a bit wider than the screen (see getGridDimensions,
// which rounds the column count up there) and bleeds off both edges evenly;
// on tablet and phone it's rounded down instead, so it sits fully on screen
// and this just centers it.
//
// Scroll snapping isn't set here but by TestGrid, the only page with snap
// targets to align to - see its scrollSnapType.
export const PAGE_STYLE = {
  width: '100vw',
  height: '100vh',
  overflowY: 'auto',
  overflowX: 'hidden',
  scrollbarGutter: 'stable both-edges',
  backgroundColor: BG_COLOR,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
}

export const gridPlacement = (col, row, colSpan, rowSpan) => ({
  gridColumn: `${col + 1} / span ${colSpan}`,
  gridRow: `${row + 1} / span ${rowSpan}`,
})

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
