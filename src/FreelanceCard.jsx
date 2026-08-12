import React from 'react'
import { useState } from 'react'
import AppMockup from './assets/Icons/Pictures/AppMockup.png'

const FreelanceCard = () => {

    const [hover, setHover] = useState(styles.btn)


  return (
    <div style={styles.mainContainer}>
      <img src={AppMockup} style={styles.image}/>
      <div style={styles.container}>
        <h2 style={{margin: 0}}>ACES</h2>
        <h6 style={{margin: 0}}>Our own Accessibility tool</h6>
        <button style={hover} onMouseEnter={() => {setHover(styles.hoverBtn)}} onMouseLeave={() => {setHover(styles.btn)}}>
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
        width: '100%',
        height: '100%',
        overflow: 'show',
        alignItems: 'center',
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
    btn: {
        backgroundColor: '#FFAA00',
        padding: '8px 16px',
        width: 'fit-content',
        border: 'none',
        borderRadius: '16px',
    },
    hoverBtn: {
        backgroundColor: '#DE9400',
        padding: '8px 16px',
        width: 'fit-content',
        border: 'none',
        borderRadius: '16px',
    },

}

export default FreelanceCard






