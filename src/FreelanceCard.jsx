import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppMockup from './assets/Icons/Pictures/AppMockup.png'
import { getProjectCardStyles } from './projectCardStyles'
import { TYPE } from './typography'

const FreelanceCard = ({ sectionIndex, breakpoint }) => {
    // A tall phone mockup rather than a wide screenshot, so it's sized in
    // pixels on desktop instead of as a share of the card's width.
    const styles = getProjectCardStyles(breakpoint, { imageWidth: '215px', lift: true })
    const [hovered, setHovered] = useState(false)
    const navigate = useNavigate()

  return (
    <div style={styles.mainContainer}>
      <img src={AppMockup} style={styles.image}/>
      <div style={styles.container}>
        <div style={styles.containterTwo}>
            <h2 style={{...TYPE.h2, margin: 0}}>Freelance work</h2>
            <h6 style={{...TYPE.h6, margin: 0}}>Application Design & Development</h6>
        </div>

        <button style={hovered ? styles.hoverBtn : styles.btn} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => navigate('/freelance', { state: { sectionIndex } })}>
            Read more
        </button>
      </div>
    </div>
  )
}

export default FreelanceCard
