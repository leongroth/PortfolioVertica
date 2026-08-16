import React from 'react'
import ACESMockup from './assets/Icons/Pictures/ACESMockup.png'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjectCardStyles } from './projectCardStyles'
import { TYPE } from './typography'

const ReactCard = ({ sectionIndex, breakpoint }) => {
    const styles = getProjectCardStyles(breakpoint, { imageWidth: '100%', lift: true })
    const [hovered, setHovered] = useState(false)
    const navigate = useNavigate()

  return (
    <div style={styles.mainContainer}>
      <img src={ACESMockup} style={styles.image}/>
      <div style={styles.container}>
        <div style={styles.containterTwo}>
            <h2 style={{...TYPE.h2, margin: 0}}>ACES</h2>
            <h6 style={{...TYPE.h6, margin: 0}}>Our own Accessibility tool</h6>
        </div>

        <button style={hovered ? styles.hoverBtn : styles.btn} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => navigate('/react', { state: { sectionIndex } })}>
            Read more
        </button>
      </div>
    </div>
  )
}

export default ReactCard
