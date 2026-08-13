import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { LINE_WIDTH, PAGE_STYLE, CARD_SHELL_STYLE, gridPlacement } from './gridConstants'
import { useGridDimensions, createMatrix, markOccupied, fillDecorativeSquares, resolveColSpan } from './gridLayout'
import { assignIcons, assignStrings } from './icons'
import BackButton from './BackButton'
import Square from './Square'

const CONTENT_WIDTH_RATIO = 0.75

// A page with the same grid background as the main page, but no nav bar and
// no sections: just one large content area (~75% of the width, centered)
// that renders `children` - drop in whatever component you build for that
// page's content. In place of the nav bar there's a fixed BackButton in the
// top-left corner that stays put while the page scrolls.
//
// The content area fills the full height of the screen and grows, in whole
// grid units, to fit however much content you put in it - so a page can be
// as long as you like and the page simply scrolls, with the decorative
// squares down either side growing with it.
const ContentPage = ({ children }) => {
  const { cols, rows, unit, breakpoint } = useGridDimensions()
  const pitch = unit + LINE_WIDTH
  const contentRef = useRef(null)

  // Height floor: a full screen, so the box always fills it edge to edge.
  // `measuredRows` is what the content inside actually needs, rounded up to
  // whole units so the box still ends on a grid line (same invariant as
  // everywhere else - no square ever gets cut in half).
  const [measuredRows, setMeasuredRows] = useState(rows)
  const contentRows = Math.max(rows, measuredRows)

  // The measured element's own min-height is pinned to one screen and never
  // to the grown height - that's what stops the measurement feeding back
  // into itself: growing the grid makes the *shell* taller but leaves this
  // element at its natural height, so the next measurement returns the same
  // number and it settles after one pass.
  const minContentHeight = rows * pitch - LINE_WIDTH

  useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return

    // ResizeObserver rather than a one-off measurement: content that grows
    // after the first paint (images finishing loading, a font swapping in,
    // anything the child component renders asynchronously) has to grow the
    // grid with it.
    const measure = () => {
      const needed = Math.ceil((el.getBoundingClientRect().height + LINE_WIDTH) / pitch)
      setMeasuredRows((current) => (current === needed ? current : needed))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [pitch, minContentHeight])

  // Three quarters of the width on desktop, where there's room to spare for
  // decorative squares down each side; one column of squares either side on
  // a tablet; the whole width on a phone, which has 3-7 columns in total and
  // no width to give away.
  //
  // Parity-matched to cols so the box sits exactly centered and is therefore
  // its own mirror image - required for the decorative squares around it to
  // mirror correctly (see gridLayout's isMatrixSymmetric). 'full' and 'wide'
  // are already parity-safe, being cols and cols-2.
  let contentColSpan
  if (breakpoint === 'phone') {
    contentColSpan = resolveColSpan('full', cols)
  } else if (breakpoint === 'tablet') {
    contentColSpan = resolveColSpan('wide', cols)
  } else {
    contentColSpan = Math.round(cols * CONTENT_WIDTH_RATIO)
    contentColSpan = Math.max(2, Math.min(cols - 2, contentColSpan))
    if ((cols - contentColSpan) % 2 !== 0) contentColSpan -= 1
  }
  const contentCol = (cols - contentColSpan) / 2

  // The box spans every row, so the grid is exactly as tall as the box and
  // the decorative squares only ever fill the columns down either side.
  const squares = useMemo(() => {
    const occupied = createMatrix(cols, contentRows)
    markOccupied(occupied, contentCol, 0, contentColSpan, contentRows)
    const cells = fillDecorativeSquares(cols, contentRows, occupied)

    // assignIcons/assignStrings hand out a fixed 6-7 each per call, so
    // they're called once per screen-tall band of rows rather than once over
    // the whole page - the same reason TestGrid calls them once per section.
    // Called on the whole thing, a page several screens long would get the
    // same handful of icons as a one-screen page, spread thin.
    const decorated = []
    for (let bandTop = 0; bandTop < contentRows; bandTop += rows) {
      const band = cells.filter((cell) => cell.row >= bandTop && cell.row < bandTop + rows)
      decorated.push(...assignStrings(assignIcons(band)))
    }
    return decorated
  }, [cols, rows, contentCol, contentColSpan, contentRows])

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, ${unit}px)`,
    gridTemplateRows: `repeat(${contentRows}, ${unit}px)`,
    gap: `${LINE_WIDTH}px`,
  }

  return (
    <div style={PAGE_STYLE}>
      <BackButton breakpoint={breakpoint} />
      <div style={gridStyle}>
        {squares.map((cell, i) => (
          <Square key={`square-${i}`} {...cell} />
        ))}
        <div
          style={{
            ...CARD_SHELL_STYLE,
            ...gridPlacement(contentCol, 0, contentColSpan, contentRows),
            // Lifts the box above the decorative squares, which are grid
            // items on the same grid and rendered before it.
            zIndex: 1,
          }}
        >
          {/* Grid (not plain block) so a child styled `height: 100%` still
              fills - and stays vertically centered in - the box while it's
              only one screen tall, then simply makes this element taller once
              its content outgrows that screen. */}
          <div ref={contentRef} style={{ display: 'grid', minHeight: minContentHeight }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentPage
