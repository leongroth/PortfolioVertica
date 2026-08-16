import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import KMDMockup from './assets/Icons/Pictures/KMDMockup.png'
import { getProjectCardStyles } from './projectCardStyles'
import { TYPE } from './typography'

const AngularCard = ({ sectionIndex, breakpoint }) => {
    const styles = getProjectCardStyles(breakpoint, { imageWidth: '85%', lift: true })
    const [hovered, setHovered] = useState(false)
    const navigate = useNavigate()

  return (
    <div style={styles.mainContainer}>
      <img src={KMDMockup} style={styles.image}/>
      <div style={styles.container}>
        <div style={styles.containterTwo}>
            <h2 style={{...TYPE.h2, margin: 0}}>Angular Platform</h2>
            <h6 style={{...TYPE.h6, margin: 0}}>Platform development for KMD</h6>
        </div>
        <button style={hovered ? styles.hoverBtn : styles.btn} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => navigate('/angular', { state: { sectionIndex } })}>
            Read more
        </button>
      </div>
    </div>
  )
}

export default AngularCard
