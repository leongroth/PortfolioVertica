import { useState, useEffect } from 'react'
import { LINE_WIDTH, getUnitSize, getBreakpoint } from './gridConstants'

export const LARGE_SPAN = 4 // big square is LARGE_SPAN x LARGE_SPAN units (403x403)
export const CARD_MAX_COLS = 6
export const CARD_MAX_ROWS = 4

export const NAV_LINKS = ['About me', 'Frontend', 'Design', 'AI experience', 'Contact']

// How wide one nav button is per breakpoint, in grid units. Phones get 0 -
// five buttons can't fit across a ~390px screen at any readable size, so
// there's no nav bar there at all (see getNavHeightUnits) and the page is
// navigated by scrolling.
export const NAV_BOX_WIDTH_UNITS = { desktop: 2, tablet: 1, phone: 0 }

export const getNavBoxWidthUnits = (breakpoint) => NAV_BOX_WIDTH_UNITS[breakpoint]

// Total width of the nav block, and the height of the row it sits in - both
// 0 on phones, where there's no nav bar, so section 0's content starts at
// the very top row instead of leaving an empty one for it.
export const getNavTotalWidthUnits = (breakpoint) => getNavBoxWidthUnits(breakpoint) * NAV_LINKS.length

export const getNavHeightUnits = (breakpoint) => (getNavBoxWidthUnits(breakpoint) > 0 ? 1 : 0)

export const getGridDimensions = () => {
  const width = window.innerWidth
  const breakpoint = getBreakpoint(width)
  const navUnits = getNavTotalWidthUnits(breakpoint)

  let unit = getUnitSize(width)
  let pitch = unit + LINE_WIDTH
  let cols

  if (breakpoint === 'desktop') {
    // Desktop rounds the column count up, so the grid is slightly wider than
    // the screen and bleeds off both edges - that's the intended look there,
    // and at 1400px+ the overhang is at most one 100px square.
    cols = Math.ceil(width / pitch)
    // Keep (cols - navUnits) even so buildNavRowCells' floor-based centering
    // lands the nav block exactly in the middle of the grid's own columns,
    // with equal margin units on both sides, instead of being off by one
    // whole unit on whichever viewport widths make it odd.
    if ((cols - navUnits) % 2 !== 0) cols += 1
  } else if (breakpoint === 'tablet') {
    // A whole extra square is a much bigger fraction of a tablet screen, and
    // PAGE_STYLE hides the horizontal overflow, so rounding up here would
    // quietly clip real content off both sides. Rounding down keeps the
    // whole grid - and everything in it - on screen, with a small even
    // margin either side.
    cols = Math.max(2, Math.floor(width / pitch))
    // Same parity rule, but corrected downwards - going up would push the
    // grid back off the edge of the screen, which is what we just avoided.
    if (navUnits > 0 && (cols - navUnits) % 2 !== 0) cols = Math.max(2, cols - 1)
  } else {
    // Phones fit the grid to the screen exactly instead of rounding either
    // way: take whichever column count comes closest to the 100px target,
    // then divide the screen by it, so a box spanning the full grid spans
    // the full width of the phone with nothing left over at the sides.
    // clientWidth rather than innerWidth so a narrow desktop window's
    // scrollbar isn't counted as usable space.
    const available = document.documentElement.clientWidth || width
    cols = Math.max(2, Math.round(available / pitch))
    unit = (available - (cols - 1) * LINE_WIDTH) / cols
    pitch = unit + LINE_WIDTH
  }

  return {
    cols,
    // whole number of rows that fit one screen, so a page/section boundary
    // always lands on a grid line - no square ever gets cut in half.
    rows: Math.max(3, Math.round(window.innerHeight / pitch)),
    unit,
    breakpoint,
  }
}

