import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ACESDesign from './assets/Icons/Pictures/ACESDesign.png'
import { getProjectCardStyles } from './projectCardStyles'
import { TYPE } from './typography'

// sectionIndex is handed to every card by TestGrid and passed along in
// router state so /aces' back button knows which section to return to;
// breakpoint comes from there too and picks the card's layout.
const ACESCard = ({ sectionIndex, breakpoint }) => {
    const styles = getProjectCardStyles(breakpoint)
    const [hovered, setHovered] = useState(false)
    const navigate = useNavigate()

  return (
    <div style={styles.mainContainer}>
      <img src={ACESDesign} style={styles.image}/>
      <div style={styles.container}>
        <div style={styles.containterTwo}>
            <h2 style={{...TYPE.h2, margin: 0}}>ACES</h2>
            <h6 style={{...TYPE.h6, margin: 0}}>Powered by Machine Learning</h6>
        </div>
        <button style={hovered ? styles.hoverBtn : styles.btn} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => navigate('/aces', { state: { sectionIndex } })}>
            Read more
        </button>
      </div>
    </div>
  )
}

export default ACESCard
