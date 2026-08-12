import React from 'react'
import { RADIUS, LINE_COLOR, gridPlacement } from './gridConstants'

const ACTIVE_SHADOW = 'inset 0 0 20px rgba(255, 170, 0, 0.4)'

const styles = {
  navBox: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    border: `1px solid ${LINE_COLOR}`,
    borderRadius: RADIUS,
    cursor: 'pointer',
  },
  navLabel: {
    fontFamily: 'sans-serif',
    fontSize: 14,
    color: '#333333',
    whiteSpace: 'nowrap',
    padding: '0 8px',
  },
}

const NavBox = ({ col, row, colSpan, rowSpan, label, active, onClick }) => {
  // The button for the section you're currently viewing is disabled (no
  // point scrolling to where you already are) and carries the active shadow;
  // every other button is enabled and plain.
  const handleKeyDown = (event) => {
    if (active) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick?.()
    }
  }

  return (
    <div
      role="button"
      aria-disabled={active}
      tabIndex={active ? -1 : 0}
      onClick={active ? undefined : onClick}
      onKeyDown={handleKeyDown}
      style={{
        ...styles.navBox,
        ...gridPlacement(col, row, colSpan, rowSpan),
        ...(active ? { boxShadow: ACTIVE_SHADOW, cursor: 'default' } : null),
      }}
    >
      <span style={styles.navLabel}>{label}</span>
    </div>
  )
}

export default NavBox
