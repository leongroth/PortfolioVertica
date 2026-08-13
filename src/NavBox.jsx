import React from 'react'
import { RADIUS, LINE_COLOR, gridPlacement } from './gridConstants'
import { TYPE } from './typography'

const ACTIVE_UNDERLINE_COLOR = '#FFAA00'

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
    ...TYPE.h6,
    color: '#333333',
    whiteSpace: 'nowrap',
    padding: '0 8px',
  },
  // A tablet nav button is one grid unit wide (100px) instead of two, so the
  // longest label ("AI experience") has to come down a size and be allowed
  // to wrap onto a second line rather than run out of the box.
  navLabelCompact: {
    ...TYPE.bodySm,
    whiteSpace: 'normal',
    textAlign: 'center',
    lineHeight: 1.2,
    padding: '0 4px',
  },
  navLabelActive: {
    fontWeight: 700,
    textDecorationLine: 'underline',
    textDecorationColor: ACTIVE_UNDERLINE_COLOR,
    textDecorationThickness: '2px',
    textUnderlineOffset: '4px',
  },
}

const NavBox = ({ col, row, colSpan, rowSpan, label, active, onClick, breakpoint }) => {
  // The button for the section you're currently viewing is disabled (no
  // point scrolling to where you already are) and reads bold + underlined;
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
        ...(active ? { cursor: 'default' } : null),
      }}
    >
      <span
        style={{
          ...styles.navLabel,
          ...(breakpoint !== 'desktop' ? styles.navLabelCompact : null),
          ...(active ? styles.navLabelActive : null),
        }}
      >
        {label}
      </span>
    </div>
  )
}

export default NavBox
