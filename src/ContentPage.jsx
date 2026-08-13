import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LINE_WIDTH, PAGE_STYLE, CARD_SHELL_STYLE, gridPlacement } from './gridConstants'
import { NAV_HEIGHT_UNITS, useGridDimensions, buildNavRowCells, createMatrix, markOccupied, fillDecorativeSquares } from './gridLayout'
import { assignIcons, assignStrings } from './icons'
import NavBox from './NavBox'
import Square from './Square'

const CONTENT_WIDTH_RATIO = 0.75

// A single-screen page: same grid background and nav bar as the main page,
// but instead of 5 scrollable sections it has one large content area
// (~75% of the width, spanning from the bottom of the nav to the bottom of
// the screen) that just renders `children` - drop in whatever component you
// build for that page's content. Unlike the main page, no nav button is ever
// "active" here (you're not viewing one of its 5 sections), and clicking one
// navigates back to the main page's corresponding section instead of
// scrolling in place.
const ContentPage = ({ children }) => {
  const { cols, rows, unit } = useGridDimensions()
  const navigate = useNavigate()

  const bodyRows = rows - NAV_HEIGHT_UNITS

  // Parity-matched to cols so the box sits exactly centered and is
  // therefore its own mirror image - required for the decorative squares
  // around it to mirror correctly (see gridLayout's isMatrixSymmetric).
  let contentColSpan = Math.round(cols * CONTENT_WIDTH_RATIO)
  contentColSpan = Math.max(2, Math.min(cols - 2, contentColSpan))
  if ((cols - contentColSpan) % 2 !== 0) contentColSpan -= 1
  const contentCol = (cols - contentColSpan) / 2

  // No icon/string flair on the nav row itself - see TestGrid's matching
  // comment: the fixed 6-7-per-call quota would saturate its one thin row.
  const navRowCells = buildNavRowCells(cols)

  const occupied = createMatrix(cols, bodyRows)
  markOccupied(occupied, contentCol, 0, contentColSpan, bodyRows)
  const bodySquares = assignStrings(assignIcons(fillDecorativeSquares(cols, bodyRows, occupied)))

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, ${unit}px)`,
    gridTemplateRows: `repeat(${rows}, ${unit}px)`,
    gap: `${LINE_WIDTH}px`,
  }

  return (
    <div style={PAGE_STYLE}>
      <div style={gridStyle}>
        {navRowCells.map((cell, i) =>
          cell.type === 'nav' ? (
            <NavBox
              key={`nav-${i}`}
              {...cell}
              active={false}
              onClick={() => navigate('/', { state: { sectionIndex: cell.sectionIndex } })}
            />
          ) : (
            <Square key={`nav-${i}`} {...cell} />
          ),
        )}
        {bodySquares.map((cell, i) => (
          <Square key={`body-${i}`} {...cell} row={cell.row + NAV_HEIGHT_UNITS} />
        ))}
        <div style={{ ...CARD_SHELL_STYLE, ...gridPlacement(contentCol, NAV_HEIGHT_UNITS, contentColSpan, bodyRows) }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default ContentPage