// Tracks {cols, rows, unit, breakpoint} for one screen's worth of grid,
// recomputed on resize. Shared by every page so they all size their grid the
// same way.
export const useGridDimensions = () => {
  const [dimensions, setDimensions] = useState(getGridDimensions)

  useEffect(() => {
    const handleResize = () => setDimensions(getGridDimensions())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return dimensions
}

// Just the current breakpoint name, for content components that need to
// change their own internal layout (stack a row into a column, swap an
// overlay for a caption underneath, ...) but don't care about the grid.
// Cards rendered by TestGrid are handed `breakpoint` as a prop and don't
// need this; anything inside a ContentPage does.
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState(() => getBreakpoint(window.innerWidth))

  useEffect(() => {
    const handleResize = () => setBreakpoint(getBreakpoint(window.innerWidth))
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return breakpoint
}

const BREAKPOINT_KEYS = ['desktop', 'tablet', 'phone']

// A responsive value is written as { desktop, tablet, phone } - only those
// keys, so an ordinary object prop meant for a component is never mistaken
// for one.
const isResponsiveValue = (value) =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  Object.keys(value).length > 0 &&
  Object.keys(value).every((key) => BREAKPOINT_KEYS.includes(key))

// Picks the value for `breakpoint`, narrowing down: a phone falls back to
// the tablet value and then to the desktop one, so you only have to spell
// out the breakpoints that actually differ. Plain values pass straight
// through unchanged.
//
// A key that's present wins even when its value is undefined - that's how
// you switch a setting *off* for one breakpoint (`alignSpan: { desktop: 12,
// tablet: undefined }`) rather than inheriting the wider screen's value.
export const resolveResponsive = (value, breakpoint) => {
  if (!isResponsiveValue(value)) return value
  if (breakpoint === 'phone') {
    if ('phone' in value) return value.phone
    if ('tablet' in value) return value.tablet
    return value.desktop
  }
  if (breakpoint === 'tablet') {
    if ('tablet' in value) return value.tablet
    return value.desktop
  }
  if ('desktop' in value) return value.desktop
  return 'tablet' in value ? value.tablet : value.phone
}

// Resolves every field of a box definition for one breakpoint, so any of
// them - colSpan, rowSpan, gap, align, even a component's own props - can be
// written responsively. Boxes marked `hidden` for this breakpoint drop out
// entirely (e.g. a decorative extra box that has no room on a phone).
export const resolveBoxesForBreakpoint = (boxDefs, breakpoint) =>
  boxDefs
    .map((box) =>
      Object.fromEntries(Object.entries(box).map(([key, value]) => [key, resolveResponsive(value, breakpoint)])),
    )
    .filter((box) => !box.hidden)

export const createMatrix = (cols, rows) =>
  Array.from({ length: rows }, () => Array(cols).fill(false))

export const isRegionFree = (matrix, col, row, colSpan, rowSpan) => {
  for (let r = row; r < row + rowSpan; r++) {
    for (let c = col; c < col + colSpan; c++) {
      if (!matrix[r] || matrix[r][c]) return false
    }
  }
  return true
}

export const markOccupied = (matrix, col, row, colSpan, rowSpan) => {
  for (let r = row; r < row + rowSpan; r++) {
    for (let c = col; c < col + colSpan; c++) matrix[r][c] = true
  }
}

// Deterministic partition of a cols x rows unit grid into non-overlapping
// cells (mostly 1x1, some 2x1/1x2 merges, one LARGE_SPAN x LARGE_SPAN square
// up top-left if there's room). `preOccupied`, if given, marks cells that are
// already spoken for (e.g. by real content) so they're left alone. Every free
// unit is visited exactly once in row-major order and claimed immediately, so
// the result is always gapless with no overlaps outside the reserved cells.
export const generateCells = (cols, rows, preOccupied) => {
  const occupied = preOccupied
    ? preOccupied.map((rowArr) => [...rowArr])
    : createMatrix(cols, rows)
  const cells = []

  if (cols >= LARGE_SPAN && rows >= LARGE_SPAN && isRegionFree(occupied, 0, 0, LARGE_SPAN, LARGE_SPAN)) {
    markOccupied(occupied, 0, 0, LARGE_SPAN, LARGE_SPAN)
    cells.push({ col: 0, row: 0, colSpan: LARGE_SPAN, rowSpan: LARGE_SPAN })
  }

  let seed = 42
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (occupied[row][col]) continue

      let colSpan = 1
      let rowSpan = 1
      const r = rand()
      const canRight = col + 1 < cols && !occupied[row][col + 1]
      const canDown = row + 1 < rows && !occupied[row + 1][col]

      if (canRight && r < 0.1) {
        colSpan = 2
      } else if (canDown && r < 0.2) {
        rowSpan = 2
      }

      for (let rr = row; rr < row + rowSpan; rr++) {
        for (let cc = col; cc < col + colSpan; cc++) occupied[rr][cc] = true
      }

      cells.push({ col, row, colSpan, rowSpan })
    }
  }

  return cells
}

// Mirrors a left-half layout onto the right half so the grid is symmetrical
// left-to-right. The left half is generated as its own self-contained
// cols/2-wide grid (so spans never cross the center line), then reflected;
// an odd total width gets a separate self-mirrored single-column strip down
// the center. `reserved`, if given, is a full cols x rows occupancy matrix
// for real content - it must itself be left-right symmetric (full-width or
// centered) so its left slice and the mirror of its right slice agree.
export const generateSymmetricCells = (cols, rows, reserved) => {
  const leftCols = Math.floor(cols / 2)
  const hasCenterColumn = cols % 2 === 1
  const reservedMatrix = reserved || createMatrix(cols, rows)

  const leftPreOccupied = reservedMatrix.map((rowArr) => rowArr.slice(0, leftCols))
  const leftCells = generateCells(leftCols, rows, leftPreOccupied)
  const mirroredCells = leftCells.map(({ col, row, colSpan, rowSpan }) => ({
    col: cols - col - colSpan,
    row,
    colSpan,
    rowSpan,
  }))

  const centerPreOccupied = hasCenterColumn
    ? reservedMatrix.map((rowArr) => [rowArr[leftCols]])
    : null
  const centerCells = hasCenterColumn
    ? generateCells(1, rows, centerPreOccupied).map((cell) => ({ ...cell, col: leftCols }))
    : []

  return [...leftCells, ...centerCells, ...mirroredCells]
}

export const isMatrixSymmetric = (matrix, cols) =>
  matrix.every((rowArr) => rowArr.every((value, c) => value === rowArr[cols - 1 - c]))

// Fills the remaining (non-reserved) cells of a region with decorative
// squares, mirroring left-to-right whenever the reserved matrix actually
// turns out symmetric and falling back to a plain (still gapless) fill
// otherwise - guessing "mirrored" wrong risks the mirrored squares
// overlapping an asymmetric reservation on the other side.
export const fillDecorativeSquares = (cols, rows, occupied) =>
  (isMatrixSymmetric(occupied, cols)
    ? generateSymmetricCells(cols, rows, occupied)
    : generateCells(cols, rows, occupied)
  ).map((cell) => ({ ...cell, type: 'square' }))

// Lays out the 5 nav boxes (each getNavBoxWidthUnits wide, 1 unit tall) as
// one contiguous, centered block on row 0, with plain 1x1 filler squares in
// the remaining cells on either side. The block isn't forced to be exactly
// mirror-symmetric (centering just uses integer division), so this row is
// filled directly with simple, unmerged squares rather than routed through
// generateSymmetricCells - that keeps it correct regardless of any small
// left/right imbalance from the centering math.
//
// Returns nothing at all on phones, where there is no nav row to build.
export const buildNavRowCells = (cols, breakpoint) => {
  const boxWidth = getNavBoxWidthUnits(breakpoint)
  if (boxWidth === 0) return []

  const count = NAV_LINKS.length
  const totalBoxWidth = boxWidth * count
  const blockStart = Math.max(0, Math.floor((cols - totalBoxWidth) / 2))

  const occupied = createMatrix(cols, 1)
  const navCells = []

  for (let i = 0; i < count; i++) {
    const col = blockStart + i * boxWidth
    const width = Math.min(boxWidth, Math.max(0, cols - col))
    if (width > 0) {
      markOccupied(occupied, col, 0, width, 1)
      navCells.push({ type: 'nav', label: NAV_LINKS[i], sectionIndex: i, col, row: 0, colSpan: width, rowSpan: 1 })
    }
  }

  const fillerCells = []
  for (let c = 0; c < cols; c++) {
    if (!occupied[0][c]) fillerCells.push({ type: 'square', col: c, row: 0, colSpan: 1, rowSpan: 1 })
  }

  return [...navCells, ...fillerCells]
}

// Default single box, centered, sized by CARD_MAX_COLS/CARD_MAX_ROWS. colSpan
// is forced to match cols' parity so it sits exactly centered and is
// therefore its own mirror image - required for generateSymmetricCells to
// route the decorative squares around it correctly on both halves.
export const autoCenterBox = (cols, rows) => {
  let colSpan = Math.max(2, Math.min(CARD_MAX_COLS, cols - 2))
  if ((cols - colSpan) % 2 !== 0) colSpan -= 1 // keep it centered/self-symmetric
  const rowSpan = Math.max(2, Math.min(CARD_MAX_ROWS, rows - 2))

  if (colSpan < 2 || rowSpan < 2 || rows < rowSpan) return null
  return { col: (cols - colSpan) / 2, row: Math.floor((rows - rowSpan) / 2), colSpan, rowSpan }
}

// Resolves one coordinate of a box within a `span`-unit region starting at
// `base`: 'start' (default) sticks to `base`, 'end' sticks to the far edge,
// 'center' centers it (floored - may land off-center by half a unit, which
// is fine since symmetry is verified separately afterward, not assumed).
//
// A box wider or taller than the region it's aligned in resolves to a
// position before `base` - deliberately, since that's how a box centers on
// a smaller box it's anchored to (SocialButtons is twice the width of the
// MessageCard it hangs below). Only alignment against the section itself is
// clamped, in resolveBoxes.
export const resolveAxis = (mode, base, extent, span) => {
  if (mode === 'end') return base + extent - span
  if (mode === 'center') return base + Math.floor((extent - span) / 2)
  return base
}

// Resolves each hand-authored box in `boxDefs` to an absolute { col, row }.
// A box can either be placed directly (`col`/`row`), aligned within the
// section via `align`/`valign` ('start' | 'center' | 'end'), or - via
// `relativeTo` (the index of an earlier box in the same array) and
// `placement` ('right' | 'left' | 'below' | 'above') - flowed next to
// another box with an optional `gap` (grid units, default 0) between them.
// When relative, `align`/`valign` control the cross-axis position against
// the anchor box's own span instead of the whole section.
//
// `alignSpan`/`valignSpan` (only meaningful with `align`/`valign`, no
// `relativeTo`) let a box center/align as if it were wider/taller than its
// real colSpan/rowSpan - e.g. give the first box in a relative chain
// `alignSpan: <sum of every box's span + every gap in the chain>` so the
// whole chain reads as one centered group instead of just that first box.
//
// `colOffset`/`rowOffset` (grid units, default 0) nudge the final resolved
// position after everything else - e.g. `valign: 'center', rowOffset: 2` to
// sit 2 rows below where dead-center would otherwise put it. Works the same
// regardless of which positioning mode placed the box.
//
// Every one of those fields can be written as { desktop, tablet, phone } -
// resolveBoxesForBreakpoint has already collapsed them to a single value by
// the time they get here.
// A colSpan can be a number of grid units, or one of two keywords that are
// measured against the grid instead: 'full' (every column) and 'wide'
// (every column but one either side, so a single row of decorative squares
// still frames it). They exist for tablet and phone, where the column count
// swings from 3 to 13 across the range - a fixed number that looks right on
// a 390px phone is a stamp-sized box on a 767px one. Both keep the box
// perfectly centered whatever the column count, since cols and cols-2 always
// share cols' parity.
export const resolveColSpan = (colSpan, cols) => {
  if (colSpan === 'full') return cols
  if (colSpan === 'wide') return Math.max(1, cols - 2)
  return colSpan
}

export const resolveBoxes = (boxDefs, cols, rows) => {
  const resolved = []

  boxDefs.forEach((boxDef) => {
    const box = { ...boxDef, colSpan: resolveColSpan(boxDef.colSpan, cols) }
    const { colSpan, rowSpan, placement, gap = 0, colOffset = 0, rowOffset = 0 } = box
    const anchor = box.relativeTo !== undefined ? resolved[box.relativeTo] : null

    let col = box.col
    if (col === undefined) {
      if (anchor && placement === 'right') col = anchor.col + anchor.colSpan + gap
      else if (anchor && placement === 'left') col = anchor.col - gap - colSpan
      else if (anchor) col = resolveAxis(box.align, anchor.col, anchor.colSpan, colSpan)
      else col = Math.max(0, resolveAxis(box.align, 0, cols, box.alignSpan ?? colSpan))
    }
    col += colOffset

    let row = box.row
    if (row === undefined) {
      if (anchor && placement === 'below') row = anchor.row + anchor.rowSpan + gap
      else if (anchor && placement === 'above') row = anchor.row - gap - rowSpan
      else if (anchor) row = resolveAxis(box.valign, anchor.row, anchor.rowSpan, rowSpan)
      // Clamped to the top of the section: a box taller than the section it's
      // centered in would otherwise hang off the top edge and get skipped.
      // Pinned to row 0 it either still doesn't fit (skipped with a warning,
      // as before) or - on tablet and phone, where getSectionRows grows a
      // section to fit its content - it has somewhere to grow into.
      else row = Math.max(0, resolveAxis(box.valign, 0, rows, box.valignSpan ?? rowSpan))
    }
    row += rowOffset

    resolved.push({ ...box, col, row })
  })

  return resolved
}

// How many rows one section needs at this breakpoint. Desktop is always
// exactly one screen - that's what makes its section-per-screen scroll
// snapping work - so this only ever grows a section on tablet and phone,
// where a row of cards has to stack into a column and simply doesn't fit on
// one screen any more.
//
// It's a measure-then-remeasure: boxes are laid out against a one-screen
// section to find out how far down they actually reach, and that becomes the
// section's height (never less than a screen). getSectionBoxes then lays
// them out again against that final height - see TestGrid.
//
// The measurement repeats because growing the section can move the boxes
// that were measured: anything centred vertically sits lower in a taller
// section, pushing whatever is flowed below it lower again. Two or three
// rounds settle it (each round can only grow the section, and it stops as
// soon as a round changes nothing), and MEASURE_PASSES caps it either way.
const MEASURE_PASSES = 3

export const getSectionRows = (cols, screenRows, section, breakpoint) => {
  if (breakpoint === 'desktop' || !Array.isArray(section.boxes)) return screenRows

  const boxDefs = resolveBoxesForBreakpoint(section.boxes, breakpoint)
  let rows = screenRows

  for (let pass = 0; pass < MEASURE_PASSES; pass++) {
    const boxes = resolveBoxes(boxDefs, cols, rows)
    const bottom = boxes.reduce((lowest, box) => Math.max(lowest, box.row + box.rowSpan), 0)
    const grown = Math.max(screenRows, bottom)
    if (grown === rows) break
    rows = grown
  }

  return rows
}

// Reserves the content box(es) for one section-like region within the given
// rows. `section` is a { title, text, image, boxes? } object (see
// resolveBoxes above for the `boxes` positioning options); a box's own
// title/text/image fall back to the section's when omitted. Boxes that
// don't fit (out of bounds, or overlapping an earlier box) are skipped, with
// a console warning naming `label` (e.g. "sections.js[0]") and the box
// index - `rows` (and `cols`) come from the viewport, so a box sized/placed
// for one screen can silently stop fitting at another unless it's expressed
// relatively (align/valign, or relativeTo) rather than with fixed numbers.
// Without a `boxes` array, one box is auto-centered from the section's
// title/text/image.
export const getSectionBoxes = (cols, rows, section, label, breakpoint) => {
  const boxDefs = Array.isArray(section.boxes)
    ? resolveBoxes(resolveBoxesForBreakpoint(section.boxes, breakpoint), cols, rows)
    : [autoCenterBox(cols, rows)].filter(Boolean)

  const occupied = createMatrix(cols, rows)
  const cells = []

  boxDefs.forEach((box, boxIndex) => {
    const { col, row, colSpan, rowSpan } = box
    const boxLabel = `${label}.boxes[${boxIndex}]`

    if (colSpan < 1 || rowSpan < 1) {
      console.warn(`${boxLabel} skipped: colSpan/rowSpan must be at least 1 (got ${colSpan}x${rowSpan}).`)
      return
    }
    if (col < 0 || row < 0 || col + colSpan > cols || row + rowSpan > rows) {
      console.warn(
        `${boxLabel} skipped: doesn't fit in the current ${cols}x${rows} grid at the ${breakpoint} breakpoint ` +
          `(needs col ${col}-${col + colSpan - 1}, row ${row}-${row + rowSpan - 1}).`,
      )
      return
    }
    if (!isRegionFree(occupied, col, row, colSpan, rowSpan)) {
      console.warn(`${boxLabel} skipped: overlaps an earlier box in the same section.`)
      return
    }

    markOccupied(occupied, col, row, colSpan, rowSpan)
    cells.push({
      type: 'card',
      // Spread first so any extra fields a box defines for its own
      // `component` (beyond the standard title/text/image) flow through as
      // props, without needing to know about them here.
      ...box,
      col,
      row,
      colSpan,
      rowSpan,
      title: box.title ?? section.title,
      text: box.text ?? section.text,
      image: box.image !== undefined ? box.image : section.image,
    })
  })

  return { occupied, cells }
}
