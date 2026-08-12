import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LINE_WIDTH, PAGE_STYLE, CARD_SHELL_STYLE, gridPlacement } from './gridConstants'
import { NAV_HEIGHT_UNITS, useGridDimensions, buildNavRowCells, getSectionBoxes, fillDecorativeSquares } from './gridLayout'
import { assignIcons } from './icons'
import { SECTIONS } from './sections'
import NavBox from './NavBox'
import ContentCard from './ContentCard'
import Square from './Square'

const SECTION_COUNT = SECTIONS.length
const WHEEL_LOCK_MS = 700 // cooldown after a wheel-triggered section jump

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

  // Turns the wheel/trackpad into section-at-a-time paging, like clicking a
  // nav button: every native scroll is blocked, and the first wheel tick of
  // a gesture jumps one section in that direction. wheelLockRef (a ref, not
  // state) blocks any further jumps until WHEEL_LOCK_MS after the jump
  // starts, so one physical scroll gesture - which fires many wheel events -
  // only triggers a single section change instead of skipping several.
  const wheelLockRef = useRef(false)

  useEffect(() => {
    const pageEl = pageRef.current
    if (!pageEl) return

    const handleWheel = (event) => {
      event.preventDefault()
      if (wheelLockRef.current) return

      const nextSection = activeSection + (event.deltaY > 0 ? 1 : -1)
      if (nextSection < 0 || nextSection >= SECTION_COUNT) return

      wheelLockRef.current = true
      scrollToSection(nextSection)
      setTimeout(() => {
        wheelLockRef.current = false
      }, WHEEL_LOCK_MS)
    }

    pageEl.addEventListener('wheel', handleWheel, { passive: false })
    return () => pageEl.removeEventListener('wheel', handleWheel)
  }, [activeSection, scrollToSection])

  const cells = useMemo(() => {
    const all = []

    const addSectionBody = (sectionIndex, rowOffset, bodyRows) => {
      const { occupied, cells: reservedCells } = getSectionBoxes(cols, bodyRows, SECTIONS[sectionIndex], `sections.js[${sectionIndex}]`)
      reservedCells.forEach((cell) => all.push({ ...cell, row: cell.row + rowOffset }))
      fillDecorativeSquares(cols, bodyRows, occupied).forEach((cell) =>
        all.push({ ...cell, row: cell.row + rowOffset, type: 'square' }),
      )
    }

    for (let section = 0; section < SECTION_COUNT; section++) {
      const rowOffset = section * rowsPerSection

      // Invisible, full-section-sized marker the IntersectionObserver below
      // watches to determine which section is currently "active".
      all.push({ type: 'sentinel', sectionIndex: section, col: 0, row: rowOffset, colSpan: cols, rowSpan: rowsPerSection })

      if (section === 0 && rowsPerSection > NAV_HEIGHT_UNITS) {
        buildNavRowCells(cols).forEach((cell) => all.push({ ...cell, row: cell.row + rowOffset }))
        addSectionBody(section, rowOffset + NAV_HEIGHT_UNITS, rowsPerSection - NAV_HEIGHT_UNITS)
      } else {
        addSectionBody(section, rowOffset, rowsPerSection)
      }
    }

    return assignIcons(all)
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
              <div key={i} style={{ ...CARD_SHELL_STYLE, ...gridPlacement(col, row, colSpan, rowSpan) }}>
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
                style={{ ...gridPlacement(cell.col, cell.row, cell.colSpan, cell.rowSpan), pointerEvents: 'none' }}
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
