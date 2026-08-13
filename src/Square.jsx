import React from 'react'
import { RADIUS, LINE_COLOR, gridPlacement } from './gridConstants'
import { TYPE } from './typography'

const styles = {
  wrapper: {
    position: 'relative',
  },
  svg: {
    width: '100%',
    height: '100%',
    display: 'block',
  },
  icon: {
    position: 'absolute',
    width: '35%',
    height: '35%',
    opacity: 0.5,
    pointerEvents: 'none',
  },
  flairText: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    ...TYPE.caption,
    fontWeight: 700, // caption size, but bold per request
    color: '#999999',
    opacity: 0.7,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  },
}

// Corner positions inset a bit from the edge; center is, well, centered.
const ICON_POSITION_STYLES = {
  center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  'top-left': { top: '12%', left: '12%' },
  'top-right': { top: '12%', right: '12%' },
  'bottom-left': { bottom: '12%', left: '12%' },
  'bottom-right': { bottom: '12%', right: '12%' },
}

const TEXT_POSITION_STYLES = {
  top: { top: '10%' },
  bottom: { bottom: '10%' },
}

const Square = ({ col, row, colSpan, rowSpan, icon, iconPosition, flairText, flairTextPosition }) => (
  <div style={{ ...styles.wrapper, ...gridPlacement(col, row, colSpan, rowSpan) }}>
    <svg style={styles.svg} preserveAspectRatio="none">
      <rect x="0" y="0" width="100%" height="100%" rx={RADIUS} ry={RADIUS} fill="none" stroke={LINE_COLOR} strokeWidth="1" />
    </svg>
    {icon && <img src={icon} alt="" style={{ ...styles.icon, ...ICON_POSITION_STYLES[iconPosition] }} />}
    {flairText && <span style={{ ...styles.flairText, ...TEXT_POSITION_STYLES[flairTextPosition] }}>{flairText}</span>}
  </div>
)

export default Square
