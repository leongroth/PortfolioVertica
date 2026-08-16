import React from 'react'
import Leon from './assets/Icons/Pictures/Leon.png'
import { TYPE } from './typography'

// Photo beside the text on desktop and tablet, stacked above it on a phone,
// where a 3-column box has no room for two columns of anything. The photo is
// left at its natural size on desktop (which is what the layout was drawn
// around) and constrained by the box everywhere else.
const About = ({ breakpoint }) => {
  const styles = getStyles(breakpoint)

  return (
    <div style={styles.mainContainer}>
      <img src={Leon} style={styles.image} />
      <div style={styles.textContainer}>
        <div style={styles.headings}>
          <h1 style={{...TYPE.h1, margin: 0,}}>I'm Leon Groth</h1>
          <h6 style={{...TYPE.h6, margin: 0,}}>M.Sc. Interaction Design</h6>
        </div>
        <p style={TYPE.body}>Over the course of the last 5 years, i have studied interaction design at Aalborg University, and subsequently achieved a bachelors degree and a masters degree in the field. In my free time, i have worked hard on expanding my skills both in UI design and web development, and have even been fortunate enough to learn from some talented developers at KMD. This page is designed to show off some of the exciting projects I have worked on over the past years.</p>
      </div>
    </div>
  )
}

// One style set per breakpoint, built on first use and reused after that, so
// a re-render hands React the same objects and it can skip diffing them -
// see the note in projectCardStyles.js.
const cache = new Map()

const getStyles = (breakpoint) => {
  if (!cache.has(breakpoint)) cache.set(breakpoint, buildStyles(breakpoint))
  return cache.get(breakpoint)
}

const buildStyles = (breakpoint) => {
  const stacked = breakpoint === 'phone'

  return {
    mainContainer: {
      display: 'flex',
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      flexDirection: stacked ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: stacked ? '20px' : '32px',
      paddingRight: stacked ? '20px' : 0,
      paddingTop: stacked ? '20px' : 0,
      paddingBottom: stacked ? '20px' : 0,
      gap: stacked ? '16px' : '32px',
    },
    image: {
      // Desktop keeps the photo at its natural size, exactly as before; the
      // smaller layouts cap it against the box instead.
      ...(breakpoint === 'desktop'
        ? null
        : { maxHeight: stacked ? '30%' : '80%', maxWidth: stacked ? '50%' : '35%', objectFit: 'contain' }),
    },
    headings: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      justifyContent: 'center',
      alignItems: 'center',
    },
    textContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: stacked ? '16px' : '48px',
      justifyContent: 'center',
      width: '100%',
      paddingRight: stacked ? 0 : '32px',
    },
  }
}

export default About
