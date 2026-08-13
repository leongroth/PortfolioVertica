import React from 'react'
import FigmaMockup from './assets/Icons/Pictures/FigmaMockup.svg'

const DesignCard = () => {
  return (
    <div style={styles.container}>
        <img src={FigmaMockup} style={styles.image} />
        <div style={styles.textContainer}>
            <h1 style={styles.heading}>Designed in Figma</h1>
            <p style={styles.paragraph}>My Projects usually start in Figma, where i will wireframe and design iterations of the final product.
I am fortunate enough to have some very talented friends, who happily provide me with feedback, which allows me to gradually improve my designs from iteration to iteration.
I have partaken in the design process of each of the projects i have shared on this website.</p>
        </div>
    </div>
  )
}

const styles = {
    container: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    image: {
        position: 'absolute',
        inset: 0,
        width: '98%',
        height: '98%',
        paddingLeft: '2%',
        paddingTop: '2%'
    },
    textContainer: {
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        textAlign: 'center',
    },
    heading: {
        margin: 0,
    },
    paragraph: {
        margin: 0,
    },
}

export default DesignCard