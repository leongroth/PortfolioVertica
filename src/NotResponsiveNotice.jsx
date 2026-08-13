import React from 'react'
import { BG_COLOR, CARD_SHELL_STYLE } from './gridConstants'
import { TYPE } from './typography'

// Shown instead of the real site below MOBILE_BLOCK_MAX_WIDTH (see App.jsx
// and gridConstants.js) - the grid layout isn't genuinely usable yet at
// phone widths, so this stands in until it is.
const NotResponsiveNotice = () => (
  <div style={styles.page}>
    <div style={styles.card}>
      <p style={styles.text}>
        This is a work in progress and the site is not yet fully responsive!
        Please visit it from a computer for the best experience, or try again
        at a later date.
      </p>
    </div>
  </div>
)

const styles = {
  page: {
    width: '100vw',
    height: '100vh',
    boxSizing: 'border-box',
    backgroundColor: BG_COLOR,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  card: {
    ...CARD_SHELL_STYLE,
    boxSizing: 'border-box',
    maxWidth: '420px',
    padding: '32px',
  },
  text: {
    ...TYPE.body,
    margin: 0,
    textAlign: 'center',
    color: '#111111',
  },
}

export default NotResponsiveNotice
