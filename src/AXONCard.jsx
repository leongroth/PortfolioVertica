import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AXONDesing from './assets/Icons/Pictures/AXONDesign.png'
import { getProjectCardStyles } from './projectCardStyles'
import { TYPE } from './typography'

const AXONCard = ({ sectionIndex, breakpoint }) => {
    const styles = getProjectCardStyles(breakpoint)
    const [hovered, setHovered] = useState(false)
    const navigate = useNavigate()

  return (
    <div style={styles.mainContainer}>
      <img src={AXONDesing} style={styles.image}/>
      <div style={styles.container}>
        <div style={styles.containterTwo}>
            <h2 style={{...TYPE.h2, margin: 0}}>AXON</h2>
            <h6 style={{...TYPE.h6, margin: 0}}>Accessibility chatbot</h6>
        </div>
        <button style={hovered ? styles.hoverBtn : styles.btn} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => navigate('/axon', { state: { sectionIndex } })}>
            Read more
        </button>
      </div>
    </div>
  )
}

export default AXONCard
