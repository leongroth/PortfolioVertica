import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { RADIUS, LINE_COLOR, BOX_SHADOW } from './gridConstants'
import { TYPE } from './typography'

// Fixed (viewport-anchored, not grid-anchored) way back to the main page for
// content pages, which have no nav bar of their own. It's `position: fixed`
// rather than a grid cell precisely because a content page can be several
// screens tall - the button has to stay in the top-left corner while the
// grid scrolls underneath it.
//
// Where it goes back to: whichever card sent you here passes its own section
// index along in router state (see e.g. ACESCard), so this hands that same
// index back to the main page and you land on the section you left from
// rather than at the very top. Without it (e.g. someone opened /aces
// directly) it just goes to the top of the main page.
const BackButton = ({ label = 'Back' }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [hover, setHover] = useState(false)

  const sectionIndex = location.state?.sectionIndex

  const handleClick = () => {
    navigate('/', { state: sectionIndex !== undefined ? { sectionIndex } : null })
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...styles.button, ...(hover ? styles.buttonHover : null) }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M15 18 L9 12 L15 6" />
      </svg>
      <span>{label}</span>
    </button>
  )
}

const styles = {
  button: {
    position: 'fixed',
    top: 24,
    left: 24,
    // Above both the decorative squares and the content box (which sits at
    // zIndex 1) so nothing scrolls over the top of it.
    zIndex: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 18px 10px 14px',
    backgroundColor: '#FFFFFF',
    border: `1px solid ${LINE_COLOR}`,
    borderRadius: RADIUS,
    boxShadow: BOX_SHADOW,
    cursor: 'pointer',
    ...TYPE.h6,
    color: '#333333',
  },
  buttonHover: {
    backgroundColor: '#F8F8F8',
  },
}

export default BackButton
