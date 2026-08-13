import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LINE_WIDTH, PAGE_STYLE, CARD_SHELL_STYLE, gridPlacement } from './gridConstants'
import { NAV_HEIGHT_UNITS, useGridDimensions, buildNavRowCells, getSectionBoxes, fillDecorativeSquares } from './gridLayout'
import { assignIcons, assignStrings } from './icons'
import { SECTIONS } from './sections'
import NavBox from './NavBox'
import ContentCard from './ContentCard'
import Square from './Square'

const SECTION_COUNT = SECTIONS.length

const TestGrid = () => {
  const { cols, rows: rowsPerSection, unit } = useGridDimensions()
  const pageRef = useRef(null)
  const [activeSection, setActiveSection] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()

  const scrollToSection = useCallback(
    (sectionIndex, behavior = 'smooth') => {
      pageRef.current?.scrollTo({ top: sectionIndex * rowsPerSection * (unit + LINE_WIDTH), behavior })
    },
    [rowsPerSection, unit],
  )

  // Other pages' nav bars navigate back here with { sectionIndex } in router
  // state (see NavBox usage in ContentPage) since they can't scroll a page
  // they're not on. Once mounted here, jump straight to that section (no
  // animation - we're arriving fresh, not already viewing the page) and
  // clear the state so it doesn't re-trigger on a later re-render.
  useEffect(() => {
    const targetSection = location.state?.sectionIndex
    if (targetSection === undefined) return
    scrollToSection(targetSection, 'auto')
    navigate(location.pathname, { replace: true, state: null })
  }, [location.state, location.pathname, navigate, scrollToSection])

  const cells = useMemo(() => {
    const all = []

    // assignIcons/assignStrings are called per-section (rather than once
    // over every cell on the page) so each section gets its own 6-7 icons
    // and 6-7 text snippets instead of them clustering wherever chance
    // happens to land them. assignStrings runs after assignIcons so the two
    // never land on the same square.
    const addSectionBody = (sectionIndex, rowOffset, bodyRows) => {
      const { occupied, cells: reservedCells } = getSectionBoxes(cols, bodyRows, SECTIONS[sectionIndex], `sections.js[${sectionIndex}]`)
      reservedCells.forEach((cell) => all.push({ ...cell, row: cell.row + rowOffset }))
      assignStrings(assignIcons(fillDecorativeSquares(cols, bodyRows, occupied))).forEach((cell) =>
        all.push({ ...cell, row: cell.row + rowOffset, type: 'square' }),
      )
    }

    for (let section = 0; section < SECTION_COUNT; section++) {
      const rowOffset = section * rowsPerSection

      // Invisible, full-section-sized marker the IntersectionObserver below
      // watches to determine which section is currently "active".
      all.push({ type: 'sentinel', sectionIndex: section, col: 0, row: rowOffset, colSpan: cols, rowSpan: rowsPerSection })

      if (section === 0 && rowsPerSection > NAV_HEIGHT_UNITS) {
        // No icon/string flair on the nav row itself - it's a single row,
        // so the same fixed 6-7-per-call quota used for a whole multi-row
        // section body would saturate nearly every filler square in it.
        buildNavRowCells(cols).forEach((cell) => all.push({ ...cell, row: cell.row + rowOffset }))
        addSectionBody(section, rowOffset + NAV_HEIGHT_UNITS, rowsPerSection - NAV_HEIGHT_UNITS)
      } else {
        addSectionBody(section, rowOffset, rowsPerSection)
      }
    }

    return all
  }, [cols, rowsPerSection])

  // Tracks which section is "active" via IntersectionObserver against the
  // full-size invisible sentinel per section pushed above, rather than
  // computing it from scrollTop ourselves - rootMargin shrinks the
  // observed area to a 1px-tall band at the exact vertical center of the
  // scroll container, so whichever section's sentinel covers that center
  // line is the one reported active. This is the standard "scrollspy"
  // technique and, unlike a scrollTop/sectionHeight calculation, can't drift
  // out of sync with how the browser actually laid the grid out.
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

  const totalRows = rowsPerSection * SECTION_COUNT

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, ${unit}px)`,
    gridTemplateRows: `repeat(${totalRows}, ${unit}px)`,
    gap: `${LINE_WIDTH}px`,
  }

  return (
    <div ref={pageRef} style={PAGE_STYLE}>
      <div style={gridStyle}>
        {cells.map((cell, i) => {
          if (cell.type === 'nav') {
            return (
              <NavBox
                key={i}
                {...cell}
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
                <Component {...cellProps} />
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
                  // Doubles as the section's scroll-snap target: 'start'
                  // aligns its top edge with the scroll container's top
                  // (matching scrollToSection's own math), and 'always'
                  // stops a fast fling here instead of letting it sail past
                  // to a farther section - i.e. one section per gesture.
                  scrollSnapAlign: 'start',
                  scrollSnapStop: 'always',
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
