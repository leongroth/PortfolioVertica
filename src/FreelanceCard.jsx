import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppMockup from './assets/Icons/Pictures/AppMockup.png'
import { TYPE } from './typography'

const FreelanceCard = () => {

    const [hover, setHover] = useState(styles.btn)
    const navigate = useNavigate()


  return (
    <div style={styles.mainContainer}>
      <img src={AppMockup} style={styles.image}/>
      <div style={styles.container}>
        <div style={styles.containterTwo}>
            <h2 style={{...TYPE.h2, margin: 0}}>Freelance work</h2>
            <h6 style={{...TYPE.h6, margin: 0}}>Application Design & Development</h6>
        </div>
        
        <button style={hover} onMouseEnter={() => {setHover(styles.hoverBtn)}} onMouseLeave={() => {setHover(styles.btn)}} onClick={() => navigate('/freelance')}>
            Read more
        </button>
      </div>
    </div>
  )
}

const styles = {
    mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        width: '100%',
        height: '100%',
        overflow: 'visible',
        alignItems: 'center',
        paddingBottom: '24px',
    },
    image: {
        width: '215px',
        position: 'relative',
        top: '-10%',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center',
    },
    containterTwo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    btn: {
        backgroundColor: '#FFAA00',
        padding: '16px 32px',
        width: 'fit-content',
        border: 'none',
        borderRadius: '16px',
    },
    hoverBtn: {
        backgroundColor: '#DE9400',
        padding: '16px 32px',
        width: 'fit-content',
        border: 'none',
        borderRadius: '16px',
    },

}

export default FreelanceCard






