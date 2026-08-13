import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LINE_WIDTH, PAGE_STYLE, CARD_SHELL_STYLE, gridPlacement } from './gridConstants'
import {
  getNavHeightUnits,
  useGridDimensions,
  buildNavRowCells,
  getSectionRows,
  getSectionBoxes,
  fillDecorativeSquares,
} from './gridLayout'
import { assignIcons, assignStrings } from './icons'
import { SECTIONS } from './sections'
import NavBox from './NavBox'
import ContentCard from './ContentCard'
import Square from './Square'

const SECTION_COUNT = SECTIONS.length

const TestGrid = () => {
  const { cols, rows: screenRows, unit, breakpoint } = useGridDimensions()
  const pitch = unit + LINE_WIDTH
  const pageRef = useRef(null)
  const [activeSection, setActiveSection] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()

  // On desktop every section is exactly one screen tall, so the page snaps
  // from section to section. Below that a section grows to fit whatever its
  // boxes need once they stack into a column (see getSectionRows), which
  // means sections are different heights and often taller than the screen -
  // snapping to them would fight the user's scrolling, so it's off there and
  // tablet/phone are an ordinary continuous scroll.
  const snapping = breakpoint === 'desktop'

  // Where each section starts, in grid rows from the top of the page.
  // Sections used to all be the same height, so this was just index * rows;
  // now that they aren't, every jump-to-section has to go through here.
  const { cells, sectionTops, totalRows } = useMemo(() => {
    const all = []
    const tops = []
    const navHeight = getNavHeightUnits(breakpoint)
    let top = 0

    // assignIcons/assignStrings are called per-section (rather than once
    // over every cell on the page) so each section gets its own 6-7 icons
    // and 6-7 text snippets instead of them clustering wherever chance
    // happens to land them. assignStrings runs after assignIcons so the two
    // never land on the same square.
    const addSectionBody = (sectionIndex, rowOffset, bodyRows) => {
      const { occupied, cells: reservedCells } = getSectionBoxes(
        cols,
        bodyRows,
        SECTIONS[sectionIndex],
        `sections.js[${sectionIndex}]`,
        breakpoint,
      )
      // sectionIndex rides along as a prop on every card so a card that
      // navigates to its own content page can pass it on (see ACESCard) -
      // that page's BackButton then brings you back to this section rather
      // than to the top of the page.
      reservedCells.forEach((cell) => all.push({ ...cell, row: cell.row + rowOffset, sectionIndex }))
      assignStrings(assignIcons(fillDecorativeSquares(cols, bodyRows, occupied))).forEach((cell) =>
        all.push({ ...cell, row: cell.row + rowOffset, type: 'square' }),
      )
    }

    for (let section = 0; section < SECTION_COUNT; section++) {
      // Only section 0 carries the nav row, and only on breakpoints that
      // have one at all - on a phone there's no nav bar, so section 0 starts
      // with its own content like every other section.
      const hasNavRow = section === 0 && navHeight > 0
      const bodyScreenRows = Math.max(1, screenRows - (hasNavRow ? navHeight : 0))
      const bodyRows = getSectionRows(cols, bodyScreenRows, SECTIONS[section], breakpoint)
      const sectionRows = bodyRows + (hasNavRow ? navHeight : 0)

      tops.push(top)

      // Invisible, full-section-sized marker the IntersectionObserver below
      // watches to determine which section is currently "active".
      all.push({ type: 'sentinel', sectionIndex: section, col: 0, row: top, colSpan: cols, rowSpan: sectionRows })

      if (hasNavRow) {
        // No icon/string flair on the nav row itself - it's a single row,
        // so the same fixed 6-7-per-call quota used for a whole multi-row
        // section body would saturate nearly every filler square in it.
        buildNavRowCells(cols, breakpoint).forEach((cell) => all.push({ ...cell, row: cell.row + top }))
      }
      addSectionBody(section, top + (hasNavRow ? navHeight : 0), bodyRows)

      top += sectionRows
    }

    return { cells: all, sectionTops: tops, totalRows: top }
  }, [cols, screenRows, breakpoint])

  const scrollToSection = useCallback(
    (sectionIndex, behavior = 'smooth') => {
      pageRef.current?.scrollTo({ top: (sectionTops[sectionIndex] ?? 0) * pitch, behavior })
    },
    [sectionTops, pitch],
  )

  // Other pages navigate back here with { sectionIndex } in router state
  // (see BackButton) since they can't scroll a page they're not on. Once
  // mounted here, jump straight to that section (no animation - we're
  // arriving fresh, not already viewing the page) and clear the state so it
  // doesn't re-trigger on a later re-render.
  useEffect(() => {
    const targetSection = location.state?.sectionIndex
    if (targetSection === undefined) return
    scrollToSection(targetSection, 'auto')
    navigate(location.pathname, { replace: true, state: null })
  }, [location.state, location.pathname, navigate, scrollToSection])

  // Tracks which section is "active" via IntersectionObserver against the
  // full-size invisible sentinel per section pushed above, rather than
  // computing it from scrollTop ourselves - rootMargin shrinks the
  // observed area to a 1px-tall band at the exact vertical center of the
  // scroll container, so whichever section's sentinel covers that center
  // line is the one reported active. This is the standard "scrollspy"
  // technique and, unlike a scrollTop/sectionHeight calculation, can't drift
  // out of sync with how the browser actually laid the grid out - which
  // matters more now that sections aren't all the same height.
  useEffect(() => {
    const pageEl = pageRef.current
    if (!pageEl) return

    const sentinels = pageEl.querySelectorAll('[data-section-sentinel]')
    if (sentinels.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(Number(entry.target.dataset.sectionIndex))
        })
      },
      { root: pageEl, rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )

    sentinels.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [cells])

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, ${unit}px)`,
    gridTemplateRows: `repeat(${totalRows}, ${unit}px)`,
    gap: `${LINE_WIDTH}px`,
  }

  return (
    <div ref={pageRef} style={{ ...PAGE_STYLE, scrollSnapType: snapping ? 'y mandatory' : 'none' }}>
      <div style={gridStyle}>
        {cells.map((cell, i) => {
          if (cell.type === 'nav') {
            return (
              <NavBox
                key={i}
                {...cell}
                breakpoint={breakpoint}
                active={cell.sectionIndex === activeSection}
                onClick={() => scrollToSection(cell.sectionIndex)}
              />
            )
          }
          if (cell.type === 'card') {
            const { component: Component = ContentCard, type, ...cellProps } = cell
            const { col, row, colSpan, rowSpan } = cellProps
            return (
              // zIndex lifts the card above the decorative squares - they're
              // grid items on the same grid, and squares are added after
              // cards in `cells` (see addSectionBody), so without this a
              // square's outline paints over any content (e.g. a mockup
              // image) a card intentionally overflows past its own edge.
              <div key={i} style={{ ...CARD_SHELL_STYLE, ...gridPlacement(col, row, colSpan, rowSpan), zIndex: 1 }}>
                <Component {...cellProps} breakpoint={breakpoint} />
              </div>
            )
          }
          if (cell.type === 'sentinel') {
            return (
              <div
                key={i}
                data-section-sentinel
                data-section-index={cell.sectionIndex}
                style={{
                  ...gridPlacement(cell.col, cell.row, cell.colSpan, cell.rowSpan),
                  pointerEvents: 'none',
                  // Doubles as the section's scroll-snap target on desktop:
                  // 'start' aligns its top edge with the scroll container's
                  // top (matching scrollToSection's own math), and 'always'
                  // stops a fast fling here instead of letting it sail past
                  // to a farther section - i.e. one section per gesture.
                  ...(snapping ? { scrollSnapAlign: 'start', scrollSnapStop: 'always' } : null),
                }}
              />
            )
          }
          return <Square key={i} {...cell} />
        })}
      </div>
    </div>
  )
}

export default TestGrid
