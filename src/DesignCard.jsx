import React from 'react'
import FigmaMockup from './assets/Icons/Pictures/FigmaMockup.svg'

// On desktop the text is laid over the top of the Figma mockup, which fills
// the whole card. That only works while the card is big: below desktop the
// mockup is a fraction of the size and the text over it would be unreadable,
// so the two are stacked in normal flow instead - mockup first, words under
// it.
const DesignCard = ({ breakpoint }) => {
  const styles = breakpoint === 'desktop' ? overlayStyles : stackedStyles

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

const overlayStyles = {
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

const stackedStyles = {
    container: {
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
    },
    image: {
        width: '100%',
        maxHeight: '45%',
        objectFit: 'contain',
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
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
